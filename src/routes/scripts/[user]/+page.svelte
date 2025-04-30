<script lang="ts">
	import { Input } from '$lib/components/ui/input';
	import { ScriptsTable, ScriptsCreateDialog } from '$lib/script/table';
	import { writable } from 'svelte/store';

    export let data: {username: string};
	const filterPhrase = writable('');
</script>

<div class="mb-4 flex gap-4">
	<Input class="w-full" placeholder="Search..." bind:value={$filterPhrase} />
	<ScriptsCreateDialog username={data.username}/>
</div>

<ScriptsTable {filterPhrase}/>
