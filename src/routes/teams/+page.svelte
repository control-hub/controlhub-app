<script lang="ts">
	import { Input } from '$lib/components/ui/input';
	import { TeamsTable } from '$lib/team/table';
	import { writable } from 'svelte/store';
	import { teamsStore, teamStore } from '$lib/stores';
	import { pb } from '$lib/pocketbase/client';

	import { emptyTeam } from '$lib/config';
	import type { TeamsResponse, UsersResponse } from '$lib/types.js';
	import { onMount, tick } from 'svelte';
	import { beforeNavigate } from '$app/navigation';

	export let data: { teams: TeamsResponse[]; cookie: string; user: UsersResponse };

	// region: PocketBase
	teamStore.set(emptyTeam);
	teamsStore.set(data.teams);

	beforeNavigate(({ from, to }) => {
		if (from?.url.pathname !== to?.url.pathname) {
			teamStore.set(undefined);
			teamsStore.set([]);
		}
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
