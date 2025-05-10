<script lang="ts">
	import { FileCode2 } from 'lucide-svelte';
	import Settings2 from '@lucide/svelte/icons/settings-2';
	import SquareTerminal from '@lucide/svelte/icons/square-terminal';
	import type { NavPage } from './sidebar-types';

	// This is sample data.
	let data: {
		navMain: NavPage[];
	} = {
		navMain: [
			{
				title: 'Teams',
				url: '/teams',
				icon: SquareTerminal
			},
			{
				title: 'Scripts',
				url: '/scripts',
				icon: FileCode2
			},
			{
				title: 'Settings',
				url: '#',
				icon: Settings2,
				items: [
					{
						title: 'General',
						url: '#'
					},
					{
						title: 'Team',
						url: '#'
					}
				]
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
