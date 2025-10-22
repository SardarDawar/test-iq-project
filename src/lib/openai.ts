import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface ReframeContext {
  bio?: string;
  industry?: string;
  jobRole?: string;
}

export async function reframeQuestion(
  originalQuestion: string,
  context: ReframeContext
): Promise<string> {
  try {
    const prompt = `You are helping personalize an assessment question.

Original question: "${originalQuestion}"

User context:
${context.bio ? `Bio: ${context.bio}` : ''}
${context.industry ? `Industry: ${context.industry}` : ''}
${context.jobRole ? `Role: ${context.jobRole}` : ''}

IMPORTANT:
- Reframe the question to be contextually relevant to this user
- Keep the SAME difficulty, logic, and scoring structure
- Only change wording and scenarios (e.g., "team" vs "classroom", "client" vs "colleague")
- Maintain the same answer options if it's multiple choice
- Keep the question concise and clear

Return ONLY the reframed question text, nothing else.`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are an expert at personalizing assessment questions while maintaining their validity and difficulty.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 300,
    });

    return response.choices[0]?.message?.content?.trim() || originalQuestion;
  } catch (error) {
    console.error('Error reframing question:', error);
    return originalQuestion; // Fallback to original if AI fails
  }
}

export async function generateInsights(
  scores: {
    iq?: number;
    eq?: number;
    sq?: number;
    lpi?: number;
  },
  domainScores: any
): Promise<string> {
  try {
    const prompt = `Generate personalized intelligence insights for a user with these scores:

IQ: ${scores.iq || 'N/A'}
EQ: ${scores.eq || 'N/A'}
SQ: ${scores.sq || 'N/A'}
Leadership Potential Index: ${scores.lpi || 'N/A'}

Domain breakdown: ${JSON.stringify(domainScores)}

Provide:
1. A concise summary of their intelligence profile (2-3 sentences)
2. Key strengths based on their scores
3. Ideal roles or contexts where they would excel

Keep it encouraging, specific, and actionable. Return as plain text.`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are an expert psychologist providing personalized intelligence assessments.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.8,
      max_tokens: 400,
    });

    return response.choices[0]?.message?.content?.trim() || 'Your results show a unique intelligence profile.';
  } catch (error) {
    console.error('Error generating insights:', error);
    return 'Your results show a unique intelligence profile with diverse strengths.';
  }
}
