<script lang="ts">
	import { Input } from '$lib/components/ui/input';
	import { TeamsTable } from '$lib/team/table';
	import { writable } from 'svelte/store';
	import { teamsStore, teamStore } from '$lib/stores';
	import { pb } from '$lib/pocketbase/client';

	import { emptyTeam } from '$lib/config';
	import type { TeamsResponse, UsersResponse } from '$lib/types.js';
	import { onDestroy, onMount, tick } from 'svelte';

	export let data: { teams: TeamsResponse[]; cookie: string; user: UsersResponse };

	// region: PocketBase

	pb.authStore.loadFromCookie(data.cookie);

	onMount(async () => {
		await tick();
		teamStore.set(emptyTeam);
		teamsStore.set(data.teams);
	});

	// endregion
	const filterPhrase = writable('');
</script>

<div class="container flex justify-center">
	<div class="my-6 w-[min(1080px,90%)]">
		<div class="mb-4 flex gap-4">
			<Input class="w-full" placeholder="Search..." bind:value={$filterPhrase} />
		</div>

		<TeamsTable data={teamsStore} user={data.user} {filterPhrase} />
	</div>
</div>
