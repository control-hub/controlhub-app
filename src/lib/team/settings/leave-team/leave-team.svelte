<script lang="ts">
	import { Input } from '$lib/components/ui/input';
	import { teamStore } from '$lib/stores.js';
	import { writable } from 'svelte/store';
	import { pb } from '$lib/pocketbase/client';

	import { BasicElement } from '../basic-element';

	// TODO

	const teamNameChangeValue = writable<string>($teamStore?.name);
	const teamNameChangeSubmit = async () => {
		await pb.collection('teams').update($teamStore?.id as string, {
			...$teamStore,
			name: $teamNameChangeValue
		});
	};
</script>

<BasicElement
	title="Leave team"
	description="Revoke your access to this Team. Any resources you have access to will remain."
	success="Leaved team successfully"
	error="Failed to leave team name :(, contact support"
	loading="Processing..."
	executeFunction={teamNameChangeSubmit}
>
	<Input
		class="mt-2 w-[min(300px,80%)]"
		placeholder="Team name"
		bind:value={$teamNameChangeValue}
	/>
</BasicElement>
