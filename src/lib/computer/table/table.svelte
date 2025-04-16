<script lang="ts">
	import { SquareMinus, SquarePlus } from 'lucide-svelte';
	import { Badge } from '$lib/components/ui/badge';
	import { droppable, draggable, type DragDropState } from '@thisux/sveltednd';
	import { flip } from 'svelte/animate';
	import { writable, derived, type Writable, type Readable } from 'svelte/store';
	import { fade } from 'svelte/transition';
	import { BadgeCheck, BadgeMinus, BadgeAlert } from 'lucide-svelte';
	import { computersStore } from '$lib/stores';
	import type { ComputersResponse } from '$lib/types';
	import { toast } from 'svelte-sonner';

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
					label: 'Idle',
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
		1: 'Idle',
		2: 'Enabled'
	};

	// Store для выбранных компьютеров
	const selectedComputers: Writable<ComputersResponse[]> = writable<ComputersResponse[]>([]);

	computersStore.subscribe((computers) => {
		// Логика для обновления состояния выбранных компьютеров при изменении списка компьютеров
		const find_pc = (id: string) => {
			return computers.find((computer) => computer.id === id);
		};

		selectedComputers.update(($selected) => {
			for (const computer of $selected) {
				const found = find_pc(computer.id);
				if (!found) {
					$selected = $selected.filter((comp) => comp.id !== computer.id);
				} else if (found !== computer) {
					$selected = $selected.map((comp) => (comp.id === found.id ? found : comp));
				}
			}

			return $selected;
		});
	});

	// Derived stores для компьютеров разных категорий с учетом выбранных
	const filteredComputers: Readable<ComputersResponse[]> = derived(
		[computersStore, selectedComputers],
		([$computersStore, $selectedComputers]) => {
			// Создаем Set из ID выбранных компьютеров для быстрого поиска
			const selectedIds = new Set($selectedComputers.map((comp) => comp.id));

			// Возвращаем только те компьютеры, которые не выбраны
			return $computersStore.filter((computer) => !selectedIds.has(computer.id));
		}
	);

	// Создаем derived stores для разных категорий
	const disabledComputers = derived(filteredComputers, ($filtered) =>
		$filtered.filter((computer) => computer.status === '0')
	);

	const idleComputers = derived(filteredComputers, ($filtered) =>
		$filtered.filter((computer) => computer.status === '1')
	);

	const activeComputers = derived(filteredComputers, ($filtered) =>
		$filtered.filter((computer) => computer.status === '2')
	);

	// Функция для обновления статуса компьютера - теперь просто логирует
	function updateComputerStatus(computerId: string, newStatus: '0' | '1' | '2'): void {
		console.log(`Updating computer ${computerId} to status ${newStatus}`);
	}

	// Обработчик перетаскивания
	function handleDrop(
		state: DragDropState<ComputersResponse>,
		targetStatus: '0' | '1' | '2' | 'selected'
	): void {
		const { sourceContainer, targetContainer, draggedItem } = state;

		console.log(`Dragged from ${sourceContainer} to ${targetContainer}:`, draggedItem.name);

		if (targetStatus === 'selected' && sourceContainer === 'disabled') {
			toast.error("Can't select disabled computer");
		} else if (targetStatus === 'selected') {
			// Перетаскивание в выбранные компьютеры
			selectedComputers.update(($selected) => {
				// Проверяем, не добавлен ли уже этот компьютер
				if (!$selected.some((comp) => comp.id === draggedItem.id)) {
					return [...$selected, draggedItem];
				}
				return $selected;
			});
		} else if (sourceContainer === 'selected') {
			// Перетаскивание из выбранных компьютеров обратно в основные категории
			selectedComputers.update(($selected) =>
				$selected.filter((comp) => comp.id !== draggedItem.id)
			);

			// Логируем изменение статуса
			if (draggedItem.status !== targetStatus) {
				updateComputerStatus(draggedItem.id, targetStatus);
			}
		} else {
			// Перетаскивание между категориями состояний
			updateComputerStatus(draggedItem.id, targetStatus);
		}
	}

	function selectComputer(computer: ComputersResponse): void {
		if (computer.status === '0') {
			toast.error("Can't select disabled computer");
		} else {
			selectedComputers.update(($selected) => {
				if ($selected.some((comp) => comp.id === computer.id)) {
					return $selected.filter((comp) => comp.id !== computer.id);
				} else {
					return [...$selected, computer];
				}
			});
		}
	}

	function unselectComputer(computer: ComputersResponse): void {
		selectedComputers.update(($selected) => $selected.filter((comp) => comp.id !== computer.id));
	}
</script>

<div class="grid grid-cols-2 gap-6 max-lg:grid-cols-1">
	<!-- Disabled Computers Column -->
	<div
		class="rounded-xl bg-red-500/10 p-4 shadow-sm ring-1 ring-border"
		use:droppable={{
			container: 'disabled',
			callbacks: { onDrop: (state: any) => handleDrop(state, '0') }
		}}
	>
		<div class="mb-4 flex items-center justify-between">
			<h2 class="font-semibold text-foreground">Offline Computers</h2>
			<span class="rounded-full bg-red-500/20 px-2.5 py-0.5 text-sm text-red-500">
				{$disabledComputers.length}
			</span>
		</div>

		<div class="space-y-3">
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

	<!-- Idle Computers Column -->
	<div
		class="rounded-xl bg-yellow-500/10 p-4 shadow-sm ring-1 ring-border"
		use:droppable={{
			container: 'idle',
			callbacks: { onDrop: (state: any) => handleDrop(state, '1') }
		}}
	>
		<div class="mb-4 flex items-center justify-between">
			<h2 class="font-semibold text-foreground">Idle Computers</h2>
			<span class="rounded-full bg-yellow-500/20 px-2.5 py-0.5 text-sm text-yellow-500">
				{$idleComputers.length}
			</span>
		</div>

		<div class="space-y-3">
			{#each $idleComputers as computer (computer.id)}
				<div animate:flip={{ duration: 200 }}>
					{@render computerCard(computer, 'idle')}
				</div>
			{/each}

			{#if $idleComputers.length === 0}
				{@render emptyPlaceholder('No idle computers', 'border-yellow-500/30')}
			{/if}
		</div>
	</div>

	<!-- Active Computers Column -->
	<div
		class="rounded-xl bg-green-500/10 p-4 shadow-sm ring-1 ring-border"
		use:droppable={{
			container: 'active',
			callbacks: { onDrop: (state: any) => handleDrop(state, '2') }
		}}
	>
		<div class="mb-4 flex items-center justify-between">
			<h2 class="font-semibold text-foreground">Active Computers</h2>
			<span class="rounded-full bg-green-500/20 px-2.5 py-0.5 text-sm text-green-500">
				{$activeComputers.length}
			</span>
		</div>

		<div class="space-y-3">
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
		class="rounded-xl bg-primary/10 p-4 shadow-sm ring-1 ring-border"
		use:droppable={{
			container: 'selected',
			callbacks: { onDrop: (state: any) => handleDrop(state, 'selected') }
		}}
	>
		<div class="mb-4 flex items-center justify-between">
			<h2 class="font-semibold text-foreground">Selected Computers</h2>
			<span class="rounded-full bg-primary/20 px-2.5 py-0.5 text-sm text-primary">
				{$selectedComputers.length}
			</span>
		</div>

		<div class="space-y-3">
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
		use:draggable={{ container: containerType, dragData: computer, interactive: ['button'] }}
		in:fade={{ duration: 150 }}
		out:fade={{ duration: 150 }}
		class="group cursor-move rounded-lg bg-card p-3 shadow-sm ring-1 ring-border
		transition-all duration-200 hover:shadow-md hover:ring-2 hover:ring-primary/20"
	>
		<div class="flex items-center gap-3">
			<img
				src={getAvatarUrl(computer.mac || computer.name, 48)}
				alt={computer.name}
				class="h-12 w-12 rounded-full ring-2 ring-background"
			/>
			<div class="flex-1">
				<h3 class="font-medium text-foreground">{computer.name}</h3>
				<div class="flex items-center gap-1">
					<p class="text-sm text-muted-foreground">{computer.ip || 'No IP'}</p>
					<span class="text-{statusColorMap[computer.status]}">
						<svelte:component this={getStatusInfo(computer.status).icon} class="h-3.5 w-3.5" />
					</span>
				</div>
			</div>
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
{/snippet}

{#snippet emptyPlaceholder(text: string, borderColor: string)}
	<div
		class="flex h-32 items-center justify-center rounded-lg border-2 border-dashed
		{borderColor} text-sm text-muted-foreground"
	>
		{text}
	</div>
{/snippet}
