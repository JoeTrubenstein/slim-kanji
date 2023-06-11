import type { Actions, PageServerLoad } from './$types';
import { prisma } from '$lib/server/prisma';
import { fail } from '@sveltejs/kit';

function getRandomInt(min: number, max: number) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
}

export const load: PageServerLoad = async () => {
	return {
		characters: await prisma.character.findMany({ skip: getRandomInt(1, 6000), take: 3 })
	};
};

export const actions: Actions = {
	reloadKanji: async () => {
		return {
			characters: await prisma.character.findMany({ skip: getRandomInt(1, 6000), take: 3 })
		};
	},

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

// export const completion = await openai.createCompletion({
//     model: "text-davinci-003",
//     prompt: generatePrompt(req.body.animal),
//     temperature: 0.6,
//   });
