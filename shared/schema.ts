import { pgTable, text, serial, integer, boolean, timestamp, uuid, jsonb, decimal, date, json } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  businessName: text("business_name").notNull(),
  email: text("email").notNull().unique(),
  role: text("role").notNull().default("user"), // user, admin, super_admin
  isActive: boolean("is_active").default(true),
  lastLoginAt: timestamp("last_login_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const systemSettings = pgTable("system_settings", {
  id: uuid("id").primaryKey().defaultRandom(),
  key: text("key").notNull().unique(),
  value: text("value"),
  description: text("description"),
  category: text("category").notNull(), // api_keys, integrations, general
  isEncrypted: boolean("is_encrypted").default(false),
  updatedBy: integer("updated_by").references(() => users.id),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const organizations = pgTable("organizations", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  domain: text("domain"),
  plan: text("plan").notNull().default("free"), // free, pro, enterprise
  maxAgents: integer("max_agents").default(3),
  maxCallsPerMonth: integer("max_calls_per_month").default(100),
  isActive: boolean("is_active").default(true),
  ownerId: integer("owner_id").notNull().references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const organizationMembers = pgTable("organization_members", {
  id: uuid("id").primaryKey().defaultRandom(),
  organizationId: uuid("organization_id").notNull().references(() => organizations.id),
  userId: integer("user_id").notNull().references(() => users.id),
  role: text("role").notNull().default("member"), // member, admin
  joinedAt: timestamp("joined_at").defaultNow(),
});

// Departments for organizing agents and call routing
export const departments = pgTable("departments", {
  id: uuid("id").primaryKey().defaultRandom(),
  organizationId: uuid("organization_id").notNull().references(() => organizations.id),
  name: text("name").notNull(), // Sales, Support, Billing, etc.
  description: text("description"),
  phoneNumbers: json("phone_numbers"), // Array of assigned phone numbers
  sipExtensions: json("sip_extensions"), // Array of SIP extensions
  routingLogic: jsonb("routing_logic"), // Call routing configuration
  escalationPaths: jsonb("escalation_paths"), // Escalation rules
  businessHours: jsonb("business_hours"), // Operating hours
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const agents = pgTable("agents", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: integer("user_id").notNull().references(() => users.id),
  organizationId: uuid("organization_id").references(() => organizations.id),
  departmentId: uuid("department_id").references(() => departments.id),
  name: text("name").notNull(),
  description: text("description"),
  businessName: text("business_name").notNull(),
  tone: text("tone").notNull().default("professional"),
  personality: jsonb("personality"), // AI personality settings
  languages: json("languages"), // Supported languages
  voiceSettings: jsonb("voice_settings"), // Voice characteristics
  isActive: boolean("is_active").default(true),
  systemPrompt: text("system_prompt"),
  fallbackBehavior: jsonb("fallback_behavior"), // What to do when uncertain
  callsThisMonth: integer("calls_this_month").default(0),
  successfulCalls: integer("successful_calls").default(0),
  escalatedCalls: integer("escalated_calls").default(0),
  avgCallDuration: integer("avg_call_duration").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const knowledgeBase = pgTable("knowledge_base", {
  id: uuid("id").primaryKey().defaultRandom(),
  agentId: uuid("agent_id").notNull().references(() => agents.id),
  fileName: text("file_name").notNull(),
  content: text("content").notNull(),
  metadata: jsonb("metadata"),
  uploadedAt: timestamp("uploaded_at").defaultNow(),
});

export const conversations = pgTable("conversations", {
  id: uuid("id").primaryKey().defaultRandom(),
  agentId: uuid("agent_id").notNull().references(() => agents.id),
  sessionId: text("session_id").notNull(),
  customerPhone: text("customer_phone"),
  customerName: text("customer_name"),
  channel: text("channel").default("voice"), // voice, chat, widget
  messages: jsonb("messages").notNull(),
  status: text("status").default("active"), // active, completed, escalated, abandoned
  sentiment: text("sentiment"), // positive, neutral, negative
  intent: text("intent"), // detected customer intent
  outcome: text("outcome"), // resolved, escalated, pending
  satisfactionScore: integer("satisfaction_score"),
  isResolved: boolean("is_resolved").default(false),
  escalatedToHuman: boolean("escalated_to_human").default(false),
  humanAgentId: integer("human_agent_id").references(() => users.id),
  tags: json("tags"), // Array of tags for categorization
  summary: text("summary"), // AI-generated call summary
  startedAt: timestamp("started_at").defaultNow(),
  endedAt: timestamp("ended_at"),
});

export const analytics = pgTable("analytics", {
  id: uuid("id").primaryKey().defaultRandom(),
  agentId: uuid("agent_id").notNull().references(() => agents.id),
  date: timestamp("date").defaultNow(),
  totalConversations: integer("total_conversations").default(0),
  resolvedConversations: integer("resolved_conversations").default(0),
  avgResponseTime: integer("avg_response_time").default(0), // in milliseconds
  metadata: jsonb("metadata"),
});

export const billing = pgTable("billing", {
  id: uuid("id").primaryKey().defaultRandom(),
  organizationId: uuid("organization_id").notNull().references(() => organizations.id),
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
  plan: text("plan").notNull(),
  monthlyCost: text("monthly_cost"),
  nextBillingDate: text("next_billing_date"),
  usageOverage: text("usage_overage").default("0"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const auditLogs = pgTable("audit_logs", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: integer("user_id").references(() => users.id),
  organizationId: uuid("organization_id").references(() => organizations.id),
  action: text("action").notNull(),
  resourceType: text("resource_type").notNull(),
  resourceId: text("resource_id"),
  details: jsonb("details"),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const supportTickets = pgTable("support_tickets", {
  id: uuid("id").primaryKey().defaultRandom(),
  organizationId: uuid("organization_id").references(() => organizations.id),
  userId: integer("user_id").references(() => users.id),
  title: text("title").notNull(),
  description: text("description"),
  status: text("status").default("open"),
  priority: text("priority").default("medium"),
  assignedTo: integer("assigned_to").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const callLogs = pgTable("call_logs", {
  id: uuid("id").primaryKey().defaultRandom(),
  organizationId: uuid("organization_id").references(() => organizations.id),
  departmentId: uuid("department_id").references(() => departments.id),
  agentId: uuid("agent_id").references(() => agents.id),
  conversationId: uuid("conversation_id").references(() => conversations.id),
  sessionId: text("session_id").notNull(),
  phoneNumber: text("phone_number"),
  callerName: text("caller_name"),
  callDirection: text("call_direction").default("inbound"), // inbound, outbound
  duration: integer("duration"), // in seconds
  waitTime: integer("wait_time"), // time before agent pickup
  status: text("status"), // answered, missed, busy, failed
  recordingUrl: text("recording_url"),
  transcript: text("transcript"),
  aiConfidence: decimal("ai_confidence", { precision: 3, scale: 2 }),
  escalated: boolean("escalated").default(false),
  escalationReason: text("escalation_reason"),
  telephonyProvider: text("telephony_provider"), // twilio, asterisk, etc.
  cost: decimal("cost", { precision: 8, scale: 4 }), // call cost
  metadata: jsonb("metadata"), // Additional call data
  createdAt: timestamp("created_at").defaultNow(),
});

// Call templates and scripts for agents
export const callTemplates = pgTable("call_templates", {
  id: uuid("id").primaryKey().defaultRandom(),
  organizationId: uuid("organization_id").notNull().references(() => organizations.id),
  departmentId: uuid("department_id").references(() => departments.id),
  name: text("name").notNull(),
  description: text("description"),
  templateType: text("template_type").notNull(), // greeting, script, faq, escalation
  content: text("content").notNull(),
  variables: json("variables"), // Template variables like {customer_name}
  isActive: boolean("is_active").default(true),
  createdBy: integer("created_by").notNull().references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Telephony infrastructure settings
export const telephonyProviders = pgTable("telephony_providers", {
  id: uuid("id").primaryKey().defaultRandom(),
  organizationId: uuid("organization_id").references(() => organizations.id),
  providerName: text("provider_name").notNull(), // twilio, asterisk, agora
  isActive: boolean("is_active").default(true),
  configuration: jsonb("configuration"), // Provider-specific config
  credentials: jsonb("credentials"), // Encrypted API keys, tokens
  phoneNumbers: json("phone_numbers"), // Assigned phone numbers
  features: json("features"), // Available features for this provider
  healthStatus: text("health_status").default("healthy"), // healthy, degraded, down
  lastHealthCheck: timestamp("last_health_check"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Real-time system monitoring
export const systemHealth = pgTable("system_health", {
  id: uuid("id").primaryKey().defaultRandom(),
  component: text("component").notNull(), // telephony, llm, database, etc.
  status: text("status").notNull(), // healthy, degraded, down
  responseTime: integer("response_time"), // in milliseconds
  errorRate: decimal("error_rate", { precision: 5, scale: 2 }), // percentage
  activeConnections: integer("active_connections"),
  details: jsonb("details"), // Additional metrics
  alertSent: boolean("alert_sent").default(false),
  checkedAt: timestamp("checked_at").defaultNow(),
});

// Usage tracking for billing and analytics
export const usageMetrics = pgTable("usage_metrics", {
  id: uuid("id").primaryKey().defaultRandom(),
  organizationId: uuid("organization_id").notNull().references(() => organizations.id),
  metricType: text("metric_type").notNull(), // llm_tokens, call_minutes, storage_mb
  value: decimal("value", { precision: 12, scale: 4 }).notNull(),
  unit: text("unit").notNull(), // tokens, minutes, mb
  cost: decimal("cost", { precision: 8, scale: 4 }), // Associated cost
  billingPeriod: text("billing_period").notNull(), // YYYY-MM format
  recordedAt: timestamp("recorded_at").defaultNow(),
});

export const integrations = pgTable("integrations", {
  id: uuid("id").primaryKey().defaultRandom(),
  organizationId: uuid("organization_id").references(() => organizations.id),
  type: text("type").notNull(),
  name: text("name").notNull(),
  config: jsonb("config"),
  apiKeyEncrypted: text("api_key_encrypted"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many, one }) => ({
  agents: many(agents),
  ownedOrganizations: many(organizations, { relationName: "organizationOwner" }),
  organizationMemberships: many(organizationMembers),
  systemSettingsUpdates: many(systemSettings),
}));

export const organizationsRelations = relations(organizations, ({ one, many }) => ({
  owner: one(users, {
    fields: [organizations.ownerId],
    references: [users.id],
    relationName: "organizationOwner",
  }),
  members: many(organizationMembers),
  agents: many(agents),
}));

export const organizationMembersRelations = relations(organizationMembers, ({ one }) => ({
  organization: one(organizations, {
    fields: [organizationMembers.organizationId],
    references: [organizations.id],
  }),
  user: one(users, {
    fields: [organizationMembers.userId],
    references: [users.id],
  }),
}));

export const systemSettingsRelations = relations(systemSettings, ({ one }) => ({
  updatedByUser: one(users, {
    fields: [systemSettings.updatedBy],
    references: [users.id],
  }),
}));

export const departmentsRelations = relations(departments, ({ one, many }) => ({
  organization: one(organizations, {
    fields: [departments.organizationId],
    references: [organizations.id],
  }),
  agents: many(agents),
  callTemplates: many(callTemplates),
  callLogs: many(callLogs),
}));

export const agentsRelations = relations(agents, ({ one, many }) => ({
  user: one(users, {
    fields: [agents.userId],
    references: [users.id],
  }),
  organization: one(organizations, {
    fields: [agents.organizationId],
    references: [organizations.id],
  }),
  department: one(departments, {
    fields: [agents.departmentId],
    references: [departments.id],
  }),
  knowledgeBase: many(knowledgeBase),
  conversations: many(conversations),
  analytics: many(analytics),
  callLogs: many(callLogs),
}));

export const knowledgeBaseRelations = relations(knowledgeBase, ({ one }) => ({
  agent: one(agents, {
    fields: [knowledgeBase.agentId],
    references: [agents.id],
  }),
}));

export const conversationsRelations = relations(conversations, ({ one }) => ({
  agent: one(agents, {
    fields: [conversations.agentId],
    references: [agents.id],
  }),
}));

export const analyticsRelations = relations(analytics, ({ one }) => ({
  agent: one(agents, {
    fields: [analytics.agentId],
    references: [agents.id],
  }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  businessName: true,
  email: true,
});

export const insertAgentSchema = createInsertSchema(agents).omit({
  id: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
});

export const insertKnowledgeBaseSchema = createInsertSchema(knowledgeBase).omit({
  id: true,
  uploadedAt: true,
});

export const insertConversationSchema = createInsertSchema(conversations).omit({
  id: true,
  startedAt: true,
  endedAt: true,
});

export const insertAnalyticsSchema = createInsertSchema(analytics).omit({
  id: true,
  date: true,
});

export const insertOrganizationSchema = createInsertSchema(organizations).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertSystemSettingSchema = createInsertSchema(systemSettings).omit({
  id: true,
  updatedAt: true,
});

export const insertOrganizationMemberSchema = createInsertSchema(organizationMembers).omit({
  id: true,
  joinedAt: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertAgent = z.infer<typeof insertAgentSchema>;
export type Agent = typeof agents.$inferSelect;
export type InsertKnowledgeBase = z.infer<typeof insertKnowledgeBaseSchema>;
export type KnowledgeBase = typeof knowledgeBase.$inferSelect;
export type InsertConversation = z.infer<typeof insertConversationSchema>;
export type Conversation = typeof conversations.$inferSelect;
export type InsertAnalytics = z.infer<typeof insertAnalyticsSchema>;
export type Analytics = typeof analytics.$inferSelect;
export type InsertOrganization = z.infer<typeof insertOrganizationSchema>;
export type Organization = typeof organizations.$inferSelect;
export type InsertSystemSetting = z.infer<typeof insertSystemSettingSchema>;
export type SystemSetting = typeof systemSettings.$inferSelect;
export type InsertOrganizationMember = z.infer<typeof insertOrganizationMemberSchema>;
export type OrganizationMember = typeof organizationMembers.$inferSelect;

export const insertBillingSchema = createInsertSchema(billing).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertAuditLogSchema = createInsertSchema(auditLogs).omit({
  id: true,
  createdAt: true,
});

export const insertSupportTicketSchema = createInsertSchema(supportTickets).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertCallLogSchema = createInsertSchema(callLogs).omit({
  id: true,
  createdAt: true,
});

export const insertIntegrationSchema = createInsertSchema(integrations).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// New table schemas
export const insertDepartmentSchema = createInsertSchema(departments).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertCallTemplateSchema = createInsertSchema(callTemplates).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertTelephonyProviderSchema = createInsertSchema(telephonyProviders).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertSystemHealthSchema = createInsertSchema(systemHealth).omit({
  id: true,
  checkedAt: true,
});

export const insertUsageMetricSchema = createInsertSchema(usageMetrics).omit({
  id: true,
  recordedAt: true,
});

// All types
export type InsertDepartment = z.infer<typeof insertDepartmentSchema>;
export type Department = typeof departments.$inferSelect;
export type InsertCallTemplate = z.infer<typeof insertCallTemplateSchema>;
export type CallTemplate = typeof callTemplates.$inferSelect;
export type InsertTelephonyProvider = z.infer<typeof insertTelephonyProviderSchema>;
export type TelephonyProvider = typeof telephonyProviders.$inferSelect;
export type InsertSystemHealth = z.infer<typeof insertSystemHealthSchema>;
export type SystemHealth = typeof systemHealth.$inferSelect;
export type InsertUsageMetric = z.infer<typeof insertUsageMetricSchema>;
export type UsageMetric = typeof usageMetrics.$inferSelect;

export type InsertBilling = z.infer<typeof insertBillingSchema>;
export type Billing = typeof billing.$inferSelect;
export type InsertAuditLog = z.infer<typeof insertAuditLogSchema>;
export type AuditLog = typeof auditLogs.$inferSelect;
export type InsertSupportTicket = z.infer<typeof insertSupportTicketSchema>;
export type SupportTicket = typeof supportTickets.$inferSelect;
export type InsertCallLog = z.infer<typeof insertCallLogSchema>;
export type CallLog = typeof callLogs.$inferSelect;
export type InsertIntegration = z.infer<typeof insertIntegrationSchema>;
export type Integration = typeof integrations.$inferSelect;
