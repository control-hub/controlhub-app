<script lang="ts">
	import { Input } from '$lib/components/ui/input';
	import { writable, derived, readable } from 'svelte/store';
	import { pb } from '$lib/pocketbase/client';
	import { teamStore } from '$lib/stores.js';
	// import { isOwner } from '$lib/store/team_store';

	import { BasicElement } from '../basic-element';
	import { goto } from '$app/navigation';
	import type { TeamsResponse } from '$lib/types';

	const teamNameChangeValue = writable<string>($teamStore?.name);

	// const canEditTeam = derived([isOwner, teamStore.accessStore], () => hasAccess('edit_team'));

	const teamNameChangeSubmit = async () => {
		const result = await pb.collection('teams').update<TeamsResponse>($teamStore?.id as string, {
			...$teamStore,
			name: $teamNameChangeValue
		});

		teamStore.set(result);
		goto('/' + $teamNameChangeValue + '/~/settings');
	};

	// const accessStore = teamStore.accessStore;
</script>

<!-- {(JSON.stringify($accessStore), hasAccess('edit_team'))} -->

<BasicElement
	title="Team name"
	description="This is your team name within ControlHub. For example, the name of your school, or company. Also name of your team is URL link."
	success="Updated your team name successfully"
	error="Failed to update team name, try other name"
	executeFunction={teamNameChangeSubmit}
	unAvailableMessage={"Only team owner or users with edit permissions can change team's name"}
	accessNeeded="edit_team"
>
	<!-- available={!$canEditTeam} -->

	<Input
		class="mt-2 w-[min(300px,80%)]"
		placeholder="Team name"
		bind:value={$teamNameChangeValue}
	/>
	<!-- disabled={!$canEditTeam} -->
</BasicElement>
