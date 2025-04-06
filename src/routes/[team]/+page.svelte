<script lang="ts">
	import { Input } from '$lib/components/ui/input';
	import { RegionsTable } from '$lib/region/table';

	import type { RegionsResponse, TeamsResponse } from '$lib/types';
	import { tabsConfig } from '$lib/config.js';
	import { teamStore } from '$lib/stores.js';
	import { createCollectionStore } from 'pocketbase-store';
	import { pb } from '$lib/pocketbase/client';
	import { shield } from '$lib/utils';
	import { writable } from 'svelte/store';
	import { tabsStore } from '$lib/stores.js';

	export let data: { regions: RegionsResponse[]; cookie: string };
	tabsStore.set(tabsConfig.team as any);

	// region: PocketBase
	pb.authStore.loadFromCookie(data.cookie);

	const regionsStore = createCollectionStore<RegionsResponse>(
		pb,
		'regions',
		{
			sort: '-created',
			filter: `team.id = "${shield($teamStore?.id as string)}"`,
			autoSubGetData: false
		},
		data.regions
	);

	// endregion
	const filterPhrase = writable('');
</script>

<div class="my-6 w-[min(1080px,90vw)]">
	<div class="mb-4 flex gap-4">
		<Input class="w-full" placeholder="Search..." bind:value={$filterPhrase} />
	</div>

	<RegionsTable data={regionsStore} {filterPhrase} team={$teamStore as TeamsResponse} />
</div>
