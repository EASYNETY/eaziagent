import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || "default_key"
});

interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

interface AIResponse {
  response: string;
  confidence: number;
}

export async function generateAgentResponse(
  userMessage: string,
  agentContext: {
    name: string;
    businessName: string;
    tone: string;
    systemPrompt?: string;
    knowledgeBase?: string[];
  },
  conversationHistory: ChatMessage[] = []
): Promise<AIResponse> {
  try {
    const systemPrompt = agentContext.systemPrompt || `
You are ${agentContext.name}, a helpful AI assistant for ${agentContext.businessName}. 
Your communication style is ${agentContext.tone}.
You should help customers with their inquiries based on the provided knowledge base.
If you cannot answer a question based on the available information, politely say so and offer to connect them with a human representative.
Keep responses concise and helpful.
    `.trim();

    const knowledgeContext = agentContext.knowledgeBase?.length 
      ? `\n\nKnowledge Base:\n${agentContext.knowledgeBase.join('\n\n')}`
      : '';

    const messages: ChatMessage[] = [
      { role: "system", content: systemPrompt + knowledgeContext },
      ...conversationHistory.slice(-10), // Keep last 10 messages for context
      { role: "user", content: userMessage }
    ];

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages,
      max_tokens: 500,
      temperature: 0.7,
    });

    const assistantResponse = response.choices[0].message.content || "I apologize, but I'm having trouble processing your request right now. Please try again or contact our support team.";

    return {
      response: assistantResponse,
      confidence: 0.9 // Simple confidence score, could be enhanced
    };
  } catch (error) {
    console.error("OpenAI API error:", error);
    throw new Error("Failed to generate AI response: " + error.message);
  }
}

export async function analyzeKnowledgeBase(content: string): Promise<{
  summary: string;
  topics: string[];
  keyPoints: string[];
}> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an expert at analyzing and summarizing knowledge base content. Provide a structured analysis in JSON format with summary, topics, and keyPoints arrays."
        },
        {
          role: "user",
          content: `Analyze this knowledge base content and provide a JSON response with summary, topics (max 5), and keyPoints (max 10):\n\n${content}`
        }
      ],
      response_format: { type: "json_object" },
      max_tokens: 1000,
    });

    const analysis = JSON.parse(response.choices[0].message.content || "{}");
    
    return {
      summary: analysis.summary || "Content analysis completed",
      topics: analysis.topics || [],
      keyPoints: analysis.keyPoints || []
    };
  } catch (error) {
    console.error("Knowledge base analysis error:", error);
    return {
      summary: "Failed to analyze content",
      topics: [],
      keyPoints: []
    };
  }
}

export async function generateSystemPrompt(agentConfig: {
  name: string;
  businessName: string;
  description: string;
  tone: string;
  industry?: string;
}): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an expert at creating effective system prompts for AI customer service agents. Create a comprehensive system prompt that will guide the agent's behavior."
        },
        {
          role: "user",
          content: `Create a system prompt for an AI agent with these details:
Name: ${agentConfig.name}
Business: ${agentConfig.businessName}
Description: ${agentConfig.description}
Tone: ${agentConfig.tone}
Industry: ${agentConfig.industry || 'General'}

The prompt should define the agent's role, communication style, capabilities, and limitations.`
        }
      ],
      max_tokens: 800,
    });

    return response.choices[0].message.content || `You are ${agentConfig.name}, a helpful AI assistant for ${agentConfig.businessName}.`;
  } catch (error) {
    console.error("System prompt generation error:", error);
    return `You are ${agentConfig.name}, a helpful AI assistant for ${agentConfig.businessName}. Your communication style is ${agentConfig.tone}. Help customers with their inquiries professionally and courteously.`;
  }
}
