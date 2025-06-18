<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import { Ellipsis } from 'lucide-svelte';

	import { derived, type Writable } from 'svelte/store';
	import { shrinkString } from '$lib/utils';
	import { icon } from '$lib/config';
	import { regionsStore, teamStore } from '$lib/stores';
	import CreateRegion from './create.svelte';

	export let filterPhrase: Writable<string>;

	const filteredRegionsStore = derived(
		[regionsStore, filterPhrase],
		([$regionsStore, $filterPhrase]) => {
			return $regionsStore.filter((region) => {
				return region.name.toLowerCase().includes($filterPhrase.toLowerCase());
			});
		}
	);
</script>

<div
	class="grid grid-cols-2 gap-4 pb-6 max-lg:grid-cols-1"
	class:!grid-cols-1={$filteredRegionsStore.length === 0}
>
	<CreateRegion />
	<!-- {/if} -->
	{#each $filteredRegionsStore as region (region.id)}
		<Card.Root class="relative col-[1/-1] animate-fade-in-up sm:col-auto">
			<div class="mx-6 my-4 flex max-w-full flex-wrap items-start justify-between align-middle">
				<div class="block max-w-[calc(100%-4rem)]">
					<Card.Header>
						<Card.Title class="notranslate mb-3 w-full">{shrinkString(region.name, 20)}</Card.Title>
					</Card.Header>
					<Card.Footer>
						<Card.Description>
							Created: {region.created.slice(0, 10)}
						</Card.Description>
					</Card.Footer>
				</div>
				<Button
					variant="outline"
					class="z-20 my-auto aspect-square flex-shrink-0 hover:bg-background"
					href="/{$teamStore?.name as string}/{region.name}/~/settings/"
				>
					<Ellipsis class={icon.default} />
				</Button>
			</div>
			<a href="/{$teamStore?.name as string}/{region.name}/" aria-label={region.name}>
				<div class="absolute inset-0 z-10"></div>
			</a>
		</Card.Root>
	{/each}
</div>
