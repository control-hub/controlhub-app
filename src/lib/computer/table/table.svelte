<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import * as Table from '$lib/components/ui/table';

	import { Checkbox } from '$lib/components/ui/checkbox';
	import * as Dialog from '$lib/components/ui/dialog';
	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';
	import Status from '$lib/components/ui/status/status.svelte';

	import { icon } from '$lib/config';
	import { shield, toastApi, cn } from '$lib/utils';
	import { writable, derived, type Writable } from 'svelte/store';
	import { PlusCircle } from 'lucide-svelte';
	import { CollectionStore } from 'pocketbase-store';
	import type { ComputersResponse, RegionsResponse } from '$lib/types';
	// import { isOwner } from '$lib/store/team_store';

	export let data: CollectionStore<ComputersResponse>;
	export let filterPhrase: Writable<string>;
	export let checkedList: Writable<string[]> = writable([]);
	export let region: RegionsResponse;

	const filtered = derived([data, filterPhrase], ([$data, $filterPhrase]) => {
		return $data.filter((computer) => {
			return computer.name.toLowerCase().includes($filterPhrase.toLowerCase());
		});
	});

	const toggle = {
		all: () => {
			if ($checkedList.length >= $filtered.length) {
				$checkedList = [];
			} else {
				$checkedList = $filtered.map((computer) => computer.id);
			}
		},
		checked: (computerId: string) => {
			if ($checkedList.includes(computerId)) {
				$checkedList = $checkedList.filter((id) => id !== computerId);
			} else {
				$checkedList = [...$checkedList, computerId];
			}
		}
	};

	const computerDialogOpen = writable(false);
	const computerForm = writable({
		name: ''
	});

	async function createComputer(computer: { name: string }) {
		const result = data.create({
			...computer,
			status: 0,
			region: region.id
		});
		computerDialogOpen.set(false);
		await result;
	}
</script>

<Card.Root class="w-full overflow-hidden p-0">
	<Card.Content class={cn('p-0', $$props.class)}>
		<Table.Root>
			<Table.Header>
				<Table.Row class={$checkedList.length >= $filtered.length ? 'bg-muted/10' : ''}>
					<Table.Head class="h-12">
						{#if $filtered.length > 0}
							<Checkbox
								class="ml-4"
								checked={$checkedList.length >= $filtered.length}
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
					<Table.Row class={$checkedList.includes(computer.id) ? 'bg-muted/20' : ''}>
						<Table.Cell class="h-12 w-[100px]">
							<Checkbox
								class="ml-4"
								checked={$checkedList.includes(computer.id)}
								onclick={(event: any) => {
									event.preventDefault();
									toggle.checked(computer.id);
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
							async () => await createComputer($computerForm),
							`Computer ${$computerForm.name} created.`,
							`Failed to create computer ${$computerForm.name}, my be this computer already exists.`
						)}
					>
						<div class="grid w-full grid-cols-1 gap-2">
							<Input
								id="name"
								placeholder="Computer name"
								bind:value={$computerForm.name}
								required
							/>
						</div>
						<Button type="submit" class="h-full">Create <PlusCircle class={icon.left} /></Button>
					</form>
				</Dialog.Content>
			</Dialog.Root>
		<!-- {/if} -->
	</Card.Content>
</Card.Root>
