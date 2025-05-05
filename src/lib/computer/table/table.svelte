<script lang="ts">
	import { SquareMinus, SquarePlus, Plus, Minus, Power, Play, CirclePlus } from 'lucide-svelte';
	import { Badge } from '$lib/components/ui/badge';
	import { droppable, draggable, type DragDropState } from '@thisux/sveltednd';
	import { flip } from 'svelte/animate';
	import { writable, derived, type Writable, type Readable } from 'svelte/store';
	import { fade } from 'svelte/transition';
	import { BadgeCheck, BadgeMinus, BadgeAlert } from 'lucide-svelte';
	import { computersStore, teamStore, regionStore, userStore } from '$lib/stores';
	import type { ComputersResponse } from '$lib/types';
	import { toastApi, shield, createComputer as utilsCreateComputer } from '$lib/utils';
	import { icon } from '$lib/config';
	import { pb } from '$lib/pocketbase/client';

	import { ExecutionsButton } from '$lib/execution';
	import * as Dialog from '$lib/components/ui/dialog';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import * as Tooltip from '$lib/components/ui/tooltip';
	import { onDestroy, onMount } from 'svelte';
	import { toast } from 'svelte-sonner';
	import { goto } from '$app/navigation';

	let unsubscribe: () => Promise<void> = async () => {};

	onMount(async () => {
		unsubscribe = await pb.collection('executions').subscribe(
			'*',
			({ action, record }) => {
				if (action === 'update' && record.status === '2') {
					toast.success(
						`Execution ${record.id} completed after ${record.duration.toFixed(1)} seconds.`
					);
				} else if (action === 'update' && record.status === '3') {
					const computer = $computersStore.find((c) => c.id === record.computer);
					toast.error(
						`Execution ${record.id} failed on computer ${computer?.name} after ${record.duration.toFixed(1)} seconds.`
					);
					goto(
						'/' +
							$teamStore?.name +
							'/' +
							$regionStore?.name +
							'/' +
							computer?.name +
							'/' +
							record.id
					);
				}
			},
			{
				filter: `invisible = false && status = '2' || status = '3' && computer.region.id = "${shield($regionStore?.id as string)} && user.id = "${shield($userStore?.id as string)}"`
			}
		);
	});

	onDestroy(async () => {
		await unsubscribe();
	});

	// Вспомогательные функции
	function getAvatarUrl(id: string, size: number = 100): string {
		const hash = id.trim().toLowerCase();
		return `https://avatar.vercel.sh/${hash}?size=${size}`;
	}

	function getStatusInfo(status: '0' | '1' | '2'): {
		color: string;
		bgColor: string;
		label: string;
		icon: typeof BadgeCheck | typeof BadgeMinus | typeof BadgeAlert;
	} {
		switch (status) {
			case '0':
				return {
					color: 'text-red-500',
					bgColor: 'bg-red-500/10',
					label: 'Offline',
					icon: BadgeAlert
				};
			case '1':
				return {
					color: 'text-yellow-500',
					bgColor: 'bg-yellow-500/10',
					label: 'Busy',
					icon: BadgeMinus
				};
			case '2':
				return {
					color: 'text-green-500',
					bgColor: 'bg-green-500/10',
					label: 'Active',
					icon: BadgeCheck
				};
			default:
				return {
					color: 'text-gray-500',
					bgColor: 'bg-gray-500/10',
					label: 'Unknown',
					icon: BadgeMinus
				};
		}
	}

	const statusColorMap = {
		0: 'red-500',
		1: 'yellow-500',
		2: 'green-500'
	};

	const statusLabelMap = {
		0: 'Offline',
		1: 'Busy',
		2: 'Enabled'
	};

	const selectedComputersSet: Writable<Set<string>> = writable(new Set());

	// Store для выбранных компьютеров
	const selectedComputers: Readable<ComputersResponse[]> = derived(
		[selectedComputersSet, computersStore],
		([$selectedComputersSet, $computersStore]) => {
			return $computersStore.filter((computer) => $selectedComputersSet.has(computer.id));
		}
	);

	// Derived stores для компьютеров разных категорий с учетом выбранных
	const filteredComputers: Readable<ComputersResponse[]> = derived(
		[computersStore, selectedComputersSet],
		([$computersStore, $selectedComputersSet]) => {
			return $computersStore.filter((computer) => !$selectedComputersSet.has(computer.id));
		}
	);

	// Создаем derived stores для разных категорий
	const disabledComputers = derived(filteredComputers, ($filtered) =>
		$filtered.filter((computer) => computer.status === '0')
	);

	const busyComputers = derived(filteredComputers, ($filtered) =>
		$filtered.filter((computer) => computer.status === '1')
	);

	const activeComputers = derived(filteredComputers, ($filtered) =>
		$filtered.filter((computer) => computer.status === '2')
	);

	// Функция для обновления статуса компьютера - теперь просто логирует
	async function updateComputerStatus(
		computer: ComputersResponse,
		oldStatus: '0' | '1' | '2',
		newStatus: '0' | '1' | '2'
	): Promise<void> {
		console.log(`Updating computer ${computer.id} to status ${newStatus} from ${oldStatus}`);
	}

	function selectComputer(computer: ComputersResponse): void {
		selectedComputersSet.update(($selected) => {
			$selected.add(computer.id);
			return $selected;
		});
	}

	function unselectComputer(computer: ComputersResponse): void {
		selectedComputersSet.update(($selected) => {
			$selected.delete(computer.id);
			return $selected;
		});
	}

	// Обработчик перетаскивания
	async function handleDrop(
		state: DragDropState<ComputersResponse>,
		targetStatus: '0' | '1' | '2' | 'selected'
	): Promise<void> {
		const { sourceContainer, targetContainer, draggedItem } = state;

		if (targetStatus === sourceContainer) {
			return;
		}

		console.log(`Dragged from ${sourceContainer} to ${targetContainer}:`, draggedItem.name);

		if (targetStatus === 'selected') {
			selectComputer(draggedItem);
		} else if (sourceContainer === 'selected') {
			unselectComputer(draggedItem);

			if (draggedItem.status !== targetStatus) {
				await updateComputerStatus(draggedItem, draggedItem.status, targetStatus);
			}
		} else {
			await updateComputerStatus(draggedItem, draggedItem.status, targetStatus);
		}
	}

	const computerDialogOpen = writable(false);
	const computerForm = writable({
		name: ''
	});

	async function createComputer(name: string) {
		const result = utilsCreateComputer(name);
		computerDialogOpen.set(false);
		await result;
	}
</script>

<Dialog.Root bind:open={$computerDialogOpen}>
	<Dialog.Trigger>
		{#snippet child({ props })}
			<Button {...props} variant="outline" class="mb-4 w-full"
				>Create computer<CirclePlus class={icon.left} /></Button
			>
		{/snippet}
	</Dialog.Trigger>
	<Dialog.Content class="sm:max-w-[425px]" trapFocus={false}>
		<Dialog.Header>
			<Dialog.Title>Create computer</Dialog.Title>
			<Dialog.Description>Enter your new computer name.</Dialog.Description>
		</Dialog.Header>
		<form
			class="flex gap-2"
			onsubmit={toastApi.execAsync(
				async () => await createComputer($computerForm.name),
				`Computer ${$computerForm.name} created.`,
				`Failed to create computer ${$computerForm.name}, my be this computer already exists.`
			)}
		>
			<div class="grid w-full grid-cols-1 gap-2">
				<Input id="name" placeholder="Computer name" bind:value={$computerForm.name} required />
			</div>
			<Button type="submit" class="h-full">Create</Button>
		</form>
	</Dialog.Content>
</Dialog.Root>

<div class="grid animate-fade-in-up grid-cols-2 gap-6 max-xl:grid-cols-1">
	<!-- Disabled Computers Column -->
	<div
		class="min-h-[148px] rounded-xl bg-red-500/10 p-4 shadow-sm ring-1 ring-border"
		use:droppable={{
			container: 'disabled',
			callbacks: { onDrop: async (state: any) => await handleDrop(state, '0') }
		}}
	>
		<div class="mb-4 flex items-center justify-between">
			<h2 class="font-semibold text-foreground">
				<span class="rounded-full bg-red-500/20 px-2.5 py-0.5 text-sm text-red-500">
					{$disabledComputers.length}
				</span>
				<span class="ml-2"> Offline Computers </span>
			</h2>
			{#if $disabledComputers.length > 0}
				<button
					class="rounded-full bg-red-500/10 px-2.5 py-0.5 text-sm text-red-500/50"
					onclick={() => {
						for (const computer of $disabledComputers) {
							selectComputer(computer);
						}
					}}
				>
					<Plus />
				</button>
			{:else if $selectedComputers.filter((computer) => {
				return computer.status === '0';
			}).length > 0}
				<button
					class="rounded-full bg-red-500/10 px-2.5 py-0.5 text-sm text-red-500/50"
					onclick={() => {
						for (const computer of $selectedComputers.filter((computer) => {
							return computer.status === '0';
						})) {
							unselectComputer(computer);
						}
					}}
				>
					<Minus />
				</button>
			{:else}
				<div class="p-[14px] opacity-0"></div>
			{/if}
		</div>

		<div class="h-[calc(100%-44px)] min-h-[68px] space-y-3">
			{#each $disabledComputers as computer (computer.id)}
				<div animate:flip={{ duration: 200 }}>
					{@render computerCard(computer, 'disabled')}
				</div>
			{/each}

			{#if $disabledComputers.length === 0}
				{@render emptyPlaceholder('No offline computers', 'border-red-500/30')}
			{/if}
		</div>
	</div>

	<!-- Busy Computers Column -->
	<div
		class="min-h-[148px] rounded-xl bg-yellow-500/10 p-4 shadow-sm ring-1 ring-border"
		use:droppable={{
			container: 'busy',
			callbacks: { onDrop: async (state: any) => await handleDrop(state, '1') }
		}}
	>
		<div class="mb-4 flex items-center justify-between">
			<h2 class="font-semibold text-foreground">
				<span class="rounded-full bg-yellow-500/20 px-2.5 py-0.5 text-sm text-yellow-500">
					{$busyComputers.length}
				</span>
				<span class="ml-2"> Busy Computers </span>
			</h2>
			{#if $busyComputers.length > 0}
				<button
					class="rounded-full bg-yellow-500/10 px-2.5 py-0.5 text-sm text-yellow-500/50"
					onclick={() => {
						for (const computer of $busyComputers) {
							selectComputer(computer);
						}
					}}
				>
					<Plus />
				</button>
			{:else if $selectedComputers.filter((computer) => {
				return computer.status === '1';
			}).length > 0}
				<button
					class="rounded-full bg-yellow-500/10 px-2.5 py-0.5 text-sm text-yellow-500/50"
					onclick={() => {
						for (const computer of $selectedComputers.filter((computer) => {
							return computer.status === '1';
						})) {
							unselectComputer(computer);
						}
					}}
				>
					<Minus />
				</button>
			{:else}
				<div class="p-[14px] opacity-0"></div>
			{/if}
		</div>

		<div class="h-[calc(100%-44px)] min-h-[68px] space-y-3">
			{#each $busyComputers as computer (computer.id)}
				<div animate:flip={{ duration: 200 }}>
					{@render computerCard(computer, 'busy')}
				</div>
			{/each}

			{#if $busyComputers.length === 0}
				{@render emptyPlaceholder('No busy computers', 'border-yellow-500/30')}
			{/if}
		</div>
	</div>

	<!-- Active Computers Column -->
	<div
		class="min-h-[148px] rounded-xl bg-green-500/10 p-4 shadow-sm ring-1 ring-border"
		use:droppable={{
			container: 'active',
			callbacks: { onDrop: async (state: any) => await handleDrop(state, '2') }
		}}
	>
		<div class="mb-4 flex items-center justify-between">
			<h2 class="font-semibold text-foreground">
				<span class="rounded-full bg-green-500/20 px-2.5 py-0.5 text-sm text-green-500">
					{$activeComputers.length}
				</span>
				<span class="ml-2"> Active Computers </span>
			</h2>
			{#if $activeComputers.length > 0}
				<button
					class="rounded-full bg-green-500/10 px-2.5 py-0.5 text-sm text-green-500/50"
					onclick={() => {
						for (const computer of $activeComputers) {
							selectComputer(computer);
						}
					}}
				>
					<Plus />
				</button>
			{:else if $selectedComputers.filter((computer) => {
				return computer.status === '2';
			}).length > 0}
				<button
					class="rounded-full bg-green-500/10 px-2.5 py-0.5 text-sm text-green-500/50"
					onclick={() => {
						for (const computer of $selectedComputers.filter((computer) => {
							return computer.status === '2';
						})) {
							unselectComputer(computer);
						}
					}}
				>
					<Minus />
				</button>
			{:else}
				<div class="p-[14px] opacity-0"></div>
			{/if}
		</div>

		<div class="h-[calc(100%-44px)] min-h-[68px] space-y-3">
			{#each $activeComputers as computer (computer.id)}
				<div animate:flip={{ duration: 200 }}>
					{@render computerCard(computer, 'active')}
				</div>
			{/each}

			{#if $activeComputers.length === 0}
				{@render emptyPlaceholder('No active computers', 'border-green-500/30')}
			{/if}
		</div>
	</div>

	<!-- Selected Computers Column -->
	<div
		class="min-h-[148px] rounded-xl bg-primary/10 p-4 shadow-sm ring-1 ring-border"
		use:droppable={{
			container: 'selected',
			callbacks: { onDrop: async (state: any) => await handleDrop(state, 'selected') }
		}}
	>
		<div class="mb-4 flex items-center justify-between">
			<h2 class="font-semibold text-foreground">
				<span class="rounded-full bg-primary/20 px-2.5 py-0.5 text-sm text-primary">
					{$selectedComputers.length}
				</span>
				<span class="ml-2"> Selected Computers </span>
			</h2>
			{#if $selectedComputers.length > 0}
				<ExecutionsButton {selectedComputers} />
			{:else}
				<div class="p-[14px] opacity-0"></div>
			{/if}
		</div>
		<div class="h-[calc(100%-44px)] min-h-[68px] space-y-3">
			{#each $selectedComputers as computer (computer.id)}
				<div animate:flip={{ duration: 200 }}>
					{@render computerCard(computer, 'selected')}
				</div>
			{/each}

			{#if $selectedComputers.length === 0}
				{@render emptyPlaceholder('Drop computers here', 'border-primary/30')}
			{/if}
		</div>
	</div>
</div>

{#snippet computerCard(computer: ComputersResponse, containerType: string)}
	<div
		use:draggable={{ container: containerType, dragData: computer, interactive: ['button', 'a'] }}
		in:fade={{ duration: 150 }}
		out:fade={{ duration: 150 }}
		class="group cursor-move rounded-lg bg-card p-3 shadow-sm ring-1 ring-border
		transition-all duration-200 hover:shadow-md hover:ring-2 hover:ring-primary/20"
	>
		<div class="flex items-center justify-between gap-3">
			<Tooltip.Root>
				<Tooltip.Trigger>
					<a
						class="z-50 flex flex-row items-center"
						href="/{$teamStore?.name as string}/{$regionStore?.name as string}/{computer.name}"
					>
						<img
							src={getAvatarUrl(computer.id, 48)}
							alt={computer.name}
							class="h-12 w-12 rounded-full"
						/>

						<div class="ml-3 flex-1">
							<h3 class="text-left font-medium text-foreground">{computer.name}</h3>

							<div class="flex items-center gap-1">
								<p class="text-sm text-muted-foreground">{computer.ip || 'No IP'}</p>
								<span class="text-{statusColorMap[computer.status]}">
									<svelte:component
										this={getStatusInfo(computer.status).icon}
										class="h-3.5 w-3.5"
									/>
								</span>
							</div>
						</div>
					</a>
				</Tooltip.Trigger>
				<Tooltip.Content>
					<pre class="max-w-xs overflow-x-auto text-xs">{JSON.stringify(
							{
								id: computer.id,
								name: computer.name,
								ip: computer.ip,
								mac: computer.mac,
								status: computer.status,
								token: computer.token,
								data: computer.data
							},
							null,
							4
						)}</pre>
				</Tooltip.Content>
			</Tooltip.Root>
			<div class="flex gap-3">
				<Badge
					class="bg-{statusColorMap[computer.status]} hover:bg-{statusColorMap[
						computer.status
					]}/60 shadow-sm ring-1
		ring-border hover:shadow-md hover:ring-2 hover:ring-primary/20 max-sm:hidden"
				>
					<span>{statusLabelMap[computer.status]}</span>
				</Badge>
				{#if containerType !== 'selected'}
					<button
						class="text-right text-card-foreground/50"
						onclick={() => {
							selectComputer(computer);
						}}
					>
						<SquarePlus />
					</button>
				{:else}
					<button
						class="text-right text-card-foreground/50"
						onclick={() => {
							unselectComputer(computer);
						}}
					>
						<SquareMinus />
					</button>
				{/if}
			</div>
		</div>
	</div>
{/snippet}

{#snippet emptyPlaceholder(text: string, borderColor: string)}
	<div
		class="flex h-full items-center justify-center rounded-lg border-2 border-dashed
		{borderColor} text-sm text-muted-foreground"
	>
		{text}
	</div>
{/snippet}
