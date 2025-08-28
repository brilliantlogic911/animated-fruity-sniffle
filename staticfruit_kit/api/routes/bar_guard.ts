// /ai/bar_guard
import { FastifyInstance } from 'fastify';

// Content moderation patterns and rules
const MODERATION_RULES = {
  // High-risk words that should be rejected
  slurs: [
    'nigger', 'nigga', 'chink', 'gook', 'spic', 'wetback', 'beaner', 'kike', 'heeb',
    'faggot', 'fag', 'homo', 'queer', 'tranny', 'shemale', 'cunt', 'whore', 'slut'
  ],

  // Hate speech indicators
  hateSpeech: [
    'kill all', 'exterminate', 'genocide', 'superior race', 'master race',
    'white power', 'black power', 'supremacy', 'inferior'
  ],

  // Harassment patterns
  harassment: [
    'dox', 'doxing', 'swat', 'raid', 'harass', 'stalk', 'threaten'
  ],

  // Sexual content indicators
  sexual: [
    'fuck', 'shit', 'damn', 'bitch', 'asshole', 'dick', 'pussy', 'cock', 'tits',
    'cum', 'jizz', 'porn', 'sex', 'nude', 'naked', 'rape', 'molest'
  ],

  // Mild profanity (lower toxicity)
  mildProfanity: [
    'hell', 'damn', 'crap', 'suck', 'piss', 'bastard', 'jerk', 'idiot'
  ]
};

interface ModerationResult {
  ok: boolean;
  toxicity: number;
  reasons: string[];
  suggested_fix?: string;
}

function moderateContent(text: string): ModerationResult {
  if (!text || typeof text !== 'string') {
    return { ok: false, toxicity: 1.0, reasons: ['Invalid or empty content'] };
  }

  const lowerText = text.toLowerCase();
  const reasons: string[] = [];
  let toxicity = 0.0;

  // Check for high-risk content (immediate rejection)
  for (const slur of MODERATION_RULES.slurs) {
    if (lowerText.includes(slur)) {
      reasons.push(`Contains slur: "${slur}"`);
      toxicity = 1.0;
    }
  }

  // Check for hate speech
  for (const hate of MODERATION_RULES.hateSpeech) {
    if (lowerText.includes(hate)) {
      reasons.push(`Contains hate speech: "${hate}"`);
      toxicity = Math.max(toxicity, 0.95);
    }
  }

  // Check for harassment
  for (const harass of MODERATION_RULES.harassment) {
    if (lowerText.includes(harass)) {
      reasons.push(`Contains harassment: "${harass}"`);
      toxicity = Math.max(toxicity, 0.9);
    }
  }

  // Check for sexual content
  for (const sexual of MODERATION_RULES.sexual) {
    if (lowerText.includes(sexual)) {
      reasons.push(`Contains sexual content: "${sexual}"`);
      toxicity = Math.max(toxicity, 0.8);
    }
  }

  // Check for mild profanity (lower penalty)
  let mildCount = 0;
  for (const mild of MODERATION_RULES.mildProfanity) {
    if (lowerText.includes(mild)) {
      mildCount++;
    }
  }
  if (mildCount > 0) {
    reasons.push(`Contains mild profanity (${mildCount} instances)`);
    toxicity = Math.max(toxicity, Math.min(0.3 + (mildCount * 0.1), 0.6));
  }

  // Length and quality checks
  if (text.length < 3) {
    reasons.push('Content too short');
    toxicity = Math.max(toxicity, 0.2);
  }

  if (text.length > 280) {
    reasons.push('Content too long (max 280 characters)');
    toxicity = Math.max(toxicity, 0.3);
  }

  // Check for excessive caps
  const capsRatio = (text.match(/[A-Z]/g) || []).length / text.length;
  if (capsRatio > 0.7 && text.length > 10) {
    reasons.push('Excessive use of capital letters');
    toxicity = Math.max(toxicity, 0.2);
  }

  // Check for repetitive characters
  if (/(.)\1{4,}/.test(text)) {
    reasons.push('Excessive character repetition');
    toxicity = Math.max(toxicity, 0.15);
  }

  // Generate suggested fix if content has issues
  let suggested_fix: string | undefined;
  if (toxicity > 0.3 && reasons.length > 0) {
    suggested_fix = generateSuggestedFix(text, reasons);
  }

  return {
    ok: toxicity < 0.7, // Allow content with mild issues
    toxicity: Math.round(toxicity * 100) / 100,
    reasons,
    suggested_fix
  };
}

function generateSuggestedFix(text: string, reasons: string[]): string {
  let suggestion = text;

  // Remove or replace problematic words
  for (const slur of MODERATION_RULES.slurs) {
    if (text.toLowerCase().includes(slur)) {
      suggestion = suggestion.replace(new RegExp(slur, 'gi'), '[redacted]');
    }
  }

  // Tone down excessive caps
  if (reasons.some(r => r.includes('capital letters'))) {
    suggestion = suggestion.replace(/[A-Z]{2,}/g, (match) =>
      match.charAt(0) + match.slice(1).toLowerCase()
    );
  }

  // Remove excessive repetition
  if (reasons.some(r => r.includes('repetition'))) {
    suggestion = suggestion.replace(/(.)\1{3,}/g, '$1$1$1');
  }

  // If suggestion is different, return it
  if (suggestion !== text) {
    return suggestion;
  }

  // Generic suggestions
  if (reasons.some(r => r.includes('sexual'))) {
    return "Consider rephrasing to remove explicit content";
  }
  if (reasons.some(r => r.includes('hate'))) {
    return "Consider using more inclusive language";
  }
  if (reasons.some(r => r.includes('harassment'))) {
    return "Consider focusing on positive expression";
  }

  return "Please review and revise the content";
}

export default async function routes(app: FastifyInstance) {
  app.post('/bar_guard', async (req, reply) => {
    const { text } = (req.body as any) ?? {};

    if (!text) {
      return reply.code(400).send({
        ok: false,
        toxicity: 1.0,
        reasons: ['No text provided'],
        suggested_fix: 'Please provide text to moderate'
      });
    }

    try {
      const result = moderateContent(text);
      return reply.send(result);
    } catch (error) {
      console.error('Moderation error:', error);
      return reply.code(500).send({
        ok: false,
        toxicity: 1.0,
        reasons: ['Internal moderation error'],
        suggested_fix: 'Please try again later'
      });
    }
  });
}
