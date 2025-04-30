DO $$ BEGIN
 ALTER TABLE "expenses" ADD CONSTRAINT "expenses_client_lot_id_client_lots_id_fk" FOREIGN KEY ("client_lot_id") REFERENCES "public"."client_lots"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "interments" ADD CONSTRAINT "interments_client_lot_id_client_lots_id_fk" FOREIGN KEY ("client_lot_id") REFERENCES "public"."client_lots"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "invoices" ADD CONSTRAINT "invoices_client_lot_id_client_lots_id_fk" FOREIGN KEY ("client_lot_id") REFERENCES "public"."client_lots"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "payment_plans" ADD CONSTRAINT "payment_plans_client_lot_id_client_lots_id_fk" FOREIGN KEY ("client_lot_id") REFERENCES "public"."client_lots"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "perpetual_cares" ADD CONSTRAINT "perpetual_cares_client_lot_id_client_lots_id_fk" FOREIGN KEY ("client_lot_id") REFERENCES "public"."client_lots"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
