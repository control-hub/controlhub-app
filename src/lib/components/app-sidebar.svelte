<script lang="ts">
	import { FileCode2, Settings2, Users, Github, Download } from 'lucide-svelte';
	import type { NavPage } from './sidebar-types';
	// This is sample data.
	let data: {
		navMain: NavPage[];
	} = {
		navMain: [
			{
				title: 'Teams',
				url: '/teams',
				icon: Users
			},
			{
				title: 'Scripts',
				url: '/scripts',
				icon: FileCode2
			},
			{
				title: 'Settings',
				url: '/settings',
				icon: Settings2
			},
			{
				title: 'Download',
				url: 'https://github.com/control-hub/controlhub-client/releases',
				icon: Download,
				ctrl: true
			},
			{
				title: 'GitHub',
				url: 'https://github.com/orgs/control-hub/repositories',
				icon: Github,
				ctrl: true
			}
		]
	};

	import NavMain from '$lib/components/nav-main.svelte';
	import NavUser from '$lib/components/nav-user.svelte';
	import TeamSwitcher from '$lib/components/team-switcher.svelte';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import type { ComponentProps } from 'svelte';

	let {
		ref = $bindable(null),
		collapsible = 'icon',
		...restProps
	}: ComponentProps<typeof Sidebar.Root> & {
	} = $props();
</script>

<Sidebar.Root bind:ref {collapsible} {...restProps} class="z-50">
	<Sidebar.Header>
		<TeamSwitcher />
	</Sidebar.Header>
	<Sidebar.Content>
		<NavMain items={data.navMain} />
	</Sidebar.Content>
	<Sidebar.Footer>
		<NavUser />
	</Sidebar.Footer>
	<Sidebar.Rail />
</Sidebar.Root>
