<script lang="ts">
	import { computerStore, teamStore, regionStore, havePermission } from '$lib/stores';
	import { goto } from '$app/navigation';
	import { toastApi } from '$lib/utils';
	import { writable } from 'svelte/store';
	import { pb } from '$lib/pocketbase/client';

	import { Snippet } from '$lib/components/ui/snippet';
	import { Input } from '$lib/components/ui/input';
	import { BasicElement } from '$lib/settings';

	const computerNameChangeValue = writable<string>($computerStore?.name);

	const computerNameChangeSubmit = toastApi.execAsync(
		async () => {
			const result = await pb.collection('computers').update($computerStore?.id as string, {
				...$computerStore,
				name: $computerNameChangeValue
			});

			computerStore.set(result);
			goto('/' + $teamStore?.name + '/' + $regionStore?.name + '/' + $computerNameChangeValue + '/~/settings');
		},
		'Computer name changed successfully.',
		'Failed to change computer name.'
	);

	const computerDeleteSubmit = toastApi.execAsync(
		async () => {
			await pb.collection('computers').delete($computerStore?.id as string);
			computerStore.set(undefined);
			goto('/' + $teamStore?.name + '/' + $regionStore?.name);
		},
		'Computer deleted successfully.',
		'Failed to delete computer.'
	);
</script>

<div class="grid w-full grid-cols-1 justify-items-center gap-6">
	<!-- Edit Name -->
	{#if $havePermission('edit_computer')}
		<BasicElement
			title="Computer Name"
			description="This is your computer's name and url in {$teamStore?.name} team. For example name of your class or cabinet number."
			execute={computerNameChangeSubmit}
			footer="Use 32 characters at maximum."
		>
			<Input
				bind:value={$computerNameChangeValue}
				class="w-[min(20rem,100%)]"
				oninput={() => computerNameChangeValue.set($computerNameChangeValue.slice(0, 32))}
				required
			/>
		</BasicElement>
	{/if}
	<BasicElement
	title="Computer Token"
	description="This is your computer token within ControlHub. Used in client app to connect to this computer."
	footer="Use this token to access this computer in our client app, or in our API."
	act={false}
>
	<Snippet text={$computerStore?.token as string} class="w-[min(16rem,100%)]" />
</BasicElement>
	<BasicElement
		title="Computer ID"
		description="This is your computer ID within ControlHub."
		footer="Use this ID to access this computer in our API."
		act={false}
	>
		<Snippet text={$computerStore?.id as string} class="w-[min(16rem,100%)]" />
	</BasicElement>
	{#if $havePermission('delete_computer')}
		<BasicElement
			title="Delete Computer"
			description="Delete computer from {$regionStore?.name} region."
			useAlert={true}
			alertMessage="Are you sure you want to delete your computer? This action cannot be undone, you will delete all executions inside this computer."
			execute={computerDeleteSubmit}
			saveButtonText="Delete"
			destructive={true}
		/>
	{/if}
</div>
