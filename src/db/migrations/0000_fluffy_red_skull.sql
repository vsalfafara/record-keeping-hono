CREATE TABLE `tasks` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`done` integer DEFAULT false NOT NULL,
	`created_at` integer,
	`updated_at` integer
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`password` text NOT NULL,
	`created_at` integer,
	`updated_at` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `emailUniqueIndex` ON `users` (lower("email"));