import { prisma } from '$lib/server/prisma';
import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

import type { ModalSettings } from '@skeletonlabs/skeleton';
import { modalStore } from '@skeletonlabs/skeleton';


function getRandomInt(min: number, max: number) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min) + min);
}

export const load: PageServerLoad = async ({locals}) => {
	return {
		characters: await prisma.character.findMany({where: {jlpt: {contains: "N"}}, skip:getRandomInt(1, 200), take: 25 }),
	};
};

function modalReg(): void {
	const modal: ModalSettings = {
		type: 'alert',
		title: 'Success!',
		body: `Account created for ${" "}`,
		image: 'https://i.imgur.com/TykCy5e.gif',
		buttonTextCancel: "Go back"
		// image: 'https://i.imgur.com/WOgTG96.gif'
	};
	modalStore.trigger(modal);
}

export const actions: Actions = {

	createCharacter: async ({ request }) => {
		const { kanji, jlpt, onyomi, kunyomi, meaning } = Object.fromEntries(
			await request.formData()
		) as {
			kanji: string;
			jlpt: string;
			onyomi: string;
			kunyomi: string;
			meaning: string;
		};

		try {
			await prisma.character.create({
				data: {
					kanji,
					jlpt,
					onyomi,
					kunyomi,
					meaning
				}
			});
		} catch (err) {
			console.error(err);
			return fail(500, { message: 'Could not create the article.' });
		}

		return {
			status: 201
		};
	},
	deleteCharacter: async ({ url }) => {
		const id = url.searchParams.get('id');
		if (!id) {
			return fail(400, { message: 'Invalid request' });
		}

		try {
			await prisma.character.delete({
				where: {
					id: Number(id)
				}
			});
		} catch (err) {
			console.error(err);
			return fail(500, {
				message: 'Something went wrong deleting your character'
			});
		}

		return {
			status: 200
		};
	}
};
