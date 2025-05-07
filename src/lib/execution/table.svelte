<script lang="ts">
	import { executionsStore } from '$lib/stores';
	import TableItem from './table_item.svelte';

	export let showUser: boolean = true
</script>

<div class="grid grid-cols-1 gap-3">
	{#each $executionsStore as execution (execution.id)}
		<TableItem {execution} {showUser}/>
	{/each}
</div>
