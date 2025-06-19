<script lang="ts">
    import { goto } from '$app/navigation'
	import { userStore } from '$lib/stores';
	import { customEncode } from '$lib/utils';

    import { onMount } from 'svelte'

    onMount(() => {
        if ($userStore) {
            goto('/scripts/' + customEncode($userStore?.username || 'core') + '/', { replaceState: true })
        }
    })
</script>