import express, { Request, Response } from 'express';
import { getLLMProvider, LLMProvider } from '../services/llmProvider';
import {
  aiRateLimitMiddleware,
  aiCircuitBreaker,
} from '../middleware/aiRateLimiter';
import { requireTier } from '../middleware/tierCheck';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();
const llm = getLLMProvider();

/**
 * Health check endpoint (no auth required)
 * Must be defined BEFORE authentication middleware
 */
router.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    llmProvider: process.env.USE_LOCAL_LLM === 'true' ? 'ollama' : 'openai',
    circuitBreaker: aiCircuitBreaker.getStatus(),
  });
});

// Apply rate limiting and authentication to all OTHER AI routes
router.use(authenticateToken);
router.use(aiRateLimitMiddleware);

/**
 * TIER 1 (FREE) ENDPOINTS
 * Basic AI-assisted creation features
 */

/**
 * POST /api/ai/chat
 * Conversational co-pilot for real-time ideation help
 * Tier: Free
 */
router.post('/chat', async (req: Request, res: Response) => {
  try {
    if (aiCircuitBreaker.isOpen()) {
      return res.status(503).json({
        error: 'AI service temporarily unavailable',
        status: aiCircuitBreaker.getStatus(),
      });
    }

    const { message, ideaContext } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message required' });
    }

    const prompt = `You are a helpful AI assistant for startup ideation. Help the user develop their business idea.
${ideaContext ? `Context: ${ideaContext}` : ''}

User: ${message}

Provide a concise, actionable response (2-3 sentences). Focus on practical advice.`;

    const response = await llm.generateCompletion(prompt, 0.7);
    aiCircuitBreaker.recordSuccess();

    res.json({ response });
  } catch (error) {
    console.error('Chat endpoint error:', error);
    aiCircuitBreaker.recordFailure();
    res.status(500).json({ error: 'Failed to generate chat response' });
  }
});

/**
 * POST /api/ai/expand
 * Auto-complete/expand text fields with AI suggestions
 * Tier: Free
 */
router.post('/expand', async (req: Request, res: Response) => {
  try {
    if (aiCircuitBreaker.isOpen()) {
      return res.status(503).json({ error: 'AI service temporarily unavailable' });
    }

    const { fieldName, currentValue, context } = req.body;

    if (!fieldName || !currentValue) {
      return res.status(400).json({ error: 'Field name and value required' });
    }

    const prompts: Record<string, string> = {
      title: `Improve this business idea title to be more compelling and specific. Keep it under 10 words.
Current: ${currentValue}
Return only the improved title.`,
      description: `Expand this business description to be more compelling. Add 1-2 sentences of detail.
Current: ${currentValue}
Return only the expanded description.`,
      problem: `Improve this problem statement to be more specific and impactful. Make it quantifiable if possible.
Current: ${currentValue}
Return only the improved statement.`,
      solution: `Expand this solution overview to explain how it uniquely solves the problem.
Current: ${currentValue}
Return only the expanded solution.`,
    };

    const prompt = prompts[fieldName] || prompts.description;
    const response = await llm.generateCompletion(prompt, 0.7);
    aiCircuitBreaker.recordSuccess();

    res.json({ expanded: response });
  } catch (error) {
    console.error('Expand endpoint error:', error);
    aiCircuitBreaker.recordFailure();
    res.status(500).json({ error: 'Failed to expand text' });
  }
});

/**
 * POST /api/ai/generate-bio
 * Interview-based bio generator for collaborators
 * Tier: Free
 */
router.post('/generate-bio', async (req: Request, res: Response) => {
  try {
    if (aiCircuitBreaker.isOpen()) {
      return res.status(503).json({ error: 'AI service temporarily unavailable' });
    }

    const { answers } = req.body; // { question1, question2, question3 }

    if (!answers) {
      return res.status(400).json({ error: 'Answers required' });
    }

    const prompt = `Generate a professional bio for a collaborator based on these answers:

1. What's your primary skill/expertise? ${answers.question1}
2. What projects are you passionate about? ${answers.question2}
3. What's your career goal? ${answers.question3}

Create a 2-3 sentence professional bio that highlights their strengths and interests.`;

    const bio = await llm.generateCompletion(prompt, 0.6);
    aiCircuitBreaker.recordSuccess();

    res.json({ bio });
  } catch (error) {
    console.error('Bio generator error:', error);
    aiCircuitBreaker.recordFailure();
    res.status(500).json({ error: 'Failed to generate bio' });
  }
});

/**
 * POST /api/ai/suggest-ideas
 * Real-time suggestions as user types
 * Tier: Free
 */
router.post('/suggest-ideas', async (req: Request, res: Response) => {
  try {
    if (aiCircuitBreaker.isOpen()) {
      return res.status(503).json({ error: 'AI service temporarily unavailable' });
    }

    const { partialIdea } = req.body;

    if (!partialIdea) {
      return res.status(400).json({ error: 'Partial idea required' });
    }

    const suggestions = await llm.generateStructuredCompletion(
      `You are helping someone develop a business idea. They've started with:
"${partialIdea}"

Suggest improvements in JSON format:`,
      {
        titleSuggestions: ['string'],
        descriptionPoints: ['string'],
        relevantCategories: ['string'],
      },
      0.8
    );

    aiCircuitBreaker.recordSuccess();
    res.json(suggestions);
  } catch (error) {
    console.error('Suggestions error:', error);
    aiCircuitBreaker.recordFailure();
    res.status(500).json({ error: 'Failed to generate suggestions' });
  }
});

/**
 * TIER 2 (EXPLORER) ENDPOINTS
 * Enhanced features for deeper analysis
 */

/**
 * POST /api/ai/market-analysis
 * Generate market size and TAM/SAM/SOM analysis
 * Tier: Explorer ($19/mo)
 */
router.post('/market-analysis', requireTier('explorer'), async (req: Request, res: Response) => {
  try {
    if (aiCircuitBreaker.isOpen()) {
      return res.status(503).json({ error: 'AI service temporarily unavailable' });
    }

    const { idea } = req.body;

    if (!idea) {
      return res.status(400).json({ error: 'Idea required' });
    }

    const analysis = await llm.generateStructuredCompletion(
      `Analyze the market for this business idea:
Title: ${idea.title}
Description: ${idea.description}
Target Market: ${idea.targetMarket}

Provide market analysis in JSON format with realistic estimates:`,
      {
        totalAddressableMarket: 'string (e.g., "$5B annually")',
        serviceableAvailableMarket: 'string (e.g., "$500M annually")',
        serviceableObtainableMarket: 'string (e.g., "$50M in year 5")',
        marketGrowthRate: 'string (e.g., "15% CAGR")',
        keyMarketTrends: ['string'],
        marketSaturation: 'string (low/medium/high)',
        competitiveIntensity: 'string (low/medium/high)',
      },
      0.6
    );

    aiCircuitBreaker.recordSuccess();
    res.json(analysis);
  } catch (error) {
    console.error('Market analysis error:', error);
    aiCircuitBreaker.recordFailure();
    res.status(500).json({ error: 'Failed to generate market analysis' });
  }
});

/**
 * POST /api/ai/competitive-analysis
 * Suggest key competitors and differentiation
 * Tier: Explorer
 */
router.post('/competitive-analysis', requireTier('explorer'), async (req: Request, res: Response) => {
  try {
    if (aiCircuitBreaker.isOpen()) {
      return res.status(503).json({ error: 'AI service temporarily unavailable' });
    }

    const { idea } = req.body;

    if (!idea) {
      return res.status(400).json({ error: 'Idea required' });
    }

    const analysis = await llm.generateStructuredCompletion(
      `Analyze competitors for this business idea:
Title: ${idea.title}
Description: ${idea.description}
Solution: ${idea.solution}

Provide competitive analysis in JSON format:`,
      {
        directCompetitors: ['string'],
        indirectCompetitors: ['string'],
        keyDifferentiators: ['string'],
        competitiveAdvantages: ['string'],
        vulnerabilities: ['string'],
        marketPosition: 'string (e.g., "Niche player" or "Market challenger")',
      },
      0.6
    );

    aiCircuitBreaker.recordSuccess();
    res.json(analysis);
  } catch (error) {
    console.error('Competitive analysis error:', error);
    aiCircuitBreaker.recordFailure();
    res
      .status(500)
      .json({ error: 'Failed to generate competitive analysis' });
  }
});

/**
 * POST /api/ai/suggest-team-roles
 * Suggest key team roles based on business model
 * Tier: Explorer
 */
router.post('/suggest-team-roles', requireTier('explorer'), async (req: Request, res: Response) => {
  try {
    if (aiCircuitBreaker.isOpen()) {
      return res.status(503).json({ error: 'AI service temporarily unavailable' });
    }

    const { idea } = req.body;

    if (!idea) {
      return res.status(400).json({ error: 'Idea required' });
    }

    const roles = await llm.generateStructuredCompletion(
      `Based on this business idea, suggest the key team roles needed:
Title: ${idea.title}
Description: ${idea.description}
Target Market: ${idea.targetMarket}

Return JSON with team roles and responsibilities:`,
      {
        criticalRoles: [
          {
            role: 'string',
            responsibilities: ['string'],
            skills: ['string'],
            priority: 'string (founder/phase1/phase2)',
          },
        ],
        advisors: ['string'],
        outsourceable: ['string'],
      },
      0.6
    );

    aiCircuitBreaker.recordSuccess();
    res.json(roles);
  } catch (error) {
    console.error('Team roles suggestion error:', error);
    aiCircuitBreaker.recordFailure();
    res.status(500).json({ error: 'Failed to suggest team roles' });
  }
});

/**
 * POST /api/ai/risk-assessment
 * Identify key risks and mitigation strategies
 * Tier: Explorer
 */
router.post('/risk-assessment', requireTier('explorer'), async (req: Request, res: Response) => {
  try {
    if (aiCircuitBreaker.isOpen()) {
      return res.status(503).json({ error: 'AI service temporarily unavailable' });
    }

    const { idea } = req.body;

    if (!idea) {
      return res.status(400).json({ error: 'Idea required' });
    }

    const risks = await llm.generateStructuredCompletion(
      `Assess risks for this business idea:
Title: ${idea.title}
Description: ${idea.description}
Market: ${idea.targetMarket}

Return JSON with risk analysis:`,
      {
        marketRisks: [
          { risk: 'string', severity: 'string (high/medium/low)', mitigation: 'string' },
        ],
        executionRisks: [
          { risk: 'string', severity: 'string', mitigation: 'string' },
        ],
        competitiveRisks: [
          { risk: 'string', severity: 'string', mitigation: 'string' },
        ],
        financialRisks: [
          { risk: 'string', severity: 'string', mitigation: 'string' },
        ],
        overallRiskLevel: 'string (low/medium/high)',
      },
      0.6
    );

    aiCircuitBreaker.recordSuccess();
    res.json(risks);
  } catch (error) {
    console.error('Risk assessment error:', error);
    aiCircuitBreaker.recordFailure();
    res.status(500).json({ error: 'Failed to assess risks' });
  }
});

/**
 * POST /api/ai/generate-roadmap
 * Generate MVP → Launch → Growth timeline
 * Tier: Explorer
 */
router.post('/generate-roadmap', requireTier('explorer'), async (req: Request, res: Response) => {
  try {
    if (aiCircuitBreaker.isOpen()) {
      return res.status(503).json({ error: 'AI service temporarily unavailable' });
    }

    const { idea } = req.body;

    if (!idea) {
      return res.status(400).json({ error: 'Idea required' });
    }

    const roadmap = await llm.generateStructuredCompletion(
      `Create a realistic product roadmap for this business idea:
Title: ${idea.title}
Description: ${idea.description}

Return JSON with phases:`,
      {
        phases: [
          {
            phase: 'string (MVP/Phase 1/etc)',
            duration: 'string (e.g., "3 months")',
            keyMilestones: ['string'],
            resources: 'string',
            successMetrics: ['string'],
          },
        ],
        estimatedTimeToLaunch: 'string',
        fundingRequired: 'string (estimated range)',
      },
      0.6
    );

    aiCircuitBreaker.recordSuccess();
    res.json(roadmap);
  } catch (error) {
    console.error('Roadmap generation error:', error);
    aiCircuitBreaker.recordFailure();
    res.status(500).json({ error: 'Failed to generate roadmap' });
  }
});

/**
 * POST /api/ai/evaluate-section
 * Score individual business plan sections
 * Tier: Explorer
 */
router.post('/evaluate-section', requireTier('explorer'), async (req: Request, res: Response) => {
  try {
    if (aiCircuitBreaker.isOpen()) {
      return res.status(503).json({ error: 'AI service temporarily unavailable' });
    }

    const { sectionName, content } = req.body;

    if (!sectionName || !content) {
      return res.status(400).json({ error: 'Section name and content required' });
    }

    const evaluation = await llm.generateStructuredCompletion(
      `Evaluate this business plan section:
Section: ${sectionName}
Content: ${content}

Provide a detailed evaluation in JSON format:`,
      {
        score: 'number (0-100)',
        strengths: ['string'],
        improvements: ['string'],
        suggestions: ['string'],
        completeness: 'string (incomplete/partial/complete)',
      },
      0.6
    );

    aiCircuitBreaker.recordSuccess();
    res.json(evaluation);
  } catch (error) {
    console.error('Section evaluation error:', error);
    aiCircuitBreaker.recordFailure();
    res.status(500).json({ error: 'Failed to evaluate section' });
  }
});

/**
 * TIER 3 (BUILDER) ENDPOINTS
 * Premium features for comprehensive planning
 */

/**
 * POST /api/ai/generate-financials
 * Generate 3-year financial projections
 * Tier: Builder ($99/mo)
 */
router.post(
  '/generate-financials',
  requireTier('builder'),
  async (req: Request, res: Response) => {
    try {
      if (aiCircuitBreaker.isOpen()) {
        return res
          .status(503)
          .json({ error: 'AI service temporarily unavailable' });
      }

      const { idea, marketSize, assumptions } = req.body;

      if (!idea) {
        return res.status(400).json({ error: 'Idea required' });
      }

      const financials = await llm.generateStructuredCompletion(
        `Generate 3-year financial projections for this business:
Title: ${idea.title}
Description: ${idea.description}
Estimated Market Size: ${marketSize}
Additional Assumptions: ${assumptions}

Return JSON with financial projections:`,
        {
          revenue: [
            { year: 'number', monthly: 'string', annual: 'string' },
          ],
          expenses: [
            {
              category: 'string',
              year1: 'string',
              year2: 'string',
              year3: 'string',
            },
          ],
          breakEvenPoint: 'string (months or quarters)',
          profitMargin: [
            { year: 'number', margin: 'string (percentage)' },
          ],
          fundingNeeded: 'string (estimated)',
          useOfFunds: 'object',
        },
        0.5
      );

      aiCircuitBreaker.recordSuccess();
      res.json(financials);
    } catch (error) {
      console.error('Financials generation error:', error);
      aiCircuitBreaker.recordFailure();
      res.status(500).json({ error: 'Failed to generate financials' });
    }
  }
);

/**
 * POST /api/ai/generate-pitch
 * Generate elevator pitch from business plan
 * Tier: Builder
 */
router.post(
  '/generate-pitch',
  requireTier('builder'),
  async (req: Request, res: Response) => {
    try {
      if (aiCircuitBreaker.isOpen()) {
        return res
          .status(503)
          .json({ error: 'AI service temporarily unavailable' });
      }

      const { idea } = req.body;

      if (!idea) {
        return res.status(400).json({ error: 'Idea required' });
      }

      const pitch = await llm.generateCompletion(
        `Create a compelling 30-second elevator pitch for this business:
Title: ${idea.title}
Problem: ${idea.problem}
Solution: ${idea.solution}
Target Market: ${idea.targetMarket}

Make it engaging, specific, and compelling. No more than 3-4 sentences.`,
        0.7
      );

      aiCircuitBreaker.recordSuccess();
      res.json({ pitch });
    } catch (error) {
      console.error('Pitch generation error:', error);
      aiCircuitBreaker.recordFailure();
      res.status(500).json({ error: 'Failed to generate pitch' });
    }
  }
);

/**
 * POST /api/ai/validate-traction
 * Validate and suggest proof points
 * Tier: Builder
 */
router.post(
  '/validate-traction',
  requireTier('builder'),
  async (req: Request, res: Response) => {
    try {
      if (aiCircuitBreaker.isOpen()) {
        return res
          .status(503)
          .json({ error: 'AI service temporarily unavailable' });
      }

      const { idea, tractionPoints } = req.body;

      if (!idea) {
        return res.status(400).json({ error: 'Idea required' });
      }

      const validation = await llm.generateStructuredCompletion(
        `Validate and suggest proof points for this business idea:
Title: ${idea.title}
Current Traction: ${tractionPoints}

Return JSON with validation:`,
        {
          validProofPoints: ['string'],
          suggestedProofPoints: ['string'],
          metrics: ['string (e.g., "100 waitlist signups")'],
          weakPoints: ['string'],
          recommendations: ['string'],
        },
        0.6
      );

      aiCircuitBreaker.recordSuccess();
      res.json(validation);
    } catch (error) {
      console.error('Traction validation error:', error);
      aiCircuitBreaker.recordFailure();
      res.status(500).json({ error: 'Failed to validate traction' });
    }
  }
);

/**
 * POST /api/ai/plan-fund-usage
 * Plan allocation strategy if fundraising
 * Tier: Builder
 */
router.post(
  '/plan-fund-usage',
  requireTier('builder'),
  async (req: Request, res: Response) => {
    try {
      if (aiCircuitBreaker.isOpen()) {
        return res
          .status(503)
          .json({ error: 'AI service temporarily unavailable' });
      }

      const { idea, fundingAmount, priorities } = req.body;

      if (!idea || !fundingAmount) {
        return res
          .status(400)
          .json({ error: 'Idea and funding amount required' });
      }

      const plan = await llm.generateStructuredCompletion(
        `Create a fund allocation plan for this business:
Title: ${idea.title}
Funding Amount: ${fundingAmount}
Priorities: ${priorities}

Return JSON with allocation:`,
        {
          categories: [
            {
              category: 'string (e.g., "Product Development")',
              allocation: 'string (percentage)',
              details: 'string',
            },
          ],
          timeline: 'string (e.g., "12 months")',
          keyMilestones: ['string'],
          contingency: 'string (percentage)',
          runwayMonths: 'number',
        },
        0.6
      );

      aiCircuitBreaker.recordSuccess();
      res.json(plan);
    } catch (error) {
      console.error('Fund usage planning error:', error);
      aiCircuitBreaker.recordFailure();
      res.status(500).json({ error: 'Failed to plan fund usage' });
    }
  }
);


export default router;
