<script lang="ts">
	import { regionStore, teamStore, havePermission } from '$lib/stores';
	import { goto } from '$app/navigation';
	import { customEncode, toastApi } from '$lib/utils';
	import { writable } from 'svelte/store';
	import { pb } from '$lib/pocketbase/client';

	import { Snippet } from '$lib/components/ui/snippet';
	import { Input } from '$lib/components/ui/input';
	import { BasicElement } from '$lib/settings';

	const regionNameChangeValue = writable<string>($regionStore?.name);

	const regionNameChangeSubmit = toastApi.execAsync(
		async () => {
			const result = await pb.collection('regions').update($regionStore?.id as string, {
				...$regionStore,
				name: $regionNameChangeValue
			});

			regionStore.set(result);
			goto(
				'/' +
					customEncode($teamStore?.name as string) +
					'/' +
					customEncode($regionNameChangeValue) +
					'/~/settings/'
			);
		},
		'Region name changed successfully.',
		'Failed to change region name.'
	);

	const regionDeleteSubmit = toastApi.execAsync(
		async () => {
			await pb.collection('regions').delete($regionStore?.id as string);
			regionStore.set(undefined);
			goto('/' + customEncode($teamStore?.name as string) + '/');
		},
		'Region deleted successfully.',
		'Failed to delete region.'
	);
</script>

<div class="grid w-full grid-cols-1 justify-items-center gap-6">
	<!-- Edit Name -->
	{#if $havePermission('edit_region')}
		<BasicElement
			title="Region Name"
			description="This is your region's name and url in {$teamStore?.name} team. For example name of your class or cabinet number."
			execute={regionNameChangeSubmit}
			footer="Use 32 characters at maximum."
		>
			<Input
				bind:value={$regionNameChangeValue}
				class="w-[min(20rem,100%)]"
				oninput={() => regionNameChangeValue.set($regionNameChangeValue.slice(0, 32))}
				required
			/>
		</BasicElement>
	{/if}
	<BasicElement
		title="Region ID"
		description="This is your region ID within ControlHub."
		footer="Use this ID to access this region in our API."
		act={false}
	>
		<Snippet text={$regionStore?.id as string} class="w-[min(16rem,100%)]" />
	</BasicElement>
	{#if $havePermission('delete_region')}
		<BasicElement
			title="Delete Region"
			description="Delete region from {$teamStore?.name} team"
			useAlert={true}
			alertMessage="Are you sure you want to delete your region? This action cannot be undone, you will delete all computers and all executions inside this region."
			execute={regionDeleteSubmit}
			saveButtonText="Delete"
			destructive={true}
		/>
	{/if}
</div>
