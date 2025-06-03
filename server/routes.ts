import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { 
  insertAgentSchema, insertKnowledgeBaseSchema, insertConversationSchema,
  type Agent, type KnowledgeBase, type Conversation 
} from "@shared/schema";
import { generateAgentResponse, analyzeKnowledgeBase, generateSystemPrompt } from "./openai";
import { initiateCall, processVoiceInput, generateVoiceResponse, generateVoiceGoodbye } from "./voice";
import { z } from "zod";
import multer from "multer";
import { randomUUID } from "crypto";

// Configure multer for file uploads
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

export async function registerRoutes(app: Express): Promise<Server> {
  setupAuth(app);

  // Middleware to ensure user is authenticated
  const requireAuth = (req: any, res: any, next: any) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Authentication required" });
    }
    next();
  };

  // Agent routes
  app.get("/api/agents", requireAuth, async (req: any, res) => {
    try {
      const agents = await storage.getAgentsByUserId(req.user.id);
      res.json(agents);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch agents" });
    }
  });

  app.get("/api/agents/:id", requireAuth, async (req: any, res) => {
    try {
      const agent = await storage.getAgentByIdAndUserId(req.params.id, req.user.id);
      if (!agent) {
        return res.status(404).json({ message: "Agent not found" });
      }
      res.json(agent);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch agent" });
    }
  });

  app.post("/api/agents", requireAuth, async (req: any, res) => {
    try {
      // Validate the request body first without userId
      const clientData = insertAgentSchema.parse(req.body);
      
      // Add userId from authenticated user
      const agentData = {
        ...clientData,
        userId: req.user.id,
      };

      // Generate system prompt for the agent
      if (!agentData.systemPrompt) {
        try {
          agentData.systemPrompt = await generateSystemPrompt({
            name: agentData.name,
            businessName: agentData.businessName,
            description: agentData.description || "",
            tone: agentData.tone,
          });
        } catch (error) {
          console.warn("System prompt generation failed, using fallback:", (error as any).message);
          agentData.systemPrompt = `You are ${agentData.name}, an AI assistant for ${agentData.businessName}. Your tone is ${agentData.tone}. ${agentData.description ? `Your role: ${agentData.description}` : ''}`;
        }
      }

      const agent = await storage.createAgent(agentData);
      res.status(201).json(agent);
    } catch (error) {
      console.error("Failed to create agent:", error);
      if (error.name === 'ZodError') {
        res.status(400).json({ message: "Validation failed", errors: error.errors });
      } else {
        res.status(400).json({ message: "Failed to create agent", error: error.message });
      }
    }
  });

  app.put("/api/agents/:id", requireAuth, async (req: any, res) => {
    try {
      const agent = await storage.getAgentByIdAndUserId(req.params.id, req.user.id);
      if (!agent) {
        return res.status(404).json({ message: "Agent not found" });
      }

      const updates = insertAgentSchema.partial().parse(req.body);
      const updatedAgent = await storage.updateAgent(req.params.id, updates);
      res.json(updatedAgent);
    } catch (error) {
      res.status(400).json({ message: "Failed to update agent", error: error.message });
    }
  });

  app.delete("/api/agents/:id", requireAuth, async (req: any, res) => {
    try {
      const success = await storage.deleteAgent(req.params.id, req.user.id);
      if (!success) {
        return res.status(404).json({ message: "Agent not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete agent" });
    }
  });

  // Agent testing route
  app.post("/api/agents/:id/test", requireAuth, async (req: any, res) => {
    try {
      const agent = await storage.getAgentByIdAndUserId(req.params.id, req.user.id);
      if (!agent) {
        return res.status(404).json({ message: "Agent not found" });
      }

      const { message } = req.body;
      if (!message || typeof message !== 'string') {
        return res.status(400).json({ message: "Message is required" });
      }

      // Generate AI response using the agent's configuration
      const response = await generateAgentResponse(message, {
        name: agent.name,
        businessName: agent.businessName,
        tone: agent.tone,
        systemPrompt: agent.systemPrompt || "",
      });

      res.json({ response: response.response, confidence: response.confidence });
    } catch (error) {
      console.error("Agent test error:", error);
      res.status(500).json({ message: "Failed to test agent", error: (error as any).message });
    }
  });

  // Voice calling route
  app.post("/api/agents/:id/call", requireAuth, async (req: any, res) => {
    try {
      const agent = await storage.getAgentByIdAndUserId(req.params.id, req.user.id);
      if (!agent) {
        return res.status(404).json({ message: "Agent not found" });
      }

      const { phoneNumber } = req.body;
      if (!phoneNumber || typeof phoneNumber !== 'string') {
        return res.status(400).json({ message: "Phone number is required" });
      }

      try {
        // Attempt Twilio integration for real voice calls
        const callResult = await initiateCall(phoneNumber, {
          agentId: agent.id,
          agentName: agent.name,
          businessName: agent.businessName,
          tone: agent.tone,
          systemPrompt: agent.systemPrompt || undefined,
        });

        // Create a conversation record for the call
        const conversation = await storage.createConversation({
          agentId: agent.id,
          sessionId: callResult.callId,
          messages: [{
            role: "system",
            content: `Voice call initiated to ${phoneNumber}`,
            timestamp: new Date().toISOString()
          }],
          isResolved: false,
        });

        res.json({ 
          callId: callResult.callId,
          status: callResult.status,
          phoneNumber,
          conversationId: conversation.id,
          message: "Voice call initiated successfully via Twilio"
        });
      } catch (twilioError) {
        // Fallback for development/testing without Twilio
        const callId = `call_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        const conversation = await storage.createConversation({
          agentId: agent.id,
          sessionId: callId,
          messages: [{
            role: "system",
            content: `Voice call simulated to ${phoneNumber} (Twilio not configured)`,
            timestamp: new Date().toISOString()
          }],
          isResolved: false,
        });

        res.json({ 
          callId,
          status: "simulated",
          phoneNumber,
          conversationId: conversation.id,
          message: "Call simulated successfully. To enable real voice calls, configure Twilio credentials."
        });
      }
    } catch (error) {
      console.error("Call initiation error:", error);
      res.status(500).json({ message: "Failed to initiate call", error: (error as any).message });
    }
  });

  // Voice webhook endpoints for Twilio
  app.post("/api/voice/webhook/:agentId", async (req: any, res) => {
    try {
      const { agentId } = req.params;
      const agent = await storage.getAgentById(agentId);
      
      if (!agent) {
        return res.type('text/xml').send(generateVoiceResponse("I'm sorry, the agent is not available."));
      }

      const welcomeMessage = `Hello! You've reached ${agent.businessName}. I'm ${agent.name}, your AI assistant. How can I help you today?`;
      res.type('text/xml').send(generateVoiceResponse(welcomeMessage));
    } catch (error) {
      console.error("Voice webhook error:", error);
      res.type('text/xml').send(generateVoiceResponse("I'm sorry, there was an error. Please try again."));
    }
  });

  app.post("/api/voice/process", async (req: any, res) => {
    try {
      const { SpeechResult, CallSid } = req.body;
      const agentId = req.query.agentId;

      if (!SpeechResult || !agentId) {
        return res.type('text/xml').send(generateVoiceResponse("I didn't catch that. Could you please repeat?"));
      }

      const voiceResponse = await processVoiceInput(SpeechResult, agentId, CallSid);
      res.type('text/xml').send(voiceResponse);
    } catch (error) {
      console.error("Voice processing error:", error);
      res.type('text/xml').send(generateVoiceResponse("I'm experiencing technical difficulties. Please try again."));
    }
  });

  app.post("/api/voice/status/:agentId", async (req: any, res) => {
    try {
      const { CallStatus, CallSid, From, To } = req.body;
      const { agentId } = req.params;

      // Update conversation status based on call status
      if (CallStatus === 'completed') {
        // Mark conversation as resolved when call ends
        const conversations = await storage.getConversationsByAgentId(agentId);
        const conversation = conversations.find(c => c.sessionId === CallSid);
        
        if (conversation) {
          await storage.updateConversation(conversation.id, {
            isResolved: true,
            endedAt: new Date(),
          });
        }
      }

      res.sendStatus(200);
    } catch (error) {
      console.error("Voice status update error:", error);
      res.sendStatus(500);
    }
  });

  // Knowledge base routes
  app.get("/api/agents/:agentId/knowledge", requireAuth, async (req: any, res) => {
    try {
      const agent = await storage.getAgentByIdAndUserId(req.params.agentId, req.user.id);
      if (!agent) {
        return res.status(404).json({ message: "Agent not found" });
      }

      const knowledgeBase = await storage.getKnowledgeBaseByAgentId(req.params.agentId);
      res.json(knowledgeBase);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch knowledge base" });
    }
  });

  app.post("/api/agents/:agentId/knowledge", requireAuth, upload.single('file'), async (req: any, res) => {
    try {
      const agent = await storage.getAgentByIdAndUserId(req.params.agentId, req.user.id);
      if (!agent) {
        return res.status(404).json({ message: "Agent not found" });
      }

      if (!req.file) {
        return res.status(400).json({ message: "File is required" });
      }

      const content = req.file.buffer.toString('utf-8');
      const analysis = await analyzeKnowledgeBase(content);

      const knowledgeBase = await storage.createKnowledgeBase({
        agentId: req.params.agentId,
        fileName: req.file.originalname,
        content,
        metadata: {
          size: req.file.size,
          mimetype: req.file.mimetype,
          analysis
        }
      });

      res.status(201).json(knowledgeBase);
    } catch (error) {
      console.error("Failed to upload knowledge base:", error);
      res.status(400).json({ message: "Failed to upload knowledge base", error: error.message });
    }
  });

  app.delete("/api/knowledge/:id", requireAuth, async (req: any, res) => {
    try {
      const success = await storage.deleteKnowledgeBase(req.params.id);
      if (!success) {
        return res.status(404).json({ message: "Knowledge base entry not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete knowledge base entry" });
    }
  });

  // Conversation routes
  app.get("/api/agents/:agentId/conversations", requireAuth, async (req: any, res) => {
    try {
      const agent = await storage.getAgentByIdAndUserId(req.params.agentId, req.user.id);
      if (!agent) {
        return res.status(404).json({ message: "Agent not found" });
      }

      const conversations = await storage.getConversationsByAgentId(req.params.agentId);
      res.json(conversations);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch conversations" });
    }
  });

  app.get("/api/conversations/:id", requireAuth, async (req: any, res) => {
    try {
      const conversation = await storage.getConversationById(req.params.id);
      if (!conversation) {
        return res.status(404).json({ message: "Conversation not found" });
      }

      // Verify user owns the agent
      const agent = await storage.getAgentByIdAndUserId(conversation.agentId, req.user.id);
      if (!agent) {
        return res.status(403).json({ message: "Access denied" });
      }

      res.json(conversation);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch conversation" });
    }
  });

  // Public chat endpoint for embedded widget
  app.post("/api/chat/:agentId", async (req, res) => {
    try {
      const { message, sessionId, conversationHistory = [] } = req.body;
      
      if (!message || !sessionId) {
        return res.status(400).json({ message: "Message and sessionId are required" });
      }

      const agent = await storage.getAgentById(req.params.agentId);
      if (!agent || !agent.isActive) {
        return res.status(404).json({ message: "Agent not found or inactive" });
      }

      // Get knowledge base for context
      const knowledgeBase = await storage.getKnowledgeBaseByAgentId(agent.id);
      const knowledgeContent = knowledgeBase.map(kb => kb.content);

      // Generate AI response
      const aiResponse = await generateAgentResponse(
        message,
        {
          name: agent.name,
          businessName: agent.businessName,
          tone: agent.tone,
          systemPrompt: agent.systemPrompt,
          knowledgeBase: knowledgeContent
        },
        conversationHistory
      );

      // Update or create conversation
      let conversation = await storage.getConversationsByAgentId(agent.id)
        .then(convs => convs.find(c => c.sessionId === sessionId));

      const newMessage = {
        role: "user" as const,
        content: message,
        timestamp: new Date().toISOString()
      };

      const assistantMessage = {
        role: "assistant" as const,
        content: aiResponse.response,
        timestamp: new Date().toISOString()
      };

      if (conversation) {
        const updatedMessages = [
          ...conversation.messages as any[],
          newMessage,
          assistantMessage
        ];
        
        await storage.updateConversation(conversation.id, {
          messages: updatedMessages
        });
      } else {
        await storage.createConversation({
          agentId: agent.id,
          sessionId,
          messages: [newMessage, assistantMessage],
          isResolved: false
        });
      }

      res.json({
        response: aiResponse.response,
        confidence: aiResponse.confidence,
        agentName: agent.name
      });
    } catch (error) {
      console.error("Chat error:", error);
      res.status(500).json({ message: "Failed to process chat message" });
    }
  });

  // Analytics routes
  app.get("/api/agents/:agentId/analytics", requireAuth, async (req: any, res) => {
    try {
      const agent = await storage.getAgentByIdAndUserId(req.params.agentId, req.user.id);
      if (!agent) {
        return res.status(404).json({ message: "Agent not found" });
      }

      const analytics = await storage.getAnalyticsByAgentId(req.params.agentId);
      const conversations = await storage.getConversationsByAgentId(req.params.agentId);

      // Calculate basic metrics
      const totalConversations = conversations.length;
      const resolvedConversations = conversations.filter(c => c.isResolved).length;
      const activeConversations = conversations.filter(c => !c.isResolved).length;
      const resolutionRate = totalConversations > 0 ? (resolvedConversations / totalConversations) * 100 : 0;

      // Calculate average response time (mock data for now)
      const avgResponseTime = 1300; // milliseconds

      res.json({
        analytics,
        metrics: {
          totalConversations,
          resolvedConversations,
          activeConversations,
          resolutionRate: Math.round(resolutionRate * 10) / 10,
          avgResponseTime
        }
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch analytics" });
    }
  });

  // Dashboard overview
  app.get("/api/dashboard", requireAuth, async (req: any, res) => {
    try {
      const agents = await storage.getAgentsByUserId(req.user.id);
      
      let totalConversations = 0;
      let activeConversations = 0;
      let resolvedConversations = 0;

      for (const agent of agents) {
        const conversations = await storage.getConversationsByAgentId(agent.id);
        totalConversations += conversations.length;
        activeConversations += conversations.filter(c => !c.isResolved).length;
        resolvedConversations += conversations.filter(c => c.isResolved).length;
      }

      const resolutionRate = totalConversations > 0 ? (resolvedConversations / totalConversations) * 100 : 0;
      const avgResponseTime = 1300; // milliseconds - would be calculated from real data

      res.json({
        totalAgents: agents.length,
        activeConversations,
        resolutionRate: Math.round(resolutionRate * 10) / 10,
        avgResponseTime,
        agents: agents.slice(0, 5), // Latest 5 agents for dashboard
        recentActivity: [
          {
            message: `Agent "${agents[0]?.name || 'New Agent'}" is handling conversations`,
            time: "2 minutes ago",
            type: "info"
          },
          {
            message: "Knowledge base updated",
            time: "5 minutes ago", 
            type: "success"
          },
          {
            message: "High conversation volume detected",
            time: "12 minutes ago",
            type: "warning"
          }
        ]
      });
    } catch (error) {
      console.error("Dashboard error:", error);
      res.status(500).json({ message: "Failed to fetch dashboard data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
