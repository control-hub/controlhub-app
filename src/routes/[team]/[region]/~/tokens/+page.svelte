<script lang="ts">
	import { computersStore } from '$lib/stores';
    import { Code } from '$lib/components/ui/code';

	const data = Object.fromEntries($computersStore.map((c) => [c.name, c.token]));
    const visualData = JSON.stringify(data, null, 2)
</script>

<Code lang="json" code={visualData}/>