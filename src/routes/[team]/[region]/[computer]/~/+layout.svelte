<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
	import { tabsStore } from '$lib/stores';
	import { tabsConfig } from '$lib/config';

	onMount(async () => {
		tabsStore.set(tabsConfig.computer)
	});

	onDestroy(async () => {
		tabsStore.update((tabs) => (tabs === tabsConfig.computer) ? [] : tabs)
	});
</script>

<slot />