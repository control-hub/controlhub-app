<script lang="ts">
	import ScriptCard from './element.svelte';

	import { derived, type Writable } from 'svelte/store';
	import { scriptsStore } from '$lib/stores';

	export let filterPhrase: Writable<string>;

	const filteredScripts = derived(
		[scriptsStore, filterPhrase],
		([$scriptsStore, $filterPhrase]) => {
			return $scriptsStore.filter((script) =>
				script.name.toLowerCase().includes($filterPhrase.toLowerCase())
			);
		}
	);
</script>

<div
	class="grid gap-4 pb-6 grid-cols-1"
	class:!grid-cols-1={$scriptsStore.length === 0}
>
	{#each $filteredScripts as script (script.id)}
		<ScriptCard {script} />
	{/each}
</div>