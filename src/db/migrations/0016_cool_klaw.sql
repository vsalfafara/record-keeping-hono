ALTER TABLE "payment_plans" ALTER COLUMN "status" SET DATA TYPE varchar;--> statement-breakpoint
ALTER TABLE "payment_plans" ALTER COLUMN "status" SET DEFAULT 'Pending';