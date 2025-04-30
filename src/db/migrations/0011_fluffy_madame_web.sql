ALTER TABLE "payment_plans" ADD COLUMN "discount" double precision DEFAULT 0;--> statement-breakpoint
ALTER TABLE "payment_plans" ADD COLUMN "penalty" double precision DEFAULT 0;