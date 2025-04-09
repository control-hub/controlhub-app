<script lang="ts">
	import { Input } from '$lib/components/ui/input';
	import { TeamsTable } from '$lib/team/table';
	import { writable } from 'svelte/store';
	import { tabsStore, teamsStore, teamStore } from '$lib/stores';

	import { beforeNavigate } from '$app/navigation';
	import { tabsConfig } from '$lib/config';

	beforeNavigate(({ from, to }) => {
		if (from?.url.pathname !== to?.url.pathname) {
			teamStore.set(undefined);
			teamsStore.set([]);
		}
	});

	const filterPhrase = writable('');
</script>

<div class="mb-4 flex gap-4">
	<Input class="w-full" placeholder="Search..." bind:value={$filterPhrase} />
</div>

<TeamsTable {filterPhrase} />
