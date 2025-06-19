<script lang="ts">
	import { teamStore, havePermission, teamsAccessStore } from '$lib/stores';
	import { goto } from '$app/navigation';
	import { customEncode, toastApi } from '$lib/utils';
	import type { TeamsResponse, UsersResponse } from '$lib/types';
	import { writable } from 'svelte/store';
	import { pb } from '$lib/pocketbase/client';

	import { Snippet } from '$lib/components/ui/snippet';
	import * as Select from '$lib/components/ui/select';
	import { Input } from '$lib/components/ui/input';
	import { BasicElement } from '$lib/settings';

	const teamNameChangeValue = writable<string>($teamStore?.name);
	const teamOwnerChangeValue = writable<string | undefined>(undefined);

	const teamNameChangeSubmit = toastApi.execAsync(
		async () => {
			const result = await pb.collection('teams').update<TeamsResponse>($teamStore?.id as string, {
				...$teamStore,
				name: $teamNameChangeValue
			});

			teamStore.set(result);
			goto('/' + customEncode($teamNameChangeValue) + '/~/settings/');
		},
		'Team name changed successfully.',
		'Failed to change team name.'
	);

	const teamOwnerChangeSubmit = toastApi.execAsync(
		async () => {
			await pb.collection('teams').update<TeamsResponse>($teamStore?.id as string, {
				owner: $teamOwnerChangeValue
			});

			teamStore.set(await pb.collection('teams').getOne<TeamsResponse>($teamStore?.id as string));
		},
		'Team ownership transferred successfully.',
		'Failed to transfer team ownership.'
	);

	const teamDeleteSubmit = toastApi.execAsync(
		async () => {
			await pb.collection('teams').delete($teamStore?.id as string);
			teamStore.set(undefined);
			goto('/');
		},
		'Team deleted successfully.',
		'Failed to delete team.'
	);
</script>

<div class="grid w-full grid-cols-1 justify-items-center gap-6">
	<!-- Edit Name -->
	{#if $havePermission('edit_team')}
		<BasicElement
			title="Team Name"
			description="This is your team's name and url in ControlHub. For example name of your school or university."
			execute={teamNameChangeSubmit}
			footer="Use 32 characters at maximum."
		>
			<Input
				bind:value={$teamNameChangeValue}
				class="w-[min(20rem,100%)]"
				oninput={() => teamNameChangeValue.set($teamNameChangeValue.slice(0, 32))}
				required
			/>
		</BasicElement>
	{/if}
	{#if $havePermission('transfer')}
		<BasicElement
			title="Transfer Ownership"
			description="Transfer ownership of your team to another user."
			useAlert={true}
			alertMessage="Are you sure you want to transfer ownership of your team to another user? This action cannot be undone, you will lose owner privileges in your team."
			execute={teamOwnerChangeSubmit}
			saveButtonText="Transfer"
		>
			<Select.Root type="single" bind:value={$teamOwnerChangeValue}>
				<Select.Trigger class="w-[min(16rem,100%)]"
					>{(
						$teamsAccessStore.find(
							(access) =>
								(access.expand as { user: UsersResponse }).user.id == $teamOwnerChangeValue
						)?.expand as { user: UsersResponse }
					)?.user?.username || 'Not selected'}</Select.Trigger
				>
				<Select.Content>
					{#each $teamsAccessStore.filter((access) => access.user != $teamStore?.owner) as access (access.id)}
						{@const user = (access.expand as { user: UsersResponse }).user}
						<Select.Item value={user.id} label={user.username} />
					{/each}
				</Select.Content>
			</Select.Root>
		</BasicElement>
	{/if}
	<BasicElement
		title="Team ID"
		description="This is your team ID within ControlHub."
		footer="Use this ID to access this team in our API."
		act={false}
	>
		<Snippet text={$teamStore?.id as string} class="w-[min(16rem,100%)]" />
	</BasicElement>
	{#if $havePermission('delete_team')}
		<BasicElement
			title="Delete Team"
			description="Delete your team totally from ControlHub."
			useAlert={true}
			alertMessage="Are you sure you want to delete your team? This action cannot be undone, you will lose all your data in your team, all regions, all computers, all users, all links and all other related data."
			execute={teamDeleteSubmit}
			saveButtonText="Delete"
			destructive={true}
		/>
	{/if}
</div>
