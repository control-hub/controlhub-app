<script lang="ts">
	import { Input } from '$lib/components/ui/input';
	import { ScriptsTable } from '$lib/script/table';
	import { writable } from 'svelte/store';
	import Button from '$lib/components/ui/button/button.svelte';
	import { scriptsStore } from '$lib/stores';
	import { get } from 'svelte/store';

	const filterPhrase = writable('');
	const showPublic = writable(false);
</script>

<div class="mb-4 flex gap-4">
	<Input class="w-full" placeholder="Search..." bind:value={$filterPhrase} />
	<Button
		onclick={() => {
			showPublic.update((showPublic) => !showPublic);
		}}
		variant={$showPublic ? 'default' : 'outline'}>Show public</Button
	>
</div>

<ScriptsTable {filterPhrase} {showPublic} />
