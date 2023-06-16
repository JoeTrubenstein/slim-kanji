import type { PrismaClient } from "@prisma/client";

declare global {

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
// and what to do when importing types

	namespace App {
	// interface Locals {}
	// interface PageData {}
	// interface Error {}
	// interface Platform {}
	}
	var prisma: PrismaClient
}




