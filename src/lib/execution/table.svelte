<script lang="ts">
	import { executionsStore } from '$lib/stores';
	import ListCard from './list_card.svelte';
</script>

<div class="grid grid-cols-1 gap-3">
	{#each $executionsStore as execution (execution.id)}
		<ListCard {execution} />
	{/each}
</div>
