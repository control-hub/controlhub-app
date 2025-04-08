<script lang="ts">
	import { teamStore, havePermission } from '$lib/stores.js';
	import { goto } from '$app/navigation';
	import type { TeamsResponse } from '$lib/types';
	import { writable } from 'svelte/store';
	import { pb } from '$lib/pocketbase/client';

	import * as Card from '$lib/components/ui/card';
	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button/index.js';

	const teamNameChangeValue = writable<string>($teamStore?.name);

	const teamNameChangeSubmit = async () => {
		const result = await pb.collection('teams').update<TeamsResponse>($teamStore?.id as string, {
			...$teamStore,
			name: $teamNameChangeValue
		});

		teamStore.set(result);
		goto('/' + $teamNameChangeValue + '/~/settings');
	};
</script>

<div class="mb-6 w-[100%] border-b border-input py-10 text-3xl font-medium">
	<span class="ml-[calc(min(10%,100px))]"> Settings </span>
</div>

<div class="mx-auto grid w-[min(748px,100%)] grid-cols-1 gap-6 px-6">
	<!-- Edit Name -->
	<Card.Root class="w-[min(max(240px,80%),600px)]">
		<Card.Header>
			<Card.Title>Team Name</Card.Title>
			<Card.Description>
				This is your team's name and url in ControlHub. For example name of your school or
				university.
			</Card.Description>
		</Card.Header>

		<form on:submit|preventDefault={teamNameChangeSubmit}>
			<Card.Content>
				<Input
					bind:value={$teamNameChangeValue}
					oninput={() => teamNameChangeValue.set($teamNameChangeValue.slice(0, 32))}
				/>
			</Card.Content>

			<Card.Footer class="flex items-center justify-between border-t px-6 py-4">
				<p class="text-sm text-muted-foreground">Please use 32 characters at maximum.</p>
				<Button type="submit">Save</Button>
			</Card.Footer>
		</form>
	</Card.Root>
</div>
