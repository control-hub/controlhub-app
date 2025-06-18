<script lang="ts">
    import { goto } from '$app/navigation'
	import { userStore } from '$lib/stores';

    import { onMount } from 'svelte'

    onMount(() => {
        if ($userStore) {
            goto('/scripts/' + ($userStore?.username || 'core') + '/', { replaceState: true })
        }
    })
</script>