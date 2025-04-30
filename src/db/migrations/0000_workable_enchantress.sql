CREATE TYPE "public"."expense_purpose" AS ENUM('Agent Incentive', 'Contractor');--> statement-breakpoint
CREATE TYPE "public"."in_need" AS ENUM('Yes', 'No');--> statement-breakpoint
CREATE TYPE "public"."type" AS ENUM('Flesh', 'Bone');--> statement-breakpoint
CREATE TYPE "public"."invoice_purpose" AS ENUM('Full Payment', 'Downpayment', 'Payment Plan', 'Interment', 'Perpetual Care', 'Reservation');--> statement-breakpoint
CREATE TYPE "public"."lot_type" AS ENUM('Corner', 'Family Estate', 'Inner', 'Pathway', 'Roadside');--> statement-breakpoint
CREATE TYPE "public"."role" AS ENUM('ADMIN', 'ACCOUNTS_CLERK');--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "blocks" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "blocks_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"property_id" integer,
	"name" varchar NOT NULL,
	"created_by" varchar NOT NULL,
	"created_on" date NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "client_lots" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "client_lots_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"client_id" integer NOT NULL,
	"property_id" integer NOT NULL,
	"block_id" integer NOT NULL,
	"lot_id" integer NOT NULL,
	"reservation" integer,
	"payment_type" varchar,
	"payment_plan" varchar,
	"in_need" "in_need",
	"terms" integer,
	"downpayment" varchar,
	"perpetual_care_price" integer,
	"discount" integer,
	"months_to_pay" integer,
	"monthly" integer,
	"total_interest" integer,
	"actual_price" integer,
	"balance" integer,
	"agent" varchar,
	"created_by" varchar NOT NULL,
	"created_on" date NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "clients" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "clients_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"first_name" varchar NOT NULL,
	"last_name" varchar NOT NULL,
	"birth_date" date NOT NULL,
	"email" varchar NOT NULL,
	"full_address" varchar NOT NULL,
	"mobile_number" varchar NOT NULL,
	"landline_number" varchar,
	"created_by" varchar NOT NULL,
	"created_on" date NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "expenses" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "expenses_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"client_lot_id" integer NOT NULL,
	"purpose" "expense_purpose" NOT NULL,
	"payment" integer NOT NULL,
	"date_of_payment" date NOT NULL,
	"receipt" varchar NOT NULL,
	"remarks" varchar,
	"created_by" varchar NOT NULL,
	"created_on" date NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "interments" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "interments_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"client_lot_id" integer NOT NULL,
	"dig" integer,
	"type" "type",
	"deceased_name" varchar,
	"deceased_born" date,
	"deceased_died" date,
	"remains_name" varchar,
	"remains_born" date,
	"remains_died" date,
	"interment_date" date,
	"interment_time" varchar,
	"contractor_name" varchar,
	"contractor_mobile_number" varchar,
	"created_by" varchar,
	"created_on" date NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "invoices" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "invoices_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"client_lot_id" integer NOT NULL,
	"purpose" "invoice_purpose" NOT NULL,
	"payment" integer NOT NULL,
	"date_of_payment" date NOT NULL,
	"receipt" varchar NOT NULL,
	"remarks" varchar,
	"created_by" varchar NOT NULL,
	"created_on" date NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "lots" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "lots_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"block_id" integer,
	"name" varchar NOT NULL,
	"lotType" "lot_type" NOT NULL,
	"price" numeric NOT NULL,
	"remarks" varchar,
	"taken" boolean DEFAULT false NOT NULL,
	"created_by" varchar NOT NULL,
	"created_on" date NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "perpetual_cares" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "perpetual_cares_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"client_lot_id" integer NOT NULL,
	"installment_years" varchar,
	"due_date" date NOT NULL,
	"payment_due" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "properties" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "properties_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar NOT NULL,
	"full_address" varchar NOT NULL,
	"created_by" varchar NOT NULL,
	"created_on" date NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "users_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"first_name" varchar NOT NULL,
	"last_name" varchar NOT NULL,
	"email" varchar NOT NULL,
	"password" varchar NOT NULL,
	"role" "role" DEFAULT 'ACCOUNTS_CLERK',
	"has_logged_in_once" boolean DEFAULT false,
	"created_by" varchar NOT NULL,
	"created_on" date NOT NULL
);
