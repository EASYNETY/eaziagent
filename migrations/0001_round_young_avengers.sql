CREATE TABLE "call_templates" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"department_id" uuid,
	"name" text NOT NULL,
	"description" text,
	"template_type" text NOT NULL,
	"content" text NOT NULL,
	"variables" json,
	"is_active" boolean DEFAULT true,
	"created_by" integer NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "departments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"phone_numbers" json,
	"sip_extensions" json,
	"routing_logic" jsonb,
	"escalation_paths" jsonb,
	"business_hours" jsonb,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "system_health" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"component" text NOT NULL,
	"status" text NOT NULL,
	"response_time" integer,
	"error_rate" numeric(5, 2),
	"active_connections" integer,
	"details" jsonb,
	"alert_sent" boolean DEFAULT false,
	"checked_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "telephony_providers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid,
	"provider_name" text NOT NULL,
	"is_active" boolean DEFAULT true,
	"configuration" jsonb,
	"credentials" jsonb,
	"phone_numbers" json,
	"features" json,
	"health_status" text DEFAULT 'healthy',
	"last_health_check" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "usage_metrics" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"metric_type" text NOT NULL,
	"value" numeric(12, 4) NOT NULL,
	"unit" text NOT NULL,
	"cost" numeric(8, 4),
	"billing_period" text NOT NULL,
	"recorded_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "call_logs" ALTER COLUMN "ai_confidence" SET DATA TYPE numeric(3, 2);--> statement-breakpoint
ALTER TABLE "agents" ADD COLUMN "department_id" uuid;--> statement-breakpoint
ALTER TABLE "agents" ADD COLUMN "personality" jsonb;--> statement-breakpoint
ALTER TABLE "agents" ADD COLUMN "languages" json;--> statement-breakpoint
ALTER TABLE "agents" ADD COLUMN "voice_settings" jsonb;--> statement-breakpoint
ALTER TABLE "agents" ADD COLUMN "fallback_behavior" jsonb;--> statement-breakpoint
ALTER TABLE "agents" ADD COLUMN "successful_calls" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "agents" ADD COLUMN "escalated_calls" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "agents" ADD COLUMN "avg_call_duration" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "call_logs" ADD COLUMN "department_id" uuid;--> statement-breakpoint
ALTER TABLE "call_logs" ADD COLUMN "conversation_id" uuid;--> statement-breakpoint
ALTER TABLE "call_logs" ADD COLUMN "caller_name" text;--> statement-breakpoint
ALTER TABLE "call_logs" ADD COLUMN "call_direction" text DEFAULT 'inbound';--> statement-breakpoint
ALTER TABLE "call_logs" ADD COLUMN "wait_time" integer;--> statement-breakpoint
ALTER TABLE "call_logs" ADD COLUMN "escalation_reason" text;--> statement-breakpoint
ALTER TABLE "call_logs" ADD COLUMN "telephony_provider" text;--> statement-breakpoint
ALTER TABLE "call_logs" ADD COLUMN "cost" numeric(8, 4);--> statement-breakpoint
ALTER TABLE "call_logs" ADD COLUMN "metadata" jsonb;--> statement-breakpoint
ALTER TABLE "conversations" ADD COLUMN "customer_phone" text;--> statement-breakpoint
ALTER TABLE "conversations" ADD COLUMN "customer_name" text;--> statement-breakpoint
ALTER TABLE "conversations" ADD COLUMN "channel" text DEFAULT 'voice';--> statement-breakpoint
ALTER TABLE "conversations" ADD COLUMN "status" text DEFAULT 'active';--> statement-breakpoint
ALTER TABLE "conversations" ADD COLUMN "sentiment" text;--> statement-breakpoint
ALTER TABLE "conversations" ADD COLUMN "intent" text;--> statement-breakpoint
ALTER TABLE "conversations" ADD COLUMN "outcome" text;--> statement-breakpoint
ALTER TABLE "conversations" ADD COLUMN "satisfaction_score" integer;--> statement-breakpoint
ALTER TABLE "conversations" ADD COLUMN "escalated_to_human" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "conversations" ADD COLUMN "human_agent_id" integer;--> statement-breakpoint
ALTER TABLE "conversations" ADD COLUMN "tags" json;--> statement-breakpoint
ALTER TABLE "conversations" ADD COLUMN "summary" text;--> statement-breakpoint
ALTER TABLE "call_templates" ADD CONSTRAINT "call_templates_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "call_templates" ADD CONSTRAINT "call_templates_department_id_departments_id_fk" FOREIGN KEY ("department_id") REFERENCES "public"."departments"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "call_templates" ADD CONSTRAINT "call_templates_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "departments" ADD CONSTRAINT "departments_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "telephony_providers" ADD CONSTRAINT "telephony_providers_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "usage_metrics" ADD CONSTRAINT "usage_metrics_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "agents" ADD CONSTRAINT "agents_department_id_departments_id_fk" FOREIGN KEY ("department_id") REFERENCES "public"."departments"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "call_logs" ADD CONSTRAINT "call_logs_department_id_departments_id_fk" FOREIGN KEY ("department_id") REFERENCES "public"."departments"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "call_logs" ADD CONSTRAINT "call_logs_conversation_id_conversations_id_fk" FOREIGN KEY ("conversation_id") REFERENCES "public"."conversations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "conversations" ADD CONSTRAINT "conversations_human_agent_id_users_id_fk" FOREIGN KEY ("human_agent_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;