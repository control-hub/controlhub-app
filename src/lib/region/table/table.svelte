<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import * as Dialog from '$lib/components/ui/dialog';

	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';
	import { PlusCircle } from 'lucide-svelte';
	import { DotsHorizontal } from 'svelte-radix';

	import { CollectionStore } from 'pocketbase-store';
	import { writable, derived, type Writable } from 'svelte/store';
	import { toastApi, shield, shrinkString } from '$lib/utils';
	import { icon } from '$lib/config';
	import type { RegionsResponse, TeamsResponse } from '$lib/types';
	// import { isOwner } from '$lib/store/team_store';

	export let data: CollectionStore<RegionsResponse>;
	export let filterPhrase: Writable<string>;
	export let team: TeamsResponse;

	const filtered = derived([data, filterPhrase], ([$data, $filterPhrase]) => {
		return $data.filter((region) => {
			return region.name.toLowerCase().includes($filterPhrase.toLowerCase());
		});
	});

	const regionDialogOpen = writable(false);
	const regionForm = writable({
		name: ''
	});

	async function createRegion(region: { name: string }) {
		const result = data.create({
			...region,
			team: team.id
		});
		regionDialogOpen.set(false);
		await result;
	}
</script>

<div
	class="grid grid-cols-2 gap-4 pb-6 max-sm:grid-cols-1"
	class:!grid-cols-1={$filtered.length === 0}
>
	<!-- {#if $isOwner} -->
		<Dialog.Root bind:open={$regionDialogOpen}>
			<Dialog.Trigger>
				{#snippet child({ props })}
					<Button
						{...props}
						class="relative h-[130px] w-full text-center max-sm:h-[80px] sm:col-auto"
						variant="outline"
					>
						Create region
						<PlusCircle class={icon.left} />
					</Button>
				{/snippet}
			</Dialog.Trigger>
			<Dialog.Content class="sm:max-w-[425px]" trapFocus={false}>
				<Dialog.Header>
					<Dialog.Title>Create region</Dialog.Title>
					<Dialog.Description>Enter your new region name.</Dialog.Description>
				</Dialog.Header>
				<form
					class="flex gap-2"
					on:submit|preventDefault={toastApi.execAsync(
						async () => await createRegion($regionForm),
						`Region ${$regionForm.name} created.`,
						`Failed to create region ${$regionForm.name}, my be this region already exists.`
					)}
				>
					<div class="grid w-full grid-cols-1 gap-2">
						<Input id="name" placeholder="Region name" bind:value={$regionForm.name} required />
					</div>
					<Button type="submit" class="h-full">Create <PlusCircle class={icon.left} /></Button>
				</form>
			</Dialog.Content>
		</Dialog.Root>
	<!-- {/if} -->
	{#each $filtered as region (region.id)}
		<Card.Root class="relative col-[1/-1] h-[130px] sm:col-auto">
			<div class="mx-6 my-4 flex max-w-full flex-wrap items-start justify-between align-middle">
				<div class="block max-w-[calc(100%-4rem)]">
					<Card.Header>
						<Card.Title class="mb-3 w-full">{shrinkString(region.name, 20)}</Card.Title>
					</Card.Header>
					<Card.Footer>
						<Card.Description>
							Created: {region.created.slice(0, 10)}
						</Card.Description>
					</Card.Footer>
				</div>
				<Button
					variant="outline"
					class="z-20 my-auto aspect-square flex-shrink-0 hover:bg-background"
					href="/{team.name}/{region.name}/~/settings"
				>
					<DotsHorizontal class={icon.default} />
				</Button>
			</div>
			<a href="/{team.name}/{region.name}" aria-label={region.name}>
				<div class="absolute inset-0 z-10"></div>
			</a>
		</Card.Root>
	{/each}
</div>
