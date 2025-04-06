<script lang="ts">
	import '../app.css';

	import { Toaster } from 'svelte-sonner';
	import { theme } from 'theme-selector';
</script>

<Toaster richColors theme={$theme} />
<slot />
