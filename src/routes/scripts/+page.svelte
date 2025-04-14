<script lang="ts">
	import { Input } from '$lib/components/ui/input';
	import { ScriptsTable } from '$lib/script/table';
	import { Switch } from '$lib/components/ui/switch';
	import { writable } from 'svelte/store';
	import Button from '$lib/components/ui/button/button.svelte';

	const filterPhrase = writable('');
	const showPublic = writable(true);
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
