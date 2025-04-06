<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Separator } from '$lib/components/ui/separator';
	import * as Card from '$lib/components/ui/card';

	import { LoaderCircle } from 'lucide-svelte';

	import { toastApi } from '$lib/utils';
	import { goto } from '$app/navigation';

	export let data: {
		token: string;
	};

	let formData = {
		token: data.token,
		password: '',
		passwordConfirm: ''
	};

	let loading = false;

	async function formAction() {
		loading = true;

		await toastApi.post('/api/auth/forgot/slug', formData, () => {
			goto('/auth/login');
		});

		loading = false;
	}
</script>

<Card.Header>
	<Card.Title class="text-2xl">Change Password</Card.Title>
	<div>
		<Separator class="mt-2" />
	</div>
</Card.Header>
<Card.Content>
	<form on:submit|preventDefault={formAction}>
		<div class="mb-4">
			<Input
				bind:value={formData.password}
				type="password"
				placeholder="New password"
				required
				class="w-full"
			/>
		</div>
		<div class="mb-4">
			<Input
				bind:value={formData.passwordConfirm}
				type="password"
				placeholder="Confirm new password"
				required
				class="w-full"
			/>
		</div>
		<Button type="submit" class="mt-4 w-full" disabled={loading}>
			{#if loading}
				<LoaderCircle class="mr-2 h-4 w-4 animate-spin" />
			{:else}
				Change password
			{/if}
		</Button>
	</form>
</Card.Content>
