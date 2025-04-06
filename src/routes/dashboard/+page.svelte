<script lang="ts">
	import { Input } from '$lib/components/ui/input';
	import { TeamsTable } from '$lib/team/table';
	import { writable } from 'svelte/store';
	import { createCollectionStore } from 'pocketbase-store';
	import { pb } from '$lib/pocketbase/client';

	import type { TeamsResponse, UsersResponse } from '$lib/types.js';

	export let data: { teams: TeamsResponse[]; cookie: string; user: UsersResponse };

	// region: PocketBase

	pb.authStore.loadFromCookie(data.cookie);

	const teamsStore = createCollectionStore<TeamsResponse>(
		pb,
		'teams',
		{
			sort: '-created',
			autoSubGetData: false
		},
		data.teams
	);

	// endregion
	const filterPhrase = writable('');
</script>

<div class="container flex justify-center">
	<div class="my-6 w-[min(1080px,90vw)]">
		<div class="mb-4 flex gap-4">
			<Input class="w-full" placeholder="Search..." bind:value={$filterPhrase} />
		</div>

		<TeamsTable data={teamsStore} user={data.user} {filterPhrase} />
	</div>
</div>
