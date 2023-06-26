-- CreateTable
CREATE TABLE "Character" (
    "id" SERIAL NOT NULL,
    "kanji" TEXT,
    "onyomi" TEXT,
    "kunyomi" TEXT,
    "jlpt" TEXT,
    "meaning" TEXT,

    CONSTRAINT "Character_pkey" PRIMARY KEY ("id")
);
