<script lang="ts">
	import { executionsStore, executionsStoreCount, executionsPerPage } from '$lib/stores';
	import TableItem from './table_item.svelte';
	import * as Pagination from '$lib/components/ui/pagination';
	import { pb } from '$lib/pocketbase/client';
	import * as Alert from '$lib/components/ui/alert';

	export let showUser: boolean = true;

	let currentPage = 1;

	const setPage = async (pageNumper: number) => {
		const data = await pb
			.collection('executions')
			.getList(pageNumper, $executionsPerPage, executionsStore.options);
		executionsStoreCount.set(data.totalItems);
		executionsStore.set(data.items);
		window.scrollTo({ top: 0, behavior: 'smooth' });
	};
</script>

{#if $executionsStore.length === 0}
	<Alert.Root>
		<Alert.Description>
			No executions found, execute a script on this computer to create one.
		</Alert.Description>
	</Alert.Root>
{:else}
	<div class="grid grid-cols-1 gap-3">
		{#each $executionsStore as execution (execution.id)}
			<TableItem {execution} {showUser} />
		{/each}
		<Pagination.Root
			perPage={$executionsPerPage}
			count={$executionsStoreCount}
			page={currentPage}
			onPageChange={setPage}
		>
			{#snippet children({ pages, currentPage })}
				<Pagination.Content>
					<Pagination.Item>
						<Pagination.PrevButton />
					</Pagination.Item>
					{#each pages as page (page.key)}
						{#if page.type === 'ellipsis'}
							<Pagination.Item>
								<Pagination.Ellipsis />
							</Pagination.Item>
						{:else}
							<Pagination.Item>
								<Pagination.Link {page} isActive={currentPage === page.value}>
									{page.value}
								</Pagination.Link>
							</Pagination.Item>
						{/if}
					{/each}
					<Pagination.Item>
						<Pagination.NextButton />
					</Pagination.Item>
				</Pagination.Content>
			{/snippet}
		</Pagination.Root>
	</div>
{/if}
