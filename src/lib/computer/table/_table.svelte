<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import * as Table from '$lib/components/ui/table';

	import { Checkbox } from '$lib/components/ui/checkbox';
	import * as Dialog from '$lib/components/ui/dialog';
	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';
	import Status from '$lib/components/ui/status/status.svelte';

	import { icon } from '$lib/config';
	import { toastApi, cn, contains, createComputer as utilsCreateComputer } from '$lib/utils';
	import { writable, derived, type Writable } from 'svelte/store';
	import { PlusCircle } from 'lucide-svelte';
	import { computersStore, selectedComputers } from '$lib/stores';
	import type { ComputersResponse } from '$lib/types';
	import { slide } from 'svelte/transition';
	// import { isOwner } from '$lib/store/team_store';

	export let filterPhrase: Writable<string>;

	const filtered = derived([computersStore, filterPhrase], ([$computersStore, $filterPhrase]) => {
		return $computersStore.filter((computer) => {
			return computer.name.toLowerCase().includes($filterPhrase.toLowerCase());
		});
	});

	const toggle = {
		all: () => {
			if (contains($selectedComputers, $filtered)) {
				$selectedComputers = [];
			} else {
				$selectedComputers = $filtered;
			}
		},
		checked: (computer: ComputersResponse) => {
			if ($selectedComputers.includes(computer)) {
				$selectedComputers = $selectedComputers.filter((item) => item.id !== computer.id);
			} else {
				$selectedComputers = [...$selectedComputers, computer];
			}
		}
	};

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

<Card.Root class="w-full overflow-hidden p-0">
	<Card.Content class={cn('p-0', $$props.class)}>
		<Table.Root>
			<Table.Header>
				<Table.Row class={contains($selectedComputers, $filtered) ? 'bg-muted/10' : ''}>
					<Table.Head class="h-12">
						{#if $filtered.length > 0}
							<Checkbox
								class="ml-4 border-foreground/50"
								checked={contains($selectedComputers, $filtered)}
								onclick={(event: { preventDefault: () => void }) => {
									event.preventDefault();
									toggle.all();
								}}
							/>
						{/if}
					</Table.Head>
					<Table.Head>Name</Table.Head>
					<Table.Head>Status</Table.Head>
					<Table.Head />
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{#each $filtered as computer (computer.id)}
					<Table.Row class={$selectedComputers.includes(computer) ? 'bg-muted/20' : ''}>
						<Table.Cell class="h-12 w-[100px]">
							<Checkbox
								class="ml-4 border-foreground/50"
								checked={$selectedComputers.includes(computer)}
								onclick={(event: any) => {
									event.preventDefault();
									toggle.checked(computer);
								}}
							/>
						</Table.Cell>
						<Table.Cell class="font-medium">{computer.name}</Table.Cell>
						<Table.Cell><Status status={computer.status} /></Table.Cell>
						<Table.Cell class="text-right"></Table.Cell>
					</Table.Row>
				{/each}
			</Table.Body>
		</Table.Root>
		<!-- {#if $isOwner} -->
		<Dialog.Root bind:open={$computerDialogOpen}>
			<Dialog.Trigger>
				{#snippet child({ props })}
					<Button
						{...props}
						variant="outline"
						class={cn(
							'h-12 w-full rounded-none border-0',
							$filtered.length > 0 ? 'border-t-[1px]' : ''
						)}
						>Create computer
						<PlusCircle class={icon.left} /></Button
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
					on:submit|preventDefault={toastApi.execAsync(
						async () => await createComputer($computerForm.name),
						`Computer ${$computerForm.name} created.`,
						`Failed to create computer ${$computerForm.name}, my be this computer already exists.`
					)}
				>
					<div class="grid w-full grid-cols-1 gap-2">
						<Input id="name" placeholder="Computer name" bind:value={$computerForm.name} required />
					</div>
					<Button type="submit" class="h-full">Create <PlusCircle class={icon.left} /></Button>
				</form>
			</Dialog.Content>
		</Dialog.Root>
		<!-- {/if} -->
	</Card.Content>
</Card.Root>
