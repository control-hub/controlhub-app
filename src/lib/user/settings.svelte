<script lang="ts">
	import { userStore } from '$lib/stores';
	import * as ImageCropper from '$lib/components/ui/image-cropper';
	import { PUBLIC_POCKETBASE_URL } from '$env/static/public';
	import { logout, toastApi } from '$lib/utils';
	import type { UsersResponse } from '$lib/types';
	import { writable } from 'svelte/store';
	import { pb } from '$lib/pocketbase/client';

	import { Input } from '$lib/components/ui/input';
	import { Snippet } from '$lib/components/ui/snippet';
	import { BasicElement } from '$lib/settings';
	import { onMount } from 'svelte';

	const userNameChangeValue = writable<string>($userStore?.username);
	const userDefaultSearchValue = writable<string>($userStore?.defaultSearch || 'core');
	const ableToEraseAccount = writable<boolean>(false);

	onMount(async () => {
		const ownTeams = await pb.collection('teams').getFullList({
			filter: `owner = "${$userStore?.id}"`
		});

		ableToEraseAccount.set(ownTeams.length === 0);
	});

	const userNameChangeSubmit = toastApi.execAsync(
		async () => {
			const result = await pb.collection('users').update<UsersResponse>($userStore?.id as string, {
				username: $userNameChangeValue
			});
			pb.collection('users').authRefresh();

			userStore.set(result);
		},
		'Username changed successfully.',
		'Failed to change username, may be username already exists.'
	);

	const userDeleteSubmit = toastApi.execAsync(
		async () => {
			await await logout();
		},
		'User deleted successfully.',
		'Failed to delete user.'
	);

	const changeDefaultSearch = toastApi.execAsync(
		async () => {
			const defaultSearchUser = await pb
				.collection('users')
				.getFirstListItem(`username = "${$userDefaultSearchValue}"`);

			console.log(defaultSearchUser);

			if (!defaultSearchUser) {
				throw new Error('Failed to change default search, this user might not exist.');
			}

			const result = await pb.collection('users').update<UsersResponse>($userStore?.id as string, {
				defaultSearch: $userDefaultSearchValue
			});

			userStore.set(result);
			pb.collection('users').authRefresh();
		},
		'Default search changed successfully.',
		'Failed to change default search, this user might not exist.'
	);

	const uploadAvatarToPocketBase = async (blob: Blob) => {
		const formData = new FormData();

		const fileName = `avatar_${Date.now()}.jpg`;
		const avatarFile = new File([blob], fileName, { type: 'image/jpeg' });

		formData.append('avatar', avatarFile);

		const result = await pb.collection('users').update($userStore?.id as string, formData);
		userStore.set(result);

		await pb.collection('users').authRefresh();
	};

	const handleCrop = toastApi.execAsync(
		async (url: string) => {
			const response = await fetch(url);
			const blob = await response.blob();

			uploadAvatarToPocketBase(blob);
		},
		'Avatar uploaded successfully.',
		'Failed to upload avatar.'
	);
</script>

<div class="grid w-full grid-cols-1 justify-items-center gap-6">
	<!-- Edit Name -->
	<BasicElement
		title="Username"
		description="This is your user's name and url in ControlHub. For example name of your school or university."
		execute={userNameChangeSubmit}
		footer="Use 32 characters at maximum."
	>
		<Input
			bind:value={$userNameChangeValue}
			class="w-[min(20rem,100%)]"
			oninput={() => userNameChangeValue.set($userNameChangeValue.slice(0, 32))}
			required
		/>
	</BasicElement>

	<BasicElement
		title="Avatar"
		description="This is your user's avatar in ControlHub."
		act={false}
		footer="Upload your avatar."
		putSlotInHeader={true}
	>
		<ImageCropper.Root
			src="{PUBLIC_POCKETBASE_URL}/api/files/users/{$userStore?.id}/{$userStore?.avatar}?thumb=300x300"
			onCropped={handleCrop}
		>
			<ImageCropper.UploadTrigger>
				<ImageCropper.Preview class="rounded-md" />
			</ImageCropper.UploadTrigger>
			<ImageCropper.Dialog>
				<ImageCropper.Cropper cropShape="rect" />
				<ImageCropper.Controls>
					<ImageCropper.Cancel />
					<ImageCropper.Crop />
				</ImageCropper.Controls>
			</ImageCropper.Dialog>
		</ImageCropper.Root>
	</BasicElement>

	<BasicElement
		title="User default search"
		description="This is username that will be searched by default when searching script for execution."
		footer="Be sure to use a username that exists."
		execute={changeDefaultSearch}
	>
		<Input bind:value={$userDefaultSearchValue} class="w-[min(20rem,100%)]" required />
	</BasicElement>

	<BasicElement
		title="User ID"
		description="This is your user ID within ControlHub."
		footer="Use this ID to access your user in our API."
		act={false}
	>
		<Snippet text={$userStore?.id as string} class="w-[min(16rem,100%)]" />
	</BasicElement>

	<BasicElement
		title="Delete user"
		description="Permanently remove your Personal Account and all of its contents from the ControlHub platform. This action is not reversible, so please continue with caution."
		useAlert={true}
		alertMessage="Are you sure you want to delete your user? This action cannot be undone, you will lose everything, accesses, teams, executions. Think twice before deleting your user."
		execute={userDeleteSubmit}
		saveButtonText="Delete"
		disabledSave={!$ableToEraseAccount}
		destructive={true}
	>
		<span
			>Before deleting your user, you need to: transfer ownerships of all your teams to another
			users or delete all your teams before deleting your user.</span
		>
	</BasicElement>
</div>
