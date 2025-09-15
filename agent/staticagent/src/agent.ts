// Lightweight Agent with action registry compatible with agent.addAction/runAction
import OpenRouter from 'openrouter-ai';
import dotenv from 'dotenv';

dotenv.config();

export type ActionHandler = (params: any) => Promise<any>;

export interface ActionDefinition {
  name: string;
  description: string;
  parameters: Record<string, string>;
  handler: ActionHandler;
}

export class Agent {
  private registry: Map<string, ActionDefinition> = new Map();
  private openrouter: any;

  constructor() {
    this.openrouter = new OpenRouter({
      apiKey: process.env.OPENROUTER_API_KEY
    });
  }

  addAction(def: ActionDefinition): void {
    if (!def?.name || typeof def.handler !== 'function') {
      throw new Error('Invalid action definition');
    }
    this.registry.set(def.name, def);
  }

  async runAction(name: string, params: any): Promise<any> {
    const def = this.registry.get(name);
    if (!def) throw new Error(`Action not found: ${name}`);
    return def.handler(params ?? {});
  }

  listActions(): string[] {
    return Array.from(this.registry.keys());
  }

  // AI Actions for markets, horoscopes, and bars
  async generateMarketInsight(marketData: any): Promise<string> {
    try {
      const response = await this.openrouter.chat.completions.create({
        model: 'openai/gpt-4-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a cryptocurrency market analyst. Provide insights on market trends, price movements, and trading opportunities.'
          },
          {
            role: 'user',
            content: `Analyze this market data and provide insights: ${JSON.stringify(marketData)}`
          }
        ]
      });
      
      return response.choices[0].message.content;
    } catch (error) {
      console.error('Error generating market insight:', error);
      return 'Unable to generate market insight at this time.';
    }
  }

  async generateHoroscope(sign: string, theme: string): Promise<string> {
    try {
      const response = await this.openrouter.chat.completions.create({
        model: 'openai/gpt-4-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are an astrological advisor. Provide personalized horoscopes based on zodiac signs and themes.'
          },
          {
            role: 'user',
            content: `Generate a horoscope for ${sign} with theme "${theme}". Keep it concise and relevant to crypto/web3 space.`
          }
        ]
      });
      
      return response.choices[0].message.content;
    } catch (error) {
      console.error('Error generating horoscope:', error);
      return 'Unable to generate horoscope at this time.';
    }
  }

  async generateBarRecommendation(userPreferences: any): Promise<string> {
    try {
      const response = await this.openrouter.chat.completions.create({
        model: 'openai/gpt-4-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a bar/restaurant recommender in the crypto/web3 space. Suggest trending bars based on user preferences.'
          },
          {
            role: 'user',
            content: `Recommend bars based on these preferences: ${JSON.stringify(userPreferences)}`
          }
        ]
      });
      
      return response.choices[0].message.content;
    } catch (error) {
      console.error('Error generating bar recommendation:', error);
      return 'Unable to generate bar recommendations at this time.';
    }
  }
}