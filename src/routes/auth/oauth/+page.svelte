<script lang="ts">
	import { Redirect } from '$lib/components/web/redirect';
	import { onMount } from 'svelte';

	onMount(() => {
		window.location.href = "/";
	})
</script>

<Redirect type="inner" />
