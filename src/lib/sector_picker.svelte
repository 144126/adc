<script lang="ts">
	type Sector = { g: string; n: string };

	let {
		name,
		value = '',
		label = ''
	}: { name: string; value?: string; label?: string } = $props();

	let chosen = $state<Sector>({ g: value, n: label });
	let query = $state(label);
	let results = $state<Sector[]>([]);
	let open = $state(false);
	let adding = $state(false);
	let notice = $state('');
	let timer: ReturnType<typeof setTimeout>;

	async function search(q: string) {
		const r = await fetch(`/api/sectors?q=${encodeURIComponent(q)}`);
		results = r.ok ? await r.json() : [];
	}

	function on_input() {
		open = true;
		notice = '';
		chosen = { g: '', n: query };
		clearTimeout(timer);
		timer = setTimeout(() => search(query), 1440);
	}

	function pick(s: Sector) {
		chosen = s;
		query = s.n;
		open = false;
		notice = '';
	}

	async function add_sector() {
		const n = query.trim();
		if (!n) return;
		adding = true;
		notice = '';
		try {
			const r = await fetch('/api/sectors', {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({ n })
			});
			const body = (await r.json()) as { similar?: Sector; sector?: Sector };
			if (body.similar) {
				const similar = body.similar;
				notice = `a very similar sector already exists: "${similar.n}"`;
				results = [similar, ...results.filter((s: Sector) => s.g !== similar.g)];
			} else if (body.sector) {
				pick(body.sector);
			}
		} finally {
			adding = false;
		}
	}

	const exact_match = $derived(results.some((s) => s.n.toLowerCase() === query.trim().toLowerCase()));
</script>

<div class="relative flex flex-col gap-1 text-sm text-ink/70">
	sector*
	<input
		type="text"
		bind:value={query}
		oninput={on_input}
		onfocus={() => (open = true)}
		onblur={() => setTimeout(() => (open = false), 150)}
		placeholder="search or add a sector…"
		autocomplete="off"
		class="rounded-md border border-ink/20 px-3 py-2"
	/>
	<input type="hidden" {name} value={chosen.g} required />

	{#if open && (results.length || query.trim())}
		<ul class="absolute top-full z-10 mt-1 w-full rounded-md border border-ink/20 bg-white shadow-lg">
			{#each results as s (s.g)}
				<li>
					<button
						type="button"
						onmousedown={(e) => e.preventDefault()}
						onclick={() => pick(s)}
						class="block w-full px-3 py-2 text-left hover:bg-cobalt/10"
					>
						{s.n}
					</button>
				</li>
			{/each}
			{#if query.trim() && !exact_match}
				<li>
					<button
						type="button"
						disabled={adding}
						onmousedown={(e) => e.preventDefault()}
						onclick={add_sector}
						class="block w-full px-3 py-2 text-left text-cobalt hover:bg-cobalt/10 disabled:opacity-50"
					>
						{adding ? 'checking…' : `+ add sector "${query.trim()}"`}
					</button>
				</li>
			{/if}
		</ul>
	{/if}

	{#if notice}
		<p class="text-xs text-ochre">
			{notice} — <button type="button" class="underline" onclick={() => pick(results[0])}
				>use it</button
			>
		</p>
	{/if}
	{#if chosen.g}<p class="text-xs text-ink/50">selected: {chosen.n}</p>{/if}
</div>
