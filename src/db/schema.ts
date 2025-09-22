import { relations } from "drizzle-orm";
import * as t from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

/**
 * Enums
 */

export const roles = t.pgEnum("role", ["ADMIN", "ACCOUNTS_CLERK"]);
export const inNeed = t.pgEnum("in_need", ["Yes", "No"]);
export const intermentTypes = t.pgEnum("type", ["Flesh", "Bone"]);
export const expensesPurposes = t.pgEnum("expense_purpose", [
  "Agent Incentive",
  "Contractor",
]);
export const modeOfPayments = t.pgEnum("mode_of_payment", [
  "Bank Transfer",
  "Cash Payment",
  "Check Payment",
]);
export const lotTypes = t.pgEnum("lot_type", [
  "Corner",
  "Family Estate",
  "Inner",
  "Pathway",
  "Roadside",
]);
export const invoicePurposes = t.pgEnum("invoice_purpose", [
  "Full Payment",
  "Downpayment",
  "Payment Plan",
  "Interment",
  "Perpetual Care",
  "Reservation",
]);

function timestamps() {
  return {
    createdBy: t.varchar("created_by").notNull(),
    createdOn: t.date("created_on", { mode: "string" }).notNull(),
  };
}

/**
 * Table
 */

export const users = t.pgTable("users", {
  id: t.integer().primaryKey().generatedAlwaysAsIdentity(),
  firstName: t.varchar("first_name").notNull(),
  lastName: t.varchar("last_name").notNull(),
  email: t.varchar("email").notNull(),
  password: t.varchar("password").notNull(),
  role: roles().default("ACCOUNTS_CLERK"),
  hasLoggedInOnce: t.boolean("has_logged_in_once").default(false),
  createdBy: t.varchar("created_by").notNull(),
  createdOn: t.date("created_on", { mode: "string" }).notNull(),
});

export const properties = t.pgTable("properties", {
  id: t.integer().primaryKey().generatedAlwaysAsIdentity(),
  name: t.varchar("name").notNull(),
  fullAddress: t.varchar("full_address").notNull(),
  createdBy: t.varchar("created_by").notNull(),
  createdOn: t.date("created_on", { mode: "string" }).notNull(),
});

export const blocks = t.pgTable("blocks", {
  id: t.integer().primaryKey().generatedAlwaysAsIdentity(),
  propertyId: t.integer("property_id"),
  name: t.varchar("name").notNull(),
  createdBy: t.varchar("created_by").notNull(),
  createdOn: t.date("created_on", { mode: "string" }).notNull(),
});

export const lots = t.pgTable("lots", {
  id: t.integer().primaryKey().generatedAlwaysAsIdentity(),
  blockId: t.integer("block_id"),
  name: t.varchar("name").notNull(),
  lotType: lotTypes("lot_type").notNull(),
  price: t.doublePrecision().notNull(),
  remarks: t.varchar(),
  taken: t.boolean().notNull().default(false),
  createdBy: t.varchar("created_by").notNull(),
  createdOn: t.date("created_on", { mode: "string" }).notNull(),
});

export const clients = t.pgTable("clients", {
  id: t.integer().primaryKey().generatedAlwaysAsIdentity(),
  firstName: t.varchar("first_name").notNull(),
  lastName: t.varchar("last_name").notNull(),
  birthDate: t.date("birth_date", { mode: "string" }).notNull(),
  email: t.varchar("email").notNull(),
  fullAddress: t.varchar("full_address").notNull(),
  mobileNumber: t.varchar("mobile_number").notNull(),
  landlineNumber: t.varchar("landline_number"),
  createdBy: t.varchar("created_by").notNull(),
  createdOn: t.date("created_on", { mode: "string" }).notNull(),
});

export const clientLots = t.pgTable("client_lots", {
  id: t.integer().primaryKey().generatedAlwaysAsIdentity(),
  clientId: t.integer("client_id").notNull(),
  propertyId: t.integer("property_id").notNull(),
  blockId: t.integer("block_id").notNull(),
  lotId: t.integer("lot_id").notNull(),
  reservation: t.integer("reservation"),
  paymentType: t.varchar("payment_type"),
  paymentPlan: t.varchar("payment_plan"),
  inNeed: inNeed("in_need"),
  terms: t.integer("terms"),
  downpayment: t.varchar("downpayment"),
  downpaymentPrice: t.doublePrecision("downpayment_price"),
  perpetualCarePrice: t.doublePrecision("perpetual_care_price"),
  discount: t.doublePrecision("discount"),
  monthsToPay: t.integer("months_to_pay"),
  monthly: t.doublePrecision("monthly"),
  totalInterest: t.doublePrecision("total_interest"),
  actualPrice: t.doublePrecision("actual_price"),
  balance: t.doublePrecision("balance"),
  agent: t.varchar("agent"),
  createdBy: t.varchar("created_by").notNull(),
  createdOn: t.date("created_on", { mode: "string" }).notNull(),
});

export const paymentPlans = t.pgTable("payment_plans", {
  id: t.integer().primaryKey().generatedAlwaysAsIdentity(),
  clientLotId: t
    .integer("client_lot_id")
    .notNull()
    .references(() => clientLots.id, { onDelete: "cascade" }),
  installmentMonths: t.varchar("installment_months"),
  dueDate: t.date("due_date", { mode: "string" }).notNull(),
  discount: t.doublePrecision("discount").notNull().default(0),
  penalty: t.doublePrecision("penalty").notNull().default(0),
  paymentDue: t.doublePrecision("payment_due").notNull(),
});

export const interments = t.pgTable("interments", {
  id: t.integer().primaryKey().generatedAlwaysAsIdentity(),
  clientLotId: t
    .integer("client_lot_id")
    .notNull()
    .references(() => clientLots.id, { onDelete: "cascade" }),
  dig: t.integer("dig"),
  type: intermentTypes(),
  deceasedName: t.varchar("deceased_name"),
  deceasedBorn: t.date("deceased_born", { mode: "string" }),
  deceasedDied: t.date("deceased_died", { mode: "string" }),
  remainsName: t.varchar("remains_name"),
  remainsBorn: t.date("remains_born", { mode: "string" }),
  remainsDied: t.date("remains_died", { mode: "string" }),
  intermentDate: t.date("interment_date", { mode: "string" }),
  intermentTime: t.varchar("interment_time"),
  contractorName: t.varchar("contractor_name"),
  contractorMobileNumber: t.varchar("contractor_mobile_number"),
  lastModifiedBy: t.varchar("created_by"),
  lastModifiedAt: t.date("created_on", { mode: "string" }).notNull(),
});

export const perpetualCares = t.pgTable("perpetual_cares", {
  id: t.integer().primaryKey().generatedAlwaysAsIdentity(),
  clientLotId: t
    .integer("client_lot_id")
    .notNull()
    .references(() => clientLots.id, { onDelete: "cascade" }),
  installmentYears: t.varchar("installment_years"),
  dueDate: t.date("due_date", { mode: "string" }).notNull(),
  paymentDue: t.doublePrecision("payment_due").notNull(),
});

export const invoices = t.pgTable("invoices", {
  id: t.integer().primaryKey().generatedAlwaysAsIdentity(),
  clientLotId: t
    .integer("client_lot_id")
    .notNull()
    .references(() => clientLots.id, { onDelete: "cascade" }),
  purpose: invoicePurposes().notNull(),
  payment: t.doublePrecision().notNull(),
  modeOfPayment: modeOfPayments("mode_of_payment")
    .notNull()
    .default("Cash Payment"),
  dateOfPayment: t.date("date_of_payment", { mode: "string" }).notNull(),
  receipt: t.varchar("receipt").notNull(),
  remarks: t.varchar("remarks"),
  createdBy: t.varchar("created_by").notNull(),
  createdOn: t.date("created_on", { mode: "string" }).notNull(),
});

export const expenses = t.pgTable("expenses", {
  id: t.integer().primaryKey().generatedAlwaysAsIdentity(),
  clientLotId: t
    .integer("client_lot_id")
    .notNull()
    .references(() => clientLots.id, { onDelete: "cascade" }),
  purpose: expensesPurposes().notNull(),
  payment: t.doublePrecision().notNull(),
  modeOfPayment: modeOfPayments("mode_of_payment")
    .notNull()
    .default("Cash Payment"),
  dateOfPayment: t.date("date_of_payment", { mode: "string" }).notNull(),
  receipt: t.varchar("receipt").notNull(),
  remarks: t.varchar("remarks"),
  createdBy: t.varchar("created_by").notNull(),
  createdOn: t.date("created_on", { mode: "string" }).notNull(),
});

/**
 * Table Relations
 */

export const propertyRelations = relations(properties, ({ many }) => ({
  blocks: many(blocks),
}));

export const blockRelations = relations(blocks, ({ one, many }) => ({
  property: one(properties, {
    fields: [blocks.propertyId],
    references: [properties.id],
  }),
  lots: many(lots),
}));

export const lotRelations = relations(lots, ({ one, many }) => ({
  block: one(blocks, {
    fields: [lots.blockId],
    references: [blocks.id],
  }),
}));

export const clientRelations = relations(clients, ({ many }) => ({
  clientLots: many(clientLots),
}));

export const clientLotsRelations = relations(clientLots, ({ one, many }) => ({
  property: one(properties, {
    fields: [clientLots.propertyId],
    references: [properties.id],
  }),
  block: one(blocks, {
    fields: [clientLots.blockId],
    references: [blocks.id],
  }),
  lot: one(lots, {
    fields: [clientLots.lotId],
    references: [lots.id],
  }),
  client: one(clients, {
    fields: [clientLots.clientId],
    references: [clients.id],
  }),
  invoices: many(invoices),
  interments: many(interments),
  perpetualCare: many(perpetualCares),
  expenses: many(expenses),
}));

export const invoicesRelations = relations(invoices, ({ one }) => ({
  clientLot: one(clientLots, {
    fields: [invoices.clientLotId],
    references: [clientLots.id],
  }),
}));

export const intermentsRelations = relations(interments, ({ one }) => ({
  clientLot: one(clientLots, {
    fields: [interments.clientLotId],
    references: [clientLots.id],
  }),
}));

export const perpetualCaresRelations = relations(perpetualCares, ({ one }) => ({
  clientLot: one(clientLots, {
    fields: [perpetualCares.clientLotId],
    references: [clientLots.id],
  }),
}));

export const expensesRelations = relations(expenses, ({ one }) => ({
  clientLot: one(clientLots, {
    fields: [expenses.clientLotId],
    references: [clientLots.id],
  }),
}));

/**
 * Table Schemas
 */

export const selectUsersSchema = createSelectSchema(users).omit({
  password: true,
});

export const insertUserSchema = createInsertSchema(users, {
  firstName: () => z.string().min(1),
  lastName: () => z.string().min(1),
  role: () => z.enum(["ADMIN", "ACCOUNTS_CLERK"]),
  email: () => z.string().email(),
  password: (schema) =>
    schema.regex(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/, {
      message:
        "Minimum 8 characters, at least 1 letter, at least 1 number, and at least 1 special character",
    }),
})
  .required({
    firstName: true,
    lastName: true,
    role: true,
    email: true,
    password: true,
  })
  .omit({ hasLoggedInOnce: true });

export const updateUserSchema = insertUserSchema
  .partial()
  .omit({ createdBy: true, createdOn: true });

export const loginSchema = insertUserSchema
  .extend({ password: z.string() })
  .omit({
    firstName: true,
    lastName: true,
    role: true,
    createdBy: true,
    createdOn: true,
  });

export const selectPropertyListSchema = createSelectSchema(properties);

export const selectPropertySchema = selectPropertyListSchema.extend({
  numberOfBlocks: z.number(),
  numberOfLots: z.number(),
  takenLots: z.number(),
  availableLots: z.number(),
});

export const selectPropertiesSchema = z.object({
  properties: z.array(selectPropertySchema),
  totalAvailableLots: z.number(),
  totalTakenLots: z.number(),
});

export const insertPropertySchema = createInsertSchema(properties, {
  name: z.string().min(1),
  fullAddress: z.string().min(1),
}).required({ name: true, fullAddress: true });

export const updatePropertySchema = insertPropertySchema.partial().omit({
  createdBy: true,
  createdOn: true,
});

export const selectBlocksSchema = createSelectSchema(blocks);

export const insertBlockSchema = createInsertSchema(blocks, {
  propertyId: z.number(),
  name: z.string().min(1),
}).required({ propertyId: true, name: true });

export const updateBlockSchema = insertBlockSchema.partial().omit({
  propertyId: true,
  createdBy: true,
  createdOn: true,
});

export const selectLotsSchema = createSelectSchema(lots).extend({
  price: z.number(),
});

export const insertLotSchema = createInsertSchema(lots, {
  blockId: z.number(),
  name: z.string().min(1),
  price: z.number().min(0.01).multipleOf(0.01),
  remarks: z.string().optional(),
}).required({ blockId: true, name: true, price: true });

export const updateLotSchema = insertLotSchema.partial().omit({
  blockId: true,
  createdBy: true,
  createdOn: true,
});

export const selectClientsSchema = createSelectSchema(clients);

export const insertClientSchema = createInsertSchema(clients, {
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  birthDate: z.string(),
  email: z.string().min(1).email(),
  fullAddress: z.string().min(1),
  mobileNumber: z.string().min(1),
  landlineNumber: z.string().optional(),
}).required({
  firstName: true,
  lastName: true,
  birthDate: true,
  email: true,
  fullAddress: true,
  mobileNumber: true,
});

export const updateClientSchema = insertClientSchema.partial().omit({
  createdBy: true,
  createdOn: true,
});

export const selectClientLotsSchema = createSelectSchema(clientLots);

const baseInsertClientLotSchema = createInsertSchema(clientLots)
  .required({
    clientId: true,
    propertyId: true,
    blockId: true,
    lotId: true,
    paymentType: true,
    paymentPlan: true,
    terms: true,
    downpayment: true,
    downpaymentPrice: true,
    actualPrice: true,
  })
  .omit({
    inNeed: true,
  });

const reservationSchema = z.object({
  paymentType: z.literal("Reservation"),
  reservation: z.number(),
  discount: z
    .number({ message: "Please enter an amount" })
    .min(0)
    .multipleOf(0.01)
    .optional()
    .or(z.literal(0))
    .optional(),
  actualPrice: z.number().multipleOf(0.01).optional(),
});

const monthlyTermsSchema = z.object({
  paymentType: z.literal("Monthly Terms"),
  paymentPlan: z.enum([
    "Downpayment and Installment (with interest)",
    "Downpayment and Installment (without interest)",
    "Installment only (with interest)",
  ]),
  monthly: z.number().multipleOf(0.01).default(0),
});

const downpaymentAndInstallmentWithInterestSchema = z.object({
  paymentPlan: z.literal("Downpayment and Installment (with interest)"),
  downpayment: z.string(),
  downpaymentPrice: z.number().multipleOf(0.01).min(1),
  terms: z.number(),
  totalInterest: z.number().multipleOf(0.01),
  monthly: z.number().multipleOf(0.01),
});

const downpaymentAndInstallmentWithoutInterestSchema = z.object({
  paymentPlan: z.literal("Downpayment and Installment (without interest)"),
  downpayment: z.string(),
  downpaymentPrice: z.number().multipleOf(0.01).min(1),
  terms: z.number(),
});

const installmentOnlySchema = z.object({
  paymentPlan: z.literal("Installment only (with interest)"),
  downpayment: z.string().optional(),
  downpaymentPrice: z.number().multipleOf(0.01).optional(),
  terms: z.number(),
});

const monthlyTermsFormSchema = z
  .discriminatedUnion("paymentPlan", [
    downpaymentAndInstallmentWithInterestSchema,
    downpaymentAndInstallmentWithoutInterestSchema,
    installmentOnlySchema,
  ])
  .and(baseInsertClientLotSchema);

const fullPaymentSchema = z.object({
  paymentType: z.literal("Full Payment"),
  inNeed: z.enum(["Yes", "No"]),
});

const paymentTypeFormSchema = z
  .discriminatedUnion("paymentType", [
    reservationSchema,
    monthlyTermsSchema,
    fullPaymentSchema,
  ])
  .and(baseInsertClientLotSchema);

export const insertClientLotSchema = z.union([
  paymentTypeFormSchema,
  monthlyTermsFormSchema,
]);

export const selectInvoicesSchema = createSelectSchema(invoices);

export const insertInvoiceSchema = createInsertSchema(invoices, {
  clientLotId: z.number(),
  purpose: z.enum([
    "Full Payment",
    "Downpayment",
    "Payment Plan",
    "Interment",
    "Perpetual Care",
    "Reservation",
  ]),
  payment: z.number().multipleOf(0.01),
  modeOfPayment: z.enum(["Bank Transfer", "Cash Payment", "Check Payment"]),
  dateOfPayment: z.string(),
  receipt: z.string(),
  remarks: z.string().optional(),
}).required({
  clientLotId: true,
  purpose: true,
  payment: true,
  modeOfPayment: true,
  dateOfPayment: true,
  receipt: true,
});

export const selectPaymentPlansSchema = createSelectSchema(paymentPlans);

export const insertPaymentPlansSchema = createInsertSchema(paymentPlans, {
  installmentMonths: z.number(),
  paymentDue: z.number(),
})
  .extend({
    dateOfPayment: z.string(),
    withDiscountedLastTerm: z.boolean(),
    installmentOnly: z.boolean(),
  })
  .required({
    installmentMonths: true,
    paymentDue: true,
    dateOfPayment: true,
    withDiscountedLastTerm: true,
  })
  .omit({
    clientLotId: true,
    dueDate: true,
    discount: true,
    penalty: true,
  });

export const updatePaymentPlanSchema = createInsertSchema(paymentPlans, {
  discount: z.number().multipleOf(0.01).default(0),
  penalty: z.number().multipleOf(0.01).default(0),
}).omit({
  clientLotId: true,
  installmentMonths: true,
  dueDate: true,
  paymentDue: true,
});

export const selectExpensesSchema = createSelectSchema(expenses);

export const insertExpensesSchema = createInsertSchema(expenses, {
  clientLotId: z.number(),
  purpose: z.enum(["Agent Incentive", "Contractor"]),
  payment: z.number().multipleOf(0.01),
  modeOfPayment: z.enum(["Bank Transfer", "Cash Payment", "Check Payment"]),
  dateOfPayment: z.string(),
  receipt: z.string(),
  remarks: z.string().optional(),
}).required({
  clientLotId: true,
  purpose: true,
  payment: true,
  modeOfPayment: true,
  dateOfPayment: true,
  receipt: true,
});

export const selectIntermentsSchema = createSelectSchema(interments);

export const updateIntermentSchema = createInsertSchema(interments, {
  type: z.enum(["Flesh", "Bone"]).optional(),
  deceasedName: z.string().optional(),
  deceasedBorn: z.string().optional(),
  deceasedDied: z.string().optional(),
  remainsName: z.string().optional(),
  remainsBorn: z.string().optional(),
  remainsDied: z.string().optional(),
  intermentDate: z.string().optional(),
  intermentTime: z.string().optional(),
  contractorName: z.string().optional(),
  contractorMobileNumber: z.string().optional(),
  lastModifiedBy: z.string().optional(),
})
  .partial()
  .omit({
    clientLotId: true,
    dig: true,
    lastModifiedAt: true,
  });

// function timestamps() {
//   return {
//     createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(
//       () => new Date()
//     ),
//     updatedAt: integer("updated_at", { mode: "timestamp" })
//       .$defaultFn(() => new Date())
//       .$onUpdate(() => new Date()),
//   };
// }

// const id = text("id")
//   .primaryKey()
//   .$default(() => crypto.randomUUID());

// export const users = sqliteTable(
//   "users",
//   {
//     id,
//     email: text("email").notNull(),
//     password: text("password").notNull(),
//     ...timestamps(),
//   },
//   (table) => [uniqueIndex("emailUniqueIndex").on(sql`lower(${table.email})`)]
// );

// export const tasks = sqliteTable("tasks", {
//   id,
//   name: text("name").notNull(),
//   done: integer("done", { mode: "boolean" }).notNull().default(false),
//   ...timestamps(),
// });

// export const selectUserSchema = createSelectSchema(users).omit({
//   password: true,
// });
// export const insertUserSchema = createInsertSchema(users, {
//   email: (schema) => schema.min(1).email(),
//   password: (schema) =>
//     schema.regex(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/, {
//       message:
//         "Minimum 8 characters, at least 1 letter, at least 1 number, and at least 1 special character",
//     }),
// })
//   .required({ email: true, password: true })
//   .omit({ id: true, createdAt: true, updatedAt: true });

// export const loginSchema = insertUserSchema.extend({ password: z.string() });

// export const selectTasksSchema = createSelectSchema(tasks);
// export const insertTasksSchema = createInsertSchema(tasks, {
//   name: (schema) => schema.min(1).max(50),
// })
//   .required({ name: true, done: true })
//   .omit({
//     id: true,
//     createdAt: true,
//     updatedAt: true,
//   });

// export const updateTaskSchema = insertTasksSchema.partial();
