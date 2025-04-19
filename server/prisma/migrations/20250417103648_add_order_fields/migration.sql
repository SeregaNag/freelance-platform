-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "attachments" TEXT[],
ADD COLUMN     "category" TEXT,
ADD COLUMN     "deadline" TIMESTAMP(3),
ADD COLUMN     "maxBudget" DOUBLE PRECISION,
ADD COLUMN     "minBudget" DOUBLE PRECISION,
ADD COLUMN     "rating" DOUBLE PRECISION,
ADD COLUMN     "review" TEXT,
ADD COLUMN     "skills" TEXT[];
