// prisma/seed.ts

import { PrismaClient } from '@prisma/client'
import characterData from "../src/lib/kanji.json" assert { type: "json" }

const prisma = new PrismaClient()

async function main() {
  console.log(`Start seeding ...`)

  for (const p of characterData) {
    const character = await prisma.character.create({
      data: {
        kanji: p.kanji,
        onyomi: p.onyomi,
        kunyomi: p.kunyomi,
        meaning: p.meaning,
        jlpt: p.jlpt
      }
    })
    console.log(`Created user with id: ${character.id}`)
  }
  console.log(`Seeding finished.`)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })