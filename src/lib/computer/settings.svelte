<script lang="ts">
	import { computerStore, teamStore, regionStore, havePermission } from '$lib/stores';
	import { goto } from '$app/navigation';
	import { generateToken, toastApi } from '$lib/utils';
	import { writable } from 'svelte/store';
	import { pb } from '$lib/pocketbase/client';

	import * as Select from '$lib/components/ui/select';
	import { Snippet } from '$lib/components/ui/snippet';
	import { Input } from '$lib/components/ui/input';
	import { BasicElement } from '$lib/settings';
	import { Code } from '$lib/components/ui/code';

	const computerNameChangeValue = writable<string>($computerStore?.name);
	const selectedStatus = writable<string>($computerStore?.status);

	const statusMap = {
		'0': 'Offline',
		'1': 'Busy',
		'2': 'Online'
	};

	const statusClassMap = {
		'0': 'bg-red-500',
		'1': 'bg-yellow-500',
		'2': 'bg-green-500'
	};

	const computerNameChangeSubmit = toastApi.execAsync(
		async () => {
			const result = await pb.collection('computers').update($computerStore?.id as string, {
				...$computerStore,
				name: $computerNameChangeValue
			});

			computerStore.set(result);
			goto(
				'/' +
					$teamStore?.name +
					'/' +
					$regionStore?.name +
					'/' +
					$computerNameChangeValue +
					'/~/settings'
			);
		},
		'Computer name changed successfully.',
		'Failed to change computer name.'
	);

	const computerRegenerateTokenSubmit = toastApi.execAsync(
		async () => {
			const result = await pb.collection('computers').update($computerStore?.id as string, {
				...$computerStore,
				status: '0',
				ip: '',
				mac: '',
				token: generateToken(12)
			});

			computerStore.set(result);
		},
		'Computer token regenerated successfully.',
		'Failed to regenerate computer token.'
	);

	const changeComputerStatusSubmit = toastApi.execAsync(
		async () => {
			const result = await pb.collection('computers').update($computerStore?.id as string, {
				...$computerStore,
				status: $selectedStatus
			});

			computerStore.set(result);
		},
		'Computer status changed successfully.',
		'Failed to change computer status.'
	)

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
	{#if $havePermission('edit_computer')}
		<BasicElement
			title="Computer Token"
			description="This is your computer token within ControlHub. Used in client app to connect to this computer."
			footer="Use this token to access this computer in our client app, or in our API."
			execute={computerRegenerateTokenSubmit}
			saveButtonText="Regenerate"
			useAlert={true}
			alertMessage="Are you sure you want to refresh token of your computer? This action cannot be undone, if computer is connected it will lose connection."
		>
			<Snippet text={$computerStore?.token as string} class="w-[min(16rem,100%)]" />
		</BasicElement>
	{:else}
		<BasicElement
			title="Computer Token"
			description="This is your computer token within ControlHub. Used in client app to connect to this computer."
			footer="Use this token to access this computer in our client app, or in our API."
			act={false}
		>
			<Snippet text={$computerStore?.token as string} class="w-[min(16rem,100%)]" />
		</BasicElement>
	{/if}
	{#if $havePermission('edit_computer')}
		<BasicElement
			title="Computer Status"
			description="This is your computer status. Online | Busy | Offline."
			footer="Use when system won't change computer status on connect or disconnect."
			execute={changeComputerStatusSubmit}
			saveButtonText="Change"
		>
			<Select.Root type="single">
				<Select.Trigger class="w-[min(16rem,100%)]">
					<div class="flex items-center">
						{@render computerStatus($selectedStatus as '0' | '1' | '2')}
					</div>
				</Select.Trigger>
				<Select.Content>
					{#each ['0', '1', '2'] as status}
						<Select.Item value={status} onclick={() => selectedStatus.set(status)}>
							{@render computerStatus(status as '0' | '1' | '2')}
						</Select.Item>
					{/each}
				</Select.Content>
			</Select.Root>
		</BasicElement>
	{/if}
	<BasicElement
		title="Computer IP"
		description="This is your computer IP."
		footer="Used for nothing."
		act={false}
	>
		<Snippet text={$computerStore?.ip as string} class="w-[min(16rem,100%)]" />
	</BasicElement>
	<BasicElement
		title="Computer MAC"
		description="This is your computer MAC."
		footer="Used for `Awake` script via WOL."
		act={false}
	>
		<Snippet text={$computerStore?.mac as string} class="w-[min(16rem,100%)]" />
	</BasicElement>
	<BasicElement
		title="Computer Data"
		description="This is your computer data. Used for very advanced purposes."
		footer="Can be changed in controlhub library function or in our API."
		act={false}
	>
		<Code lang="json" code={JSON.stringify($computerStore?.data, null, 2)} class="w-min-[100%]" />
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

{#snippet computerStatus(status: '0' | '1' | '2')}
	<div class="aspect-square h-2 rounded-full mr-2 {statusClassMap[status]}"></div>
	{statusMap[status]}
{/snippet}
