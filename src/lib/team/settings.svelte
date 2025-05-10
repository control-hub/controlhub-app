<script lang="ts">
	import { teamStore, havePermission, teamsAccessStore } from '$lib/stores.js';
	import { goto } from '$app/navigation';
	import type { TeamsResponse, UsersResponse } from '$lib/types';
	import { writable } from 'svelte/store';
	import { pb } from '$lib/pocketbase/client';

	import * as Select from '$lib/components/ui/select';
	import { Input } from '$lib/components/ui/input';
	import { BasicElement } from '$lib/settings';

	const teamNameChangeValue = writable<string>($teamStore?.name);
	const teamOwnerChangeValue = writable<string | undefined>(undefined);

	const teamNameChangeSubmit = async () => {
		const result = await pb.collection('teams').update<TeamsResponse>($teamStore?.id as string, {
			...$teamStore,
			name: $teamNameChangeValue
		});

		teamStore.set(result);
		goto('/' + $teamNameChangeValue + '/~/settings');
	};

	const teamOwnerChangeSubmit = async () => {
		await pb.collection('teams').update<TeamsResponse>($teamStore?.id as string, {
			owner: $teamOwnerChangeValue
		});

		teamStore.set(await pb.collection('teams').getOne<TeamsResponse>($teamStore?.id as string));
	};

	const teamDeleteSubmit = async () => {
		await pb.collection('teams').delete($teamStore?.id as string);
		goto('/');
	}
</script>

<div class="grid w-full grid-cols-1 justify-items-center gap-6">
	<!-- Edit Name -->
	<BasicElement
		title="Team Name"
		description="This is your team's name and url in ControlHub. For example name of your school or university."
		execute={teamNameChangeSubmit}
		footer="Use 32 characters at maximum."
	>
		<Input
			bind:value={$teamNameChangeValue}
			class="w-[20rem]"
			oninput={() => teamNameChangeValue.set($teamNameChangeValue.slice(0, 32))}
			required
		/>
	</BasicElement>
	{#if $havePermission('transfer')}
		<BasicElement
			title="Transfer Ownership"
			description="Transfer ownership of your team to another user."
			useAlert={true}
			execute={teamOwnerChangeSubmit}
			saveButtonText="Transfer"
		>
			<Select.Root type="single" bind:value={$teamOwnerChangeValue}>
				<Select.Trigger class="w-[180px]"
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
	{#if $havePermission('delete_team')}
		<BasicElement
			title="Delete Team"
			description="Delete your team totally from ControlHub."
			useAlert={true}
			execute={teamDeleteSubmit}
			saveButtonText="Delete"
			destructive={true}
		/>
	{/if}
</div>
