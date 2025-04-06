<script lang="ts">
	import { Redirect } from '$lib/components/web/redirect';
	import { browser } from '$app/environment';

	if (browser) {
		window.location.reload();
	}
</script>

<Redirect type="inner" />
