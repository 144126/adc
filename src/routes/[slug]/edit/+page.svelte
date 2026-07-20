<script lang="ts">
	import type { PageData } from './$types';
	import { enhance } from '$app/forms';
	import { sector_order, sector_info } from '$lib/sectors';
	let { data }: { data: PageData } = $props();
	const p = $derived(data.p as Record<string, string> & { b?: Record<string, string> });
	const b = $derived(p.b ?? {});
	let rev = $state(p.m ?? '');
</script>

<svelte:head>
	<title>edit {p.n} — devcircles</title>
</svelte:head>

<div class="mx-auto max-w-2xl px-6 py-16">
	<h1 class="font-display text-3xl font-semibold tracking-tight text-ink">edit {p.n}</h1>
	<p class="mt-3 text-ink/60">the product name is fixed since the page url is derived from it.</p>

	<form method="POST" action="?/save" use:enhance class="mt-10 flex flex-col gap-8">
		<div class="flex flex-col gap-4">
			<h2 class="text-sm font-semibold tracking-wide text-cobalt uppercase">about the product</h2>
			<label class="flex flex-col gap-1 text-sm text-ink/70">
				sector
				<select name="c" value={p.c} class="rounded-md border border-ink/20 px-3 py-2">
					{#each sector_order as s}
						<option value={s}>{sector_info[s].n}</option>
					{/each}
				</select>
			</label>
			<label class="flex flex-col gap-1 text-sm text-ink/70">
				product link
				<input name="u" type="url" value={p.u} class="rounded-md border border-ink/20 px-3 py-2" />
			</label>
			<label class="flex flex-col gap-1 text-sm text-ink/70">
				one-liner
				<textarea name="o" rows="2" class="rounded-md border border-ink/20 px-3 py-2"
					>{p.o}</textarea
				>
			</label>
			<label class="flex flex-col gap-1 text-sm text-ink/70">
				what it does (more detail, optional)
				<textarea name="w" rows="3" class="rounded-md border border-ink/20 px-3 py-2"
					>{p.w}</textarea
				>
			</label>
			<label class="flex flex-col gap-1 text-sm text-ink/70">
				why it matters
				<textarea name="h" rows="3" class="rounded-md border border-ink/20 px-3 py-2"
					>{p.h}</textarea
				>
			</label>
			<label class="flex flex-col gap-1 text-sm text-ink/70">
				where it can grow
				<textarea name="x" rows="3" class="rounded-md border border-ink/20 px-3 py-2"
					>{p.x}</textarea
				>
			</label>
		</div>

		<div class="flex flex-col gap-4">
			<h2 class="text-sm font-semibold tracking-wide text-cobalt uppercase">builder contact</h2>
			<label class="flex flex-col gap-1 text-sm text-ink/70">
				name
				<input name="y" value={b.n} class="rounded-md border border-ink/20 px-3 py-2" />
			</label>
			<label class="flex flex-col gap-1 text-sm text-ink/70">
				email (only shown publicly if you check the box below)
				<input name="e" type="email" value={b.e} class="rounded-md border border-ink/20 px-3 py-2" />
			</label>
			<label class="flex items-center gap-2 text-sm text-ink/70">
				<input type="checkbox" name="pe" checked={!!b.e} />
				show my email publicly on this page
			</label>
			<label class="flex flex-col gap-1 text-sm text-ink/70">
				phone (shown publicly)
				<input name="p" value={b.p} class="rounded-md border border-ink/20 px-3 py-2" />
			</label>
			<label class="flex flex-col gap-1 text-sm text-ink/70">
				linkedin
				<input name="i" value={b.l} class="rounded-md border border-ink/20 px-3 py-2" />
			</label>
			<label class="flex flex-col gap-1 text-sm text-ink/70">
				location
				<input name="v" value={b.c} class="rounded-md border border-ink/20 px-3 py-2" />
			</label>
		</div>

		<div class="flex flex-col gap-4">
			<h2 class="text-sm font-semibold tracking-wide text-cobalt uppercase">metrics</h2>
			<label class="flex flex-col gap-1 text-sm text-ink/70">
				launch date
				<input name="d" type="date" value={p.d} class="rounded-md border border-ink/20 px-3 py-2" />
			</label>
			<label class="flex flex-col gap-1 text-sm text-ink/70">
				users / signups / downloads
				<input
					name="q"
					type="number"
					min="0"
					value={p.q}
					class="rounded-md border border-ink/20 px-3 py-2"
				/>
			</label>
			<label class="flex flex-col gap-1 text-sm text-ink/70">
				making revenue?
				<select name="m" bind:value={rev} class="rounded-md border border-ink/20 px-3 py-2">
					<option value="">prefer not to say</option>
					<option value="y">yes</option>
					<option value="n">no</option>
				</select>
			</label>
			{#if rev === 'y'}
				<label class="flex flex-col gap-1 text-sm text-ink/70">
					monthly revenue (₦)
					<input
						name="a"
						type="number"
						min="0"
						value={p.a}
						class="rounded-md border border-ink/20 px-3 py-2"
					/>
				</label>
			{/if}
			<label class="flex flex-col gap-1 text-sm text-ink/70">
				team size
				<input
					name="z"
					type="number"
					min="0"
					value={p.z}
					class="rounded-md border border-ink/20 px-3 py-2"
				/>
			</label>
			<label class="flex flex-col gap-1 text-sm text-ink/70">
				proudest metric
				<input name="k" value={p.k} class="rounded-md border border-ink/20 px-3 py-2" />
			</label>
		</div>

		<div class="flex items-center gap-4">
			<button
				type="submit"
				class="rounded-full bg-cobalt px-6 py-3 text-sm font-medium text-white hover:bg-cobalt/90"
			>
				save changes
			</button>
			<a href="/{p.g}" class="text-sm text-ink/60 hover:underline">cancel</a>
		</div>
	</form>

	<form method="POST" action="?/del" use:enhance class="mt-16 rounded-lg border border-coral/30 p-6">
		<h2 class="text-sm font-semibold tracking-wide text-coral uppercase">remove this product</h2>
		<p class="mt-2 text-sm text-ink/60">this permanently deletes the page. it cannot be undone.</p>
		<label class="mt-4 flex items-center gap-2 text-sm text-ink/70">
			<input type="checkbox" name="confirm" required />
			yes, permanently remove this page
		</label>
		<button
			type="submit"
			class="mt-4 rounded-full bg-coral px-6 py-3 text-sm font-medium text-white hover:bg-coral/90"
		>
			delete product
		</button>
	</form>
</div>
