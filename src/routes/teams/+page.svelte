<script lang="ts">
	import { Input } from '$lib/components/ui/input';
	import { TeamsTable } from '$lib/team';
	import { writable } from 'svelte/store';
	import { teamsStore, teamStore } from '$lib/stores';

	import { beforeNavigate } from '$app/navigation';

	beforeNavigate(({ from, to }) => {
		if (from?.url.pathname !== to?.url.pathname) {
			teamStore.set(undefined);
		}
	});

	const filterPhrase = writable('');
</script>

<div class="mb-4 flex gap-4">
	<Input class="w-full" placeholder="Search..." bind:value={$filterPhrase} />
</div>

<TeamsTable {filterPhrase} />
