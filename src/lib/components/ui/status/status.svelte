<script lang="ts">
	import { cn } from '$lib/utils';

	export let status: '0' | '1' | '2';
	export let size: number = 2;

	const statusMap = {
		'0': 'bg-red-500', // off
		'1': 'bg-yellow-500', // working
		'2': 'bg-green-500' // on
	};
</script>

<div
	class={cn(`h-${size} aspect-square rounded-full`, statusMap[status], $$props.class)}
	{...$$restProps}
></div>
