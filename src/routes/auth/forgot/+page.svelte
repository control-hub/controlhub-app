<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Separator } from '$lib/components/ui/separator';
	import * as Card from '$lib/components/ui/card';

	import { goto } from '$app/navigation';
	import { LoaderCircle } from 'lucide-svelte';
	import { toastApi } from '$lib/utils';

	let formData = {
		email: ''
	};

	let loading = false;

	async function formAction() {
		loading = true;
		await toastApi.post(
			'/api/auth/forgot',
			formData,
			() => {
				goto('/auth/login');
			},
			() => {
				formData.email = '';
			}
		);
		loading = false;
	}
</script>

<Card.Header>
	<Card.Title class="text-2xl">Password Reset</Card.Title>
	<div>
		<Separator class="mb-3 mt-2" />
		<Card.Description>Enter your email below to reset your password.</Card.Description>
	</div>
</Card.Header>
<Card.Content>
	<form on:submit|preventDefault={formAction}>
		<div class="mb-4">
			<Input bind:value={formData.email} type="email" placeholder="Email" required class="w-full" />
		</div>
		<Button type="submit" class="mt-4 w-full" disabled={loading}>
			{#if loading}
				<LoaderCircle class="mr-2 h-4 w-4 animate-spin" />
			{:else}
				Reset my password
			{/if}
		</Button>
	</form>
</Card.Content>
