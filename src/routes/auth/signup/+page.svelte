<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Separator } from '$lib/components/ui/separator';
	import * as Card from '$lib/components/ui/card';

	import { LoaderCircle } from 'lucide-svelte';

	import { toastApi } from '$lib/utils';
	import { goto } from '$app/navigation';

	let formData = {
		username: '',
		email: '',
		password: '',
		passwordConfirm: ''
	};

	let loading = false;

	async function formAction() {
		loading = true;
		await toastApi.post('/api/auth/signup', formData, () => {
			goto('/teams');
		});
		loading = false;
	}
</script>

<Card.Header>
	<Card.Title class="text-2xl">Sign up</Card.Title>
	<div>
		<Separator class="mb-3 mt-2" />
		<Card.Description>Enter username, email and password to continue.</Card.Description>
	</div>
</Card.Header>
<Card.Content>
	<form on:submit|preventDefault={formAction}>
		<div class="mb-4">
			<Input
				bind:value={formData.username}
				type="text"
				placeholder="Username"
				required
				class="w-full"
			/>
		</div>
		<div class="mb-4">
			<Input bind:value={formData.email} type="email" placeholder="Email" required class="w-full" />
		</div>
		<div class="mb-4">
			<Input
				bind:value={formData.password}
				type="password"
				placeholder="Password"
				required
				class="w-full"
			/>
		</div>
		<div class="mb-4">
			<Input
				bind:value={formData.passwordConfirm}
				type="password"
				placeholder="Confirm password"
				required
				class="w-full"
			/>
		</div>
		<Button type="submit" class="mt-4 w-full" disabled={loading}>
			{#if loading}
				<LoaderCircle class="mr-2 h-4 w-4 animate-spin" />
			{:else}
				Sign up
			{/if}
		</Button>
	</form>
</Card.Content>
<Card.Footer>
	<p class="text-center text-sm">
		Have an account? <a href="/auth/login/" class="text-blue-500">Login</a>
	</p>
</Card.Footer>
