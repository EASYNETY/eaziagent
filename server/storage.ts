import { 
  users, agents, knowledgeBase, conversations, analytics, organizations, systemSettings,
  departments, callTemplates, telephonyProviders, systemHealth, usageMetrics, callLogs,
  type User, type InsertUser, type Agent, type InsertAgent,
  type KnowledgeBase, type InsertKnowledgeBase,
  type Conversation, type InsertConversation,
  type Analytics, type InsertAnalytics,
  type Organization, type InsertOrganization,
  type SystemSetting, type InsertSystemSetting,
  type Department, type InsertDepartment,
  type CallTemplate, type InsertCallTemplate,
  type TelephonyProvider, type InsertTelephonyProvider,
  type SystemHealth, type InsertSystemHealth,
  type UsageMetric, type InsertUsageMetric,
  type CallLog, type InsertCallLog
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and } from "drizzle-orm";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { pool } from "./db";

const PostgresSessionStore = connectPg(session);

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, updates: Partial<InsertUser>): Promise<User | undefined>;
  getAllUsers(): Promise<User[]>;

  // Organization methods
  getAllOrganizations(): Promise<Organization[]>;
  getOrganizationById(id: string): Promise<Organization | undefined>;
  createOrganization(org: InsertOrganization): Promise<Organization>;
  updateOrganization(id: string, updates: Partial<InsertOrganization>): Promise<Organization | undefined>;
  deleteOrganization(id: string): Promise<boolean>;

  // Agent methods
  getAgentsByUserId(userId: number): Promise<Agent[]>;
  getAgentById(id: string): Promise<Agent | undefined>;
  getAgentByIdAndUserId(id: string, userId: number): Promise<Agent | undefined>;
  getAllAgents(): Promise<Agent[]>;
  createAgent(agent: InsertAgent): Promise<Agent>;
  updateAgent(id: string, updates: Partial<InsertAgent>): Promise<Agent | undefined>;
  deleteAgent(id: string, userId: number): Promise<boolean>;

  // System Settings methods
  getAllSystemSettings(): Promise<SystemSetting[]>;
  getSystemSettingByKey(key: string): Promise<SystemSetting | undefined>;
  upsertSystemSetting(setting: InsertSystemSetting): Promise<SystemSetting>;
  deleteSystemSetting(key: string): Promise<boolean>;

  // Knowledge base methods
  getKnowledgeBaseByAgentId(agentId: string): Promise<KnowledgeBase[]>;
  createKnowledgeBase(kb: InsertKnowledgeBase): Promise<KnowledgeBase>;
  deleteKnowledgeBase(id: string): Promise<boolean>;

  // Conversation methods
  getConversationsByAgentId(agentId: string): Promise<Conversation[]>;
  getConversationById(id: string): Promise<Conversation | undefined>;
  getAllConversations(): Promise<Conversation[]>;
  createConversation(conversation: InsertConversation): Promise<Conversation>;
  updateConversation(id: string, updates: Partial<InsertConversation>): Promise<Conversation | undefined>;

  // Analytics methods
  getAnalyticsByAgentId(agentId: string): Promise<Analytics[]>;
  getAllAnalytics(): Promise<Analytics[]>;
  createAnalytics(analytics: InsertAnalytics): Promise<Analytics>;
  updateAnalytics(id: string, updates: Partial<InsertAnalytics>): Promise<Analytics | undefined>;

  // Department methods
  getDepartmentsByOrganizationId(organizationId: string): Promise<Department[]>;
  getDepartmentById(id: string): Promise<Department | undefined>;
  createDepartment(department: InsertDepartment): Promise<Department>;
  updateDepartment(id: string, updates: Partial<InsertDepartment>): Promise<Department | undefined>;
  deleteDepartment(id: string): Promise<boolean>;

  // Call Template methods
  getCallTemplatesByOrganizationId(organizationId: string): Promise<CallTemplate[]>;
  getCallTemplatesByDepartmentId(departmentId: string): Promise<CallTemplate[]>;
  createCallTemplate(template: InsertCallTemplate): Promise<CallTemplate>;
  updateCallTemplate(id: string, updates: Partial<InsertCallTemplate>): Promise<CallTemplate | undefined>;
  deleteCallTemplate(id: string): Promise<boolean>;

  // Telephony Provider methods
  getTelephonyProvidersByOrganizationId(organizationId: string): Promise<TelephonyProvider[]>;
  getTelephonyProviderById(id: string): Promise<TelephonyProvider | undefined>;
  createTelephonyProvider(provider: InsertTelephonyProvider): Promise<TelephonyProvider>;
  updateTelephonyProvider(id: string, updates: Partial<InsertTelephonyProvider>): Promise<TelephonyProvider | undefined>;
  deleteTelephonyProvider(id: string): Promise<boolean>;

  // System Health methods
  getSystemHealthMetrics(): Promise<SystemHealth[]>;
  createSystemHealthMetric(metric: InsertSystemHealth): Promise<SystemHealth>;
  updateSystemHealthMetric(id: string, updates: Partial<InsertSystemHealth>): Promise<SystemHealth | undefined>;

  // Usage Metrics methods
  getUsageMetricsByOrganizationId(organizationId: string, billingPeriod?: string): Promise<UsageMetric[]>;
  createUsageMetric(metric: InsertUsageMetric): Promise<UsageMetric>;

  // Enhanced Call Logs methods
  getCallLogsByOrganizationId(organizationId: string): Promise<CallLog[]>;
  getCallLogsByAgentId(agentId: string): Promise<CallLog[]>;
  createCallLog(callLog: InsertCallLog): Promise<CallLog>;
  updateCallLog(id: string, updates: Partial<InsertCallLog>): Promise<CallLog | undefined>;

  sessionStore: session.SessionStore;
}

export class DatabaseStorage implements IStorage {
  sessionStore: session.SessionStore;

  constructor() {
    this.sessionStore = new PostgresSessionStore({ 
      pool, 
      createTableIfMissing: true 
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async updateUser(id: number, updates: Partial<InsertUser>): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set(updates)
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users).orderBy(desc(users.createdAt));
  }

  // Organization methods
  async getAllOrganizations(): Promise<Organization[]> {
    return await db.select().from(organizations).orderBy(desc(organizations.createdAt));
  }

  async getOrganizationById(id: string): Promise<Organization | undefined> {
    const [org] = await db.select().from(organizations).where(eq(organizations.id, id));
    return org;
  }

  async createOrganization(org: InsertOrganization): Promise<Organization> {
    const [organization] = await db
      .insert(organizations)
      .values(org)
      .returning();
    return organization;
  }

  async updateOrganization(id: string, updates: Partial<InsertOrganization>): Promise<Organization | undefined> {
    const [org] = await db
      .update(organizations)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(organizations.id, id))
      .returning();
    return org;
  }

  async deleteOrganization(id: string): Promise<boolean> {
    const result = await db.delete(organizations).where(eq(organizations.id, id));
    return (result.rowCount || 0) > 0;
  }

  // System Settings methods
  async getAllSystemSettings(): Promise<SystemSetting[]> {
    return await db.select().from(systemSettings).orderBy(systemSettings.category, systemSettings.key);
  }

  async getSystemSettingByKey(key: string): Promise<SystemSetting | undefined> {
    const [setting] = await db.select().from(systemSettings).where(eq(systemSettings.key, key));
    return setting;
  }

  async upsertSystemSetting(setting: InsertSystemSetting): Promise<SystemSetting> {
    const [result] = await db
      .insert(systemSettings)
      .values({ ...setting, updatedAt: new Date() })
      .onConflictDoUpdate({
        target: systemSettings.key,
        set: { 
          value: setting.value,
          updatedBy: setting.updatedBy,
          updatedAt: new Date()
        }
      })
      .returning();
    return result;
  }

  async deleteSystemSetting(key: string): Promise<boolean> {
    const result = await db.delete(systemSettings).where(eq(systemSettings.key, key));
    return (result.rowCount || 0) > 0;
  }

  async getAllAgents(): Promise<Agent[]> {
    return await db.select().from(agents).orderBy(desc(agents.createdAt));
  }

  async getAllConversations(): Promise<Conversation[]> {
    return await db.select().from(conversations).orderBy(desc(conversations.startedAt));
  }

  async getAllAnalytics(): Promise<Analytics[]> {
    return await db.select().from(analytics).orderBy(desc(analytics.date));
  }

  // Agent methods
  async getAgentsByUserId(userId: number): Promise<Agent[]> {
    return await db.select().from(agents).where(eq(agents.userId, userId)).orderBy(desc(agents.createdAt));
  }

  async getAgentById(id: string): Promise<Agent | undefined> {
    const [agent] = await db.select().from(agents).where(eq(agents.id, id));
    return agent || undefined;
  }

  async getAgentByIdAndUserId(id: string, userId: number): Promise<Agent | undefined> {
    const [agent] = await db.select().from(agents).where(and(eq(agents.id, id), eq(agents.userId, userId)));
    return agent || undefined;
  }

  async createAgent(agent: InsertAgent): Promise<Agent> {
    const [newAgent] = await db
      .insert(agents)
      .values(agent)
      .returning();
    return newAgent;
  }

  async updateAgent(id: string, updates: Partial<InsertAgent>): Promise<Agent | undefined> {
    const [updatedAgent] = await db
      .update(agents)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(agents.id, id))
      .returning();
    return updatedAgent || undefined;
  }

  async deleteAgent(id: string, userId: number): Promise<boolean> {
    const result = await db
      .delete(agents)
      .where(and(eq(agents.id, id), eq(agents.userId, userId)));
    return result.rowCount > 0;
  }

  // Knowledge base methods
  async getKnowledgeBaseByAgentId(agentId: string): Promise<KnowledgeBase[]> {
    return await db.select().from(knowledgeBase).where(eq(knowledgeBase.agentId, agentId));
  }

  async createKnowledgeBase(kb: InsertKnowledgeBase): Promise<KnowledgeBase> {
    const [newKb] = await db
      .insert(knowledgeBase)
      .values(kb)
      .returning();
    return newKb;
  }

  async deleteKnowledgeBase(id: string): Promise<boolean> {
    const result = await db.delete(knowledgeBase).where(eq(knowledgeBase.id, id));
    return result.rowCount > 0;
  }

  // Conversation methods
  async getConversationsByAgentId(agentId: string): Promise<Conversation[]> {
    return await db.select().from(conversations).where(eq(conversations.agentId, agentId)).orderBy(desc(conversations.startedAt));
  }

  async getConversationById(id: string): Promise<Conversation | undefined> {
    const [conversation] = await db.select().from(conversations).where(eq(conversations.id, id));
    return conversation || undefined;
  }

  async createConversation(conversation: InsertConversation): Promise<Conversation> {
    const [newConversation] = await db
      .insert(conversations)
      .values(conversation)
      .returning();
    return newConversation;
  }

  async updateConversation(id: string, updates: Partial<InsertConversation>): Promise<Conversation | undefined> {
    const [updatedConversation] = await db
      .update(conversations)
      .set(updates)
      .where(eq(conversations.id, id))
      .returning();
    return updatedConversation || undefined;
  }

  // Analytics methods
  async getAnalyticsByAgentId(agentId: string): Promise<Analytics[]> {
    return await db.select().from(analytics).where(eq(analytics.agentId, agentId)).orderBy(desc(analytics.date));
  }

  async createAnalytics(analyticsData: InsertAnalytics): Promise<Analytics> {
    const [newAnalytics] = await db
      .insert(analytics)
      .values(analyticsData)
      .returning();
    return newAnalytics;
  }

  async updateAnalytics(id: string, updates: Partial<InsertAnalytics>): Promise<Analytics | undefined> {
    const [updatedAnalytics] = await db
      .update(analytics)
      .set(updates)
      .where(eq(analytics.id, id))
      .returning();
    return updatedAnalytics || undefined;
  }

  // Department methods
  async getDepartmentsByOrganizationId(organizationId: string): Promise<Department[]> {
    return await db.select().from(departments).where(eq(departments.organizationId, organizationId));
  }

  async getDepartmentById(id: string): Promise<Department | undefined> {
    const [department] = await db.select().from(departments).where(eq(departments.id, id));
    return department || undefined;
  }

  async createDepartment(department: InsertDepartment): Promise<Department> {
    const [newDepartment] = await db
      .insert(departments)
      .values(department)
      .returning();
    return newDepartment;
  }

  async updateDepartment(id: string, updates: Partial<InsertDepartment>): Promise<Department | undefined> {
    const [updatedDepartment] = await db
      .update(departments)
      .set(updates)
      .where(eq(departments.id, id))
      .returning();
    return updatedDepartment || undefined;
  }

  async deleteDepartment(id: string): Promise<boolean> {
    const result = await db.delete(departments).where(eq(departments.id, id));
    return (result.rowCount || 0) > 0;
  }

  // Call Template methods
  async getCallTemplatesByOrganizationId(organizationId: string): Promise<CallTemplate[]> {
    return await db.select().from(callTemplates).where(eq(callTemplates.organizationId, organizationId));
  }

  async getCallTemplatesByDepartmentId(departmentId: string): Promise<CallTemplate[]> {
    return await db.select().from(callTemplates).where(eq(callTemplates.departmentId, departmentId));
  }

  async createCallTemplate(template: InsertCallTemplate): Promise<CallTemplate> {
    const [newTemplate] = await db
      .insert(callTemplates)
      .values(template)
      .returning();
    return newTemplate;
  }

  async updateCallTemplate(id: string, updates: Partial<InsertCallTemplate>): Promise<CallTemplate | undefined> {
    const [updatedTemplate] = await db
      .update(callTemplates)
      .set(updates)
      .where(eq(callTemplates.id, id))
      .returning();
    return updatedTemplate || undefined;
  }

  async deleteCallTemplate(id: string): Promise<boolean> {
    const result = await db.delete(callTemplates).where(eq(callTemplates.id, id));
    return (result.rowCount || 0) > 0;
  }

  // Telephony Provider methods
  async getTelephonyProvidersByOrganizationId(organizationId: string): Promise<TelephonyProvider[]> {
    return await db.select().from(telephonyProviders).where(eq(telephonyProviders.organizationId, organizationId));
  }

  async getTelephonyProviderById(id: string): Promise<TelephonyProvider | undefined> {
    const [provider] = await db.select().from(telephonyProviders).where(eq(telephonyProviders.id, id));
    return provider || undefined;
  }

  async createTelephonyProvider(provider: InsertTelephonyProvider): Promise<TelephonyProvider> {
    const [newProvider] = await db
      .insert(telephonyProviders)
      .values(provider)
      .returning();
    return newProvider;
  }

  async updateTelephonyProvider(id: string, updates: Partial<InsertTelephonyProvider>): Promise<TelephonyProvider | undefined> {
    const [updatedProvider] = await db
      .update(telephonyProviders)
      .set(updates)
      .where(eq(telephonyProviders.id, id))
      .returning();
    return updatedProvider || undefined;
  }

  async deleteTelephonyProvider(id: string): Promise<boolean> {
    const result = await db.delete(telephonyProviders).where(eq(telephonyProviders.id, id));
    return (result.rowCount || 0) > 0;
  }

  // System Health methods
  async getSystemHealthMetrics(): Promise<SystemHealth[]> {
    return await db.select().from(systemHealth).orderBy(desc(systemHealth.checkedAt));
  }

  async createSystemHealthMetric(metric: InsertSystemHealth): Promise<SystemHealth> {
    const [newMetric] = await db
      .insert(systemHealth)
      .values(metric)
      .returning();
    return newMetric;
  }

  async updateSystemHealthMetric(id: string, updates: Partial<InsertSystemHealth>): Promise<SystemHealth | undefined> {
    const [updatedMetric] = await db
      .update(systemHealth)
      .set(updates)
      .where(eq(systemHealth.id, id))
      .returning();
    return updatedMetric || undefined;
  }

  // Usage Metrics methods
  async getUsageMetricsByOrganizationId(organizationId: string, billingPeriod?: string): Promise<UsageMetric[]> {
    let query = db.select().from(usageMetrics).where(eq(usageMetrics.organizationId, organizationId));
    if (billingPeriod) {
      query = query.where(eq(usageMetrics.billingPeriod, billingPeriod));
    }
    return await query.orderBy(desc(usageMetrics.recordedAt));
  }

  async createUsageMetric(metric: InsertUsageMetric): Promise<UsageMetric> {
    const [newMetric] = await db
      .insert(usageMetrics)
      .values(metric)
      .returning();
    return newMetric;
  }

  // Enhanced Call Logs methods
  async getCallLogsByOrganizationId(organizationId: string): Promise<CallLog[]> {
    return await db.select().from(callLogs).where(eq(callLogs.organizationId, organizationId)).orderBy(desc(callLogs.createdAt));
  }

  async getCallLogsByAgentId(agentId: string): Promise<CallLog[]> {
    return await db.select().from(callLogs).where(eq(callLogs.agentId, agentId)).orderBy(desc(callLogs.createdAt));
  }

  async createCallLog(callLog: InsertCallLog): Promise<CallLog> {
    const [newCallLog] = await db
      .insert(callLogs)
      .values(callLog)
      .returning();
    return newCallLog;
  }

  async updateCallLog(id: string, updates: Partial<InsertCallLog>): Promise<CallLog | undefined> {
    const [updatedCallLog] = await db
      .update(callLogs)
      .set(updates)
      .where(eq(callLogs.id, id))
      .returning();
    return updatedCallLog || undefined;
  }
}

export const storage = new DatabaseStorage();
