<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import * as Dialog from '$lib/components/ui/dialog';

	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';
	import { PlusCircle, Ellipsis } from 'lucide-svelte';

	import { writable, derived, type Writable } from 'svelte/store';
	import { toastApi, createTeam as utilsCreateTeam, shrinkString } from '$lib/utils';
	import { icon } from '$lib/config';
	import { teamsStore } from '$lib/stores';
	import { goto } from '$app/navigation';

	export let filterPhrase: Writable<string>;

	const teamDialogOpen = writable(false);
	const teamForm = writable({
		name: ''
	});

	const filtered = derived([teamsStore, filterPhrase], ([$data, $filterPhrase]) => {
		return $data.filter((team) => {
			return team.name.toLowerCase().includes($filterPhrase.toLowerCase());
		});
	});

	async function createTeam() {
		const result = await utilsCreateTeam($teamForm.name);

		teamDialogOpen.set(false);
		teamForm.set({ name: '' });

		goto('/' + result.name + '/');
	}
</script>

<div
	class="grid grid-cols-2 gap-4 pb-6 max-lg:grid-cols-1"
	class:!grid-cols-1={$filtered.length === 0}
>
	<Dialog.Root bind:open={$teamDialogOpen}>
		<Dialog.Trigger>
			{#snippet child({ props })}
				<Button
					{...props}
					class="relative h-[130px] w-full animate-fade-in-up text-center max-lg:h-[80px] sm:col-auto"
					variant="outline"
				>
					Create team
					<PlusCircle class={icon.left} />
				</Button>
			{/snippet}
		</Dialog.Trigger>
		<Dialog.Content class="sm:max-w-[425px]" trapFocus={false}>
			<Dialog.Header>
				<Dialog.Title>Create team</Dialog.Title>
				<Dialog.Description>Enter your new team name.</Dialog.Description>
			</Dialog.Header>
			<form
				class="flex gap-2"
				on:submit|preventDefault={toastApi.execAsync(
					createTeam,
					`Team ${$teamForm.name} created.`,
					`Failed to create team ${$teamForm.name}, my be this team already exists.`
				)}
			>
				<div class="grid w-full grid-cols-1 gap-2">
					<Input id="name" placeholder="Team name" bind:value={$teamForm.name} required />
				</div>
				<Button type="submit" class="h-full">Create <PlusCircle class={icon.left} /></Button>
			</form>
		</Dialog.Content>
	</Dialog.Root>
	<!-- {/if} -->
	{#each $filtered as team (team.id)}
		<Card.Root class="relative col-[1/-1] animate-fade-in-up sm:col-auto">
			<div class="mx-6 my-4 flex max-w-full flex-wrap items-start justify-between align-middle">
				<div class="block max-w-[calc(100%-4rem)]">
					<Card.Header>
						<Card.Title class="mb-3 w-full">{shrinkString(team.name, 20)}</Card.Title>
					</Card.Header>
					<Card.Footer>
						<Card.Description>
							Created: {team.created.slice(0, 10)}
						</Card.Description>
					</Card.Footer>
				</div>
				<Button
					variant="outline"
					class="z-20 my-auto aspect-square flex-shrink-0 hover:bg-background"
					href="/{team.name}/~/settings/"
				>
					<Ellipsis class={icon.default} />
				</Button>
			</div>
			<a href="/{team.name}/" aria-label={team.name}>
				<div class="absolute inset-0 z-10"></div>
			</a>
		</Card.Root>
	{/each}
</div>
