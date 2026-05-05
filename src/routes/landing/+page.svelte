<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import { Badge } from '$lib/components/ui/badge';
	import { Separator } from '$lib/components/ui/separator';
	import { Check } from 'lucide-svelte';
	import { cn } from '$lib/utils';

	const plans = [
		{
			id: 'lite',
			name: 'Lite',
			price: 5,
			blurb: 'Solo operators and small stacks.',
			highlight: false,
			features: [
				'Control Hub subscription — dashboard & core automation',
				'Up to 10 enrolled devices',
				'Community docs & standard email support',
				'Monthly usage snapshots'
			]
		},
		{
			id: 'normal',
			name: 'Normal',
			price: 10,
			blurb: 'Teams that need room to grow.',
			highlight: true,
			features: [
				'Everything in Lite',
				'Up to 50 devices with shared policies',
				'Priority queue support (next-business-day)',
				'Webhook alerts & basic audit trail'
			]
		},
		{
			id: 'pro',
			name: 'Pro',
			price: 20,
			blurb: 'Heavy usage and hands-on help.',
			highlight: false,
			features: [
				'Everything in Normal',
				'Unlimited devices (fair-use)',
				'Premium support with named channel',
				'Full API access, SLA-backed uptime notes'
			]
		}
	] as const;
</script>

<div class="min-h-screen bg-background">
	<header class="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
		<div class="container flex max-w-6xl items-center justify-between gap-4 py-4">
			<div class="flex items-center gap-2">
				<span class="text-lg font-semibold tracking-tight">Control Hub</span>
				<Badge variant="secondary" class="font-normal">Subscription</Badge>
			</div>
			<Button variant="outline" size="sm" href="/auth/login">Sign in</Button>
		</div>
	</header>

	<main>
		<section class="relative overflow-hidden border-b border-border">
			<div
				class="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,hsl(var(--primary)/0.12),transparent)]"
			></div>
			<div class="container relative max-w-6xl py-16 md:py-24">
				<div class="mx-auto max-w-2xl text-center">
					<h1 class="text-balance text-4xl font-bold tracking-tight md:text-5xl">
						Run every device from one calm dashboard
					</h1>
					<p class="mt-4 text-pretty text-muted-foreground md:text-lg">
						Control Hub ties your fleet together: enroll hardware, push configs, and see health at a
						glance. Pick a plan by how many endpoints you actually manage—we scale with you.
					</p>
					<div class="mt-8 flex flex-wrap items-center justify-center gap-3">
						<Button size="lg" href="#pricing">View plans</Button>
						<Button variant="outline" size="lg" href="/auth/login">Open console</Button>
					</div>
				</div>
			</div>
		</section>

		<section id="pricing" class="container max-w-6xl scroll-mt-20 py-16 md:py-20">
			<div class="mx-auto max-w-2xl text-center">
				<h2 class="text-3xl font-bold tracking-tight">Simple pricing</h2>
				<p class="mt-3 text-muted-foreground">
					Flat monthly tiers in USD. Upgrade or downgrade whenever your rollout changes.
				</p>
			</div>

			<div class="mt-12 grid gap-6 md:grid-cols-3">
				{#each plans as plan (plan.id)}
					<Card.Root
						class={cn(
							'relative flex flex-col transition-shadow',
							plan.highlight &&
								'border-primary/40 shadow-md ring-1 ring-primary/25 md:scale-[1.02]'
						)}
					>
						{#if plan.highlight}
							<div class="absolute right-4 top-4">
								<Badge>Popular</Badge>
							</div>
						{/if}
						<Card.Header>
							<Card.Title class="text-xl">{plan.name}</Card.Title>
							<Card.Description>{plan.blurb}</Card.Description>
							<div class="mt-4 flex items-baseline gap-1">
								<span class="text-4xl font-bold">${plan.price}</span>
								<span class="text-muted-foreground">/mo</span>
							</div>
						</Card.Header>
						<Card.Content class="flex flex-1 flex-col gap-4">
							<Separator />
							<ul class="flex flex-1 flex-col gap-3 text-sm">
								{#each plan.features as line (line)}
									<li class="flex gap-2">
										<Check class="mt-0.5 shrink-0 text-primary" aria-hidden="true" />
										<span>{line}</span>
									</li>
								{/each}
							</ul>
						</Card.Content>
						<Card.Footer>
							<Button
								class="w-full"
								variant={plan.highlight ? 'default' : 'outline'}
								href="/auth/login"
							>
								Choose {plan.name}
							</Button>
						</Card.Footer>
					</Card.Root>
				{/each}
			</div>
		</section>

		<section class="border-t border-border bg-muted/30 py-12">
			<div class="container max-w-6xl">
				<p class="mb-6 text-center text-sm text-muted-foreground">
					Payments on this page are processed via Freekassa.
				</p>
				<div class="flex justify-center">
					<a href="https://freekassa.net" target="_blank" rel="noopener noreferrer">
						<img
							src="https://cdn.freekassa.net/banners/big-dark-1.png"
							alt="Freekassa — accepting payments online"
							class="max-w-full rounded-md border border-border"
							width="468"
							height="60"
						/>
					</a>
				</div>
			</div>
		</section>
	</main>
</div>
