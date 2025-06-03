import twilio from 'twilio';
import { generateAgentResponse } from './openai';
import { storage } from './storage';

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

export interface VoiceCallConfig {
  agentId: string;
  agentName: string;
  businessName: string;
  tone: string;
  systemPrompt?: string;
}

export async function initiateCall(phoneNumber: string, config: VoiceCallConfig): Promise<any> {
  try {
    const call = await client.calls.create({
      url: `${process.env.BASE_URL || 'http://localhost:5000'}/api/voice/webhook/${config.agentId}`,
      to: phoneNumber,
      from: process.env.TWILIO_PHONE_NUMBER,
      statusCallback: `${process.env.BASE_URL || 'http://localhost:5000'}/api/voice/status/${config.agentId}`,
      statusCallbackEvent: ['initiated', 'ringing', 'answered', 'completed'],
      record: true,
    });

    return {
      callId: call.sid,
      status: call.status,
      direction: call.direction,
      to: call.to,
      from: call.from,
    };
  } catch (error) {
    console.error('Twilio call initiation error:', error);
    throw new Error('Failed to initiate voice call. Please check Twilio configuration.');
  }
}

export function generateVoiceResponse(text: string): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="alice">${text}</Say>
  <Gather input="speech" action="/api/voice/process" timeout="5" speechTimeout="auto">
    <Say voice="alice">Please speak your response.</Say>
  </Gather>
  <Say voice="alice">I didn't catch that. Please call back if you need assistance.</Say>
</Response>`;
}

export function generateVoiceGoodbye(): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="alice">Thank you for calling. Have a great day!</Say>
  <Hangup/>
</Response>`;
}

export async function processVoiceInput(
  speechResult: string,
  agentId: string,
  callSid: string
): Promise<string> {
  try {
    const agent = await storage.getAgentById(agentId);
    if (!agent) {
      return generateVoiceResponse("I'm sorry, there was an error processing your request.");
    }

    const response = await generateAgentResponse(speechResult, {
      name: agent.name,
      businessName: agent.businessName,
      tone: agent.tone,
      systemPrompt: agent.systemPrompt || undefined,
    });

    // Log the conversation
    await storage.createConversation({
      agentId: agent.id,
      sessionId: callSid,
      messages: [
        {
          role: "user",
          content: speechResult,
          timestamp: new Date().toISOString(),
        },
        {
          role: "assistant",
          content: response.response,
          timestamp: new Date().toISOString(),
        },
      ],
      isResolved: false,
    });

    return generateVoiceResponse(response.response);
  } catch (error) {
    console.error('Voice processing error:', error);
    return generateVoiceResponse("I'm experiencing technical difficulties. Please try again.");
  }
}