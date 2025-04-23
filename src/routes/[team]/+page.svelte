<script lang="ts">
	import { Input } from '$lib/components/ui/input';
	import { RegionsTable } from '$lib/region/table';

	import { writable } from 'svelte/store';

	import { teamStore, teamAccessStore, tabsStore } from '$lib/stores.js';
	import { beforeNavigateOut } from '$lib/utils';

	beforeNavigateOut(() => {
		teamAccessStore.set(undefined);
		teamStore.set(undefined);
		tabsStore.set([]);
	});

	const filterPhrase = writable('');
</script>

<div class="mb-4 flex gap-4">
	<Input class="w-full" placeholder="Search..." bind:value={$filterPhrase} />
</div>

<RegionsTable {filterPhrase} />
