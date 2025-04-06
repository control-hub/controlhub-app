<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import Reload from 'svelte-radix/Reload.svelte';

	export let label: string = 'Redirecting';
	export let type: 'inner' | 'outer' = 'outer';
</script>

{#if type === 'outer'}
	<div class="flex h-full w-full">
		<div class="container m-auto w-full max-w-md p-0">
			<Card.Root class="my-6 flex w-full justify-center align-middle">
				<Card.Content class="my-auto flex gap-4 text-xl text-border">
					<Reload class="h-full animate-spin" />
					<span class="font-semibold">{label}</span>
				</Card.Content>
			</Card.Root>
		</div>
	</div>
{:else if type === 'inner'}
	<Card.Content class="my-auto flex max-w-md justify-center gap-4 text-xl text-border">
		<Reload class="h-full animate-spin" />
		<span class="font-semibold">{label}</span>
	</Card.Content>
{/if}
