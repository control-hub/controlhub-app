<script lang="ts">
	import { pb } from '$lib/pocketbase/client';
	import { teamStore } from '$lib/stores.js';
	import type { TeamsResponse } from '$lib/types';
	import { onMount } from 'svelte';

	onMount(async () => {
		try {
			const team = await pb
				.collection('teams')
				.getOne<TeamsResponse>($teamStore?.id as string, { expand: 'owner, user' });

			teamStore.set(team);
			console.log(team, '/');
			window.location.href = '/' + team.name;
		} catch (err) {
			console.log(err);
			window.location.href = '/start';
		}
	});
</script>
