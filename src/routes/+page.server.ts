import type { PageServerLoad } from "./$types";
import {prisma} from "$lib/server/prisma"

export const load: PageServerLoad = async () => {
    return {
        characters: await prisma.character.findMany({ take: 6 }),
    }
}