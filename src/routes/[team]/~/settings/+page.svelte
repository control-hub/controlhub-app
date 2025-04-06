<script lang="ts">
	import { TeamName } from '$lib/team/settings/team-name';
	import { LeaveTeam } from '$lib/team/settings/leave-team';
</script>

<div class="mb-6 w-[100vw] border-b border-input py-10 text-3xl font-medium">
	<span class="ml-[calc(min(10vw,100px))]"> Settings </span>
</div>

<div class="mx-auto grid w-[min(748px,100vw)] grid-cols-1 gap-6 px-6">
	<TeamName />
	<LeaveTeam />
</div>
