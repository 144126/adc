import type { RequestHandler } from './$types';
import { error, json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { list_sectors, add_sector, find_similar_sector } from '$lib/server/sectors';

export const GET: RequestHandler = async ({ url }) => {
	const q = (url.searchParams.get('q') ?? '').trim().toLowerCase();
	const all = await list_sectors(env);
	const matches = q ? all.filter((s) => s.n.toLowerCase().includes(q)) : all;
	return json(matches.slice(0, 20));
};

export const POST: RequestHandler = async ({ request, locals }) => {
	if (!locals.user) throw error(401, 'auth');
	const { n } = (await request.json()) as { n?: string };
	const name = (n ?? '').trim();
	if (!name) throw error(400, 'name required');

	const existing = await list_sectors(env);
	const exact = existing.find((s) => s.n.toLowerCase() === name.toLowerCase());
	if (exact) return json({ similar: exact });

	const similar = await find_similar_sector(env, name, existing);
	if (similar) return json({ similar });

	const sector = await add_sector(env, name, existing);
	return json({ sector }, { status: 201 });
};
