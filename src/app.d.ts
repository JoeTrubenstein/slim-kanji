import type { PrismaClient } from "@prisma/client";

declare global {

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
// and what to do when importing types

type User = {
	id: number
	email: string
	role: string
}


	namespace App {

		interface Locals {
			user: User | null
		}

	// interface PageData {}
	// interface Error {}
	// interface Platform {}
	}
	var prisma: PrismaClient
}




