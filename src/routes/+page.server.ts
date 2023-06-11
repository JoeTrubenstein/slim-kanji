import type { PageServerLoad } from "./$types";
import {prisma} from "$lib/server/prisma"

export const load: PageServerLoad = async () => {
    return {
        characters: await prisma.character.findMany({ take: 6 }),
    }
}

// export const completion = await openai.createCompletion({
//     model: "text-davinci-003",
//     prompt: generatePrompt(req.body.animal),
//     temperature: 0.6,
//   });