CREATE TABLE IF NOT EXISTS "payment_plans" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "payment_plans_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"client_lot_id" integer NOT NULL,
	"installment_months" varchar,
	"due_date" date NOT NULL,
	"payment_due" double precision NOT NULL
);
