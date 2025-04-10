<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import * as Dialog from '$lib/components/ui/dialog';

	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';
	import { PlusCircle } from 'lucide-svelte';
	import { DotsHorizontal } from 'svelte-radix';

	import { writable, derived, type Writable } from 'svelte/store';
	import { toastApi, createTeam as utilsCreateTeam, shrinkString } from '$lib/utils';
	import { icon } from '$lib/config';
	import { userStore, teamsStore } from '$lib/stores';
	// import { isOwner } from '$lib/store/team_store';
	import { fly } from 'svelte/transition';

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

	async function createTeam(team: { name: string }) {
		await utilsCreateTeam(teamsStore, {
			name: team.name,
			owner: $userStore?.id as string
		});

		teamDialogOpen.set(false);
		teamForm.set({ name: '' });
	}
</script>

<div
	class="grid grid-cols-2 gap-4 pb-6 max-lg:grid-cols-1"
	class:!grid-cols-1={$filtered.length === 0}
>
	<!-- {#if $isOwner} -->
	<Dialog.Root bind:open={$teamDialogOpen}>
		<Dialog.Trigger>
			{#snippet child({ props })}
				<Button
					{...props}
					class="animate-fade-in-up relative h-[130px] w-full text-center max-lg:h-[80px] sm:col-auto"
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
					async () => await createTeam($teamForm),
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
		<Card.Root class="animate-fade-in-up relative col-[1/-1]  h-[130px] sm:col-auto">
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
					href="/{team.name}/~/settings"
				>
					<DotsHorizontal class={icon.default} />
				</Button>
			</div>
			<a href="/{team.name}" aria-label={team.name}>
				<div class="absolute inset-0 z-10"></div>
			</a>
		</Card.Root>
	{/each}
</div>
