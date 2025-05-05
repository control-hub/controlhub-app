<script lang="ts">
	import { computersStore } from '$lib/stores';
    import { CopyText } from '$lib/text/copy';

	const data = Object.fromEntries($computersStore.map((c) => [c.name, c.token]));
    const visualData = JSON.stringify(data, null, 2)
</script>

<CopyText value={visualData} class="justify-center"/>