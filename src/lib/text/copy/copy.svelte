<script lang="ts">
	import { Copy } from 'lucide-svelte';
	import { Button } from '$lib/components/ui/button';
	import { toast } from 'svelte-sonner';
	import { cn } from '$lib/utils';

	export let value: string;

	const copyTokens = () => {
		navigator.clipboard.writeText(value);
		toast.success('Tokens copied to clipboard');
	};
</script>

<div
	class={cn("relative mt-8 flex h-full w-full items-center rounded-md bg-muted-foreground/10 p-4 min-w-0", $$props.class)}
>
	<Button class="absolute right-4 top-4" variant="secondary" onclick={copyTokens}>
		<Copy />
	</Button>
	<div class="w-full whitespace-pre-wrap break-all font-mono text-sm">
		{value}
	</div>
</div>
