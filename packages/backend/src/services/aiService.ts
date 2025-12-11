import { OpenAI } from 'openai';

let openai: OpenAI | null = null;

const getOpenAIClient = () => {
  if (!openai && process.env.OPENAI_API_KEY) {
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }
  return openai;
};

export const generateIdeaValuation = async (idea: any) => {
  try {
    const client = getOpenAIClient();
    if (!client) {
      return {
        estimatedValue: 5000,
        aiScore: 50,
        marketSize: 'Unknown',
        confidence: 0,
        analysis: 'OpenAI API key not configured',
      };
    }

    const prompt = `
    Evaluate this business idea and provide a JSON response with the following fields:
    - estimatedValue: estimated market value in USD (number)
    - aiScore: quality score 0-100 (number)
    - marketSize: estimated market size (string)
    - confidence: confidence percentage 0-100 (number)
    - analysis: brief analysis (string)

    Idea Title: ${idea.title}
    Description: ${idea.description}
    Problem: ${idea.documentation.problemStatement}
    Target Market: ${idea.documentation.targetMarket}
    Solution: ${idea.documentation.solutionOverview}
    `;

    const response = await client.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
    });

    const content = response.choices[0].message.content;
    const jsonMatch = content?.match(/\{[\s\S]*\}/);
    const valuation = jsonMatch ? JSON.parse(jsonMatch[0]) : {};

    return valuation;
  } catch (error) {
    console.error('AI Valuation error:', error);
    return {
      estimatedValue: 5000,
      aiScore: 50,
      marketSize: 'Unknown',
      confidence: 30,
    };
  }
};

export const generateNDAText = (creatorName: string, ideaTitle: string) => {
  return `
    NON-DISCLOSURE AGREEMENT

    This Non-Disclosure Agreement ("Agreement") is entered into as of today's date between:

    Disclosing Party: ${creatorName}
    Idea: "${ideaTitle}"

    CONFIDENTIAL INFORMATION: The Disclosing Party wishes to disclose certain confidential business information
    ("Confidential Information") to the Receiving Party for the purpose of evaluating potential collaboration.

    The Receiving Party agrees to:
    1. Keep the Confidential Information strictly confidential
    2. Use the information solely for evaluation purposes
    3. Not disclose the information to third parties without written consent
    4. Return or destroy all copies upon request
    5. Acknowledge that the information remains the exclusive property of the Disclosing Party

    This Agreement shall remain in effect for 3 years from the date of disclosure.

    Signature: ________________     Date: ________________
  `;
};

export const validateAndScoreIdea = async (idea: any) => {
  try {
    const client = getOpenAIClient();
    if (!client) {
      return {
        score: 50,
        strengths: ['Unable to analyze - API key not configured'],
        weaknesses: ['Configure OPENAI_API_KEY environment variable'],
        suggestions: ['Set up OpenAI integration to enable AI analysis'],
      };
    }

    const prompt = `Analyze this business idea and provide validation feedback in JSON format.

Title: ${idea.title}
Description: ${idea.description}
Category: ${idea.category || 'Not specified'}

Return JSON with these fields:
{
  "score": <number 0-100 representing overall quality>,
  "strengths": [<array of 3-5 positive aspects>],
  "weaknesses": [<array of 2-4 areas needing improvement>],
  "suggestions": [<array of 3-5 specific, actionable improvements>]
}`;

    const response = await client.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
    });

    const content = response.choices[0].message.content;
    const jsonMatch = content?.match(/\{[\s\S]*\}/);
    const validation = jsonMatch ? JSON.parse(jsonMatch[0]) : {};

    return {
      score: validation.score || 50,
      strengths: validation.strengths || ['Analysis unavailable'],
      weaknesses: validation.weaknesses || ['Analysis unavailable'],
      suggestions: validation.suggestions || ['Try again later'],
    };
  } catch (error) {
    console.error('AI Validation error:', error);
    return {
      score: 50,
      strengths: ['Unable to complete analysis'],
      weaknesses: ['AI service temporarily unavailable'],
      suggestions: ['Please try again in a moment'],
    };
  }
};

export const generateAISuggestions = async (partialIdea: any) => {
  try {
    const client = getOpenAIClient();
    if (!client) {
      return {
        titleSuggestions: [],
        descriptionSuggestions: [],
        categorySuggestion: null,
      };
    }

    const prompt = `As a startup advisor, help improve this idea submission.

Current Title: ${partialIdea.title || '(empty)'}
Current Description: ${partialIdea.description || '(empty)'}
Current Category: ${partialIdea.category || '(empty)'}

Provide suggestions in JSON format:
{
  "titleSuggestions": [<2-3 improved title options if title needs work, otherwise empty array>],
  "descriptionSuggestions": [<3-4 bullet points to add to description>],
  "categorySuggestion": <best category from: Technology, Healthcare, Finance, Education, Entertainment, E-Commerce, Other, or null if current is good>
}`;

    const response = await client.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.8,
    });

    const content = response.choices[0].message.content;
    const jsonMatch = content?.match(/\{[\s\S]*\}/);
    const suggestions = jsonMatch ? JSON.parse(jsonMatch[0]) : {};

    return {
      titleSuggestions: suggestions.titleSuggestions || [],
      descriptionSuggestions: suggestions.descriptionSuggestions || [],
      categorySuggestion: suggestions.categorySuggestion || null,
    };
  } catch (error) {
    console.error('AI Suggestions error:', error);
    return {
      titleSuggestions: [],
      descriptionSuggestions: ['Unable to generate suggestions at this time'],
      categorySuggestion: null,
    };
  }
};
