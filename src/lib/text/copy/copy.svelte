<script lang="ts">
	import { cn } from '$lib/utils';
	import { CopyButton } from '$lib/components/ui/copy-button';

	export let value: string;
</script>

<div
	class={cn("relative mt-8 flex h-full w-full items-center rounded-md bg-muted-foreground/10 p-4 min-w-0", $$props.class)}
>
	<CopyButton text={value} class="absolute right-4 top-4" />
	<div class="w-full whitespace-pre-wrap break-all font-mono text-sm">
		{value}
	</div>
</div>
