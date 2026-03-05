-- CreateTable
CREATE TABLE "Update" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "template" TEXT NOT NULL,
    "rag" TEXT,
    "content_json" TEXT NOT NULL,
    "source_raw" TEXT NOT NULL,
    "schema_version" INTEGER NOT NULL DEFAULT 1,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Update_pkey" PRIMARY KEY ("id")
);
