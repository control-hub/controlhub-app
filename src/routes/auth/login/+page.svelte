<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { LoaderCircle, Mail } from 'lucide-svelte';
	import { theme } from 'theme-selector';

	import { goto } from '$app/navigation';
	import { toastApi } from '$lib/utils';
	import { slide } from 'svelte/transition';
	import { logos } from '$lib/config';
	import { env } from '$env/dynamic/public';
	import type { AuthProviderInfo } from 'pocketbase';

	let isLoginVisible = false;

	export let data;

	let formData = {
		login: '',
		password: ''
	};

	let loading = false;

	function getLogoUrl(provider: AuthProviderInfo, currentTheme: 'light' | 'dark') {
		// @ts-ignore
		if (logos[provider.name] && logos[provider.name][currentTheme]) {
			// @ts-ignore
			return logos[provider.name][currentTheme];
		} else {
			return `${env.PUBLIC_POCKETBASE_URL}/_/images/oauth2/${provider.name}.svg`;
		}
	}

	async function formAction() {
		loading = true;
		await toastApi.post('/api/auth/login', formData, () => {
			goto('/');
		});
		loading = false;
	}

	async function Oauth2Login(provider: string) {
		loading = true;

		const answer = await toastApi.post('/api/auth/oauth', { provider });
		window.location.href = answer.data.url;

		loading = false;
	}
</script>

<Card.Content>
	<div>
		<div class="mt-4 flex flex-col space-y-4">
			{#each data.providers as provider (provider.name)}
				<Button
					variant="outline"
					class="relative w-full"
					onclick={() => Oauth2Login(provider.name)}
				>
					<img
						src={getLogoUrl(provider, $theme)}
						class="mr-2 h-full"
						alt="{provider.displayName} logo"
					/>
					Continue with {provider.displayName}
				</Button>
			{/each}
			<div class="relative my-4">
				<div class="absolute inset-0 flex items-center">
					<span class="w-full border-t"></span>
				</div>
				<div class="relative flex justify-center text-xs uppercase">
					<span class="px-2 text-muted-foreground">Or continue with</span>
				</div>
			</div>
			<Button
				onclick={() => (isLoginVisible = !isLoginVisible)}
				variant="outline"
				class="mb-2 w-full"
			>
				<Mail class="mr-2 aspect-square h-full" />Continue with email
			</Button>
		</div>
	</div>
	{#if isLoginVisible}
		<form on:submit|preventDefault={formAction} class="my-4 space-y-4" transition:slide>
			<Input
				bind:value={formData.login}
				type="text"
				placeholder="Username or email"
				required
				class="w-full"
			/>
			<Input
				bind:value={formData.password}
				type="password"
				placeholder="Password"
				required
				class="w-full"
			/>
			<Button type="submit" class="w-full" disabled={loading}>
				{#if loading}
					<LoaderCircle class="mr-2 h-4 w-4 animate-spin" />
				{:else}
					Login
				{/if}
			</Button>
		</form>
	{/if}
</Card.Content>

{#if isLoginVisible}
	<div transition:slide>
		<Card.Footer>
			<div class="flex w-full items-center justify-between">
				<p class="text-center text-sm">
					Don't have an account? <a href="/auth/signup" class="text-blue-500">Sign up</a>
				</p>
				<p class="text-center text-sm">
					<a href="/auth/forgot" class="text-foreground/40">Forgot password?</a>
				</p>
			</div>
		</Card.Footer>
	</div>
{/if}
