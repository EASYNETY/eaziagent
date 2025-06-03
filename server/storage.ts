import { 
  users, agents, knowledgeBase, conversations, analytics,
  type User, type InsertUser, type Agent, type InsertAgent,
  type KnowledgeBase, type InsertKnowledgeBase,
  type Conversation, type InsertConversation,
  type Analytics, type InsertAnalytics
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

  // Agent methods
  getAgentsByUserId(userId: number): Promise<Agent[]>;
  getAgentById(id: string): Promise<Agent | undefined>;
  getAgentByIdAndUserId(id: string, userId: number): Promise<Agent | undefined>;
  createAgent(agent: InsertAgent): Promise<Agent>;
  updateAgent(id: string, updates: Partial<InsertAgent>): Promise<Agent | undefined>;
  deleteAgent(id: string, userId: number): Promise<boolean>;

  // Knowledge base methods
  getKnowledgeBaseByAgentId(agentId: string): Promise<KnowledgeBase[]>;
  createKnowledgeBase(kb: InsertKnowledgeBase): Promise<KnowledgeBase>;
  deleteKnowledgeBase(id: string): Promise<boolean>;

  // Conversation methods
  getConversationsByAgentId(agentId: string): Promise<Conversation[]>;
  getConversationById(id: string): Promise<Conversation | undefined>;
  createConversation(conversation: InsertConversation): Promise<Conversation>;
  updateConversation(id: string, updates: Partial<InsertConversation>): Promise<Conversation | undefined>;

  // Analytics methods
  getAnalyticsByAgentId(agentId: string): Promise<Analytics[]>;
  createAnalytics(analytics: InsertAnalytics): Promise<Analytics>;
  updateAnalytics(id: string, updates: Partial<InsertAnalytics>): Promise<Analytics | undefined>;

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
}

export const storage = new DatabaseStorage();
