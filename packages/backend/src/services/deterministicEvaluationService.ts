/**
 * Deterministic Idea Evaluation Service
 *
 * Provides heuristic-based evaluation of ideas without relying on external AI APIs.
 * Uses a weighted scoring system across 6 key dimensions identified by industry research:
 * - Problem Clarity (clarity of the problem statement)
 * - Solution Viability (feasibility of the proposed solution)
 * - Market Potential (TAM/addressable market size)
 * - Execution Readiness (team and resource availability)
 * - Innovation Factor (uniqueness and differentiation)
 * - Scalability (ability to grow beyond MVP)
 */

export interface IdeaInput {
  title: string;
  description: string;
  category: string;
  creatorProfile?: {
    firstName?: string;
    lastName?: string;
    skills?: string[];
  };
}

interface ScoreBreakdown {
  problemClarity: number;
  solutionViability: number;
  marketPotential: number;
  executionReadiness: number;
  innovationFactor: number;
  scalability: number;
}

interface EvaluationResult {
  overallScore: number; // 0-100
  scoreBreakdown: ScoreBreakdown;
  valuation: {
    low: number;
    mid: number;
    high: number;
  };
  suggestions: string[];
  riskFactors: string[];
}

class DeterministicEvaluationService {
  /**
   * Evaluate an idea and return a deterministic score
   */
  static evaluate(idea: IdeaInput): EvaluationResult {
    const breakdown = this.calculateScoreBreakdown(idea);
    const overallScore = this.calculateOverallScore(breakdown);
    const valuation = this.calculateValuation(overallScore, idea);
    const suggestions = this.generateSuggestions(idea, breakdown);
    const riskFactors = this.identifyRiskFactors(idea, breakdown);

    return {
      overallScore,
      scoreBreakdown: breakdown,
      valuation,
      suggestions,
      riskFactors,
    };
  }

  /**
   * Calculate individual dimension scores
   */
  private static calculateScoreBreakdown(idea: IdeaInput): ScoreBreakdown {
    return {
      problemClarity: this.scoreProblemClarity(idea),
      solutionViability: this.scoreSolutionViability(idea),
      marketPotential: this.scoreMarketPotential(idea),
      executionReadiness: this.scoreExecutionReadiness(idea),
      innovationFactor: this.scoreInnovationFactor(idea),
      scalability: this.scoreScalability(idea),
    };
  }

  /**
   * Problem Clarity: Is the problem well-defined and significant?
   * Keywords: "problem", "issue", "challenge", "pain point", "frustration"
   */
  private static scoreProblemClarity(idea: IdeaInput): number {
    const text = (idea.title + ' ' + idea.description).toLowerCase();

    let score = 50; // Base score

    // Length bonus: longer descriptions suggest more thought
    const wordCount = text.split(/\s+/).length;
    if (wordCount > 50) score += 10;
    if (wordCount > 100) score += 10;
    if (wordCount > 200) score += 5; // diminishing returns

    // Problem-focused keywords
    const problemKeywords = ['problem', 'issue', 'challenge', 'pain point', 'struggle', 'difficult', 'inefficient', 'frustration', 'gap'];
    const problemMatches = problemKeywords.filter(kw => text.includes(kw)).length;
    score += Math.min(problemMatches * 3, 15);

    // Specific audience indicators
    const audienceKeywords = ['users', 'customers', 'businesses', 'entrepreneurs', 'creators', 'people', 'professionals', 'teams'];
    const audienceMatches = audienceKeywords.filter(kw => text.includes(kw)).length;
    score += Math.min(audienceMatches * 2, 10);

    // Specificity penalty: too vague descriptions lose points
    const vaguePhrases = ['something', 'kind of', 'maybe', 'potentially', 'might'];
    const vagueMatches = vaguePhrases.filter(ph => text.includes(ph)).length;
    score -= Math.min(vagueMatches * 3, 15);

    return Math.min(Math.max(score, 0), 100);
  }

  /**
   * Solution Viability: Is the proposed solution concrete and achievable?
   * Keywords: "solution", "approach", "build", "create", "platform", "tool", "feature"
   */
  private static scoreSolutionViability(idea: IdeaInput): number {
    const text = (idea.title + ' ' + idea.description).toLowerCase();

    let score = 50; // Base score

    // Solution-focused keywords
    const solutionKeywords = ['solution', 'approach', 'build', 'create', 'develop', 'platform', 'tool', 'software', 'app', 'service', 'feature'];
    const solutionMatches = solutionKeywords.filter(kw => text.includes(kw)).length;
    score += Math.min(solutionMatches * 3, 20);

    // Technical specificity
    const techKeywords = ['api', 'database', 'mobile', 'web', 'cloud', 'backend', 'frontend', 'algorithm', 'machine learning', 'ai', 'automation'];
    const techMatches = techKeywords.filter(kw => text.includes(kw)).length;
    score += Math.min(techMatches * 2, 15);

    // Action-oriented language
    const actionKeywords = ['connect', 'automate', 'simplify', 'streamline', 'reduce', 'eliminate', 'accelerate', 'optimize'];
    const actionMatches = actionKeywords.filter(kw => text.includes(kw)).length;
    score += Math.min(actionMatches * 2, 15);

    // Unrealistic scope indicators
    if (text.includes('solve all') || text.includes('solve world') || text.includes('billion people')) {
      score -= 10;
    }

    return Math.min(Math.max(score, 0), 100);
  }

  /**
   * Market Potential: Is the addressable market large enough?
   * Keywords: "market", "industry", "billion", "market size", "opportunity"
   */
  private static scoreMarketPotential(idea: IdeaInput): number {
    const text = (idea.title + ' ' + idea.description).toLowerCase();

    let score = 50; // Base score

    // Market awareness indicators
    const marketKeywords = ['market', 'industry', 'market size', 'opportunity', 'demand', 'growing', 'expanding', 'trillion'];
    const marketMatches = marketKeywords.filter(kw => text.includes(kw)).length;
    score += Math.min(marketMatches * 4, 20);

    // Market size language
    if (text.includes('billion') || text.includes('$')) score += 15;
    if (text.includes('million')) score += 10;

    // Growth indicators
    if (text.includes('growth') || text.includes('expand') || text.includes('scale')) score += 10;

    // Category boost: certain categories have naturally larger markets
    const highMarketCategories = ['fintech', 'healthcare', 'education', 'productivity', 'marketplace', 'communication', 'e-commerce'];
    if (highMarketCategories.some(cat => idea.category.toLowerCase().includes(cat))) {
      score += 10;
    }

    // Niche penalty: very specific niches
    if (text.includes('niche') || text.length < 50) {
      score -= 5;
    }

    return Math.min(Math.max(score, 0), 100);
  }

  /**
   * Execution Readiness: Does the creator have necessary resources?
   * Evaluates team composition and capability indicators
   */
  private static scoreExecutionReadiness(idea: IdeaInput): number {
    let score = 50; // Base score

    // Team composition bonus
    const profile = idea.creatorProfile;
    if (profile) {
      if (profile.firstName) score += 10;
      if (profile.skills && profile.skills.length > 0) score += 15;
      if (profile.skills && profile.skills.length >= 3) score += 10;
    }

    // Execution-ready keywords in description
    const text = (idea.title + ' ' + idea.description).toLowerCase();
    const executionKeywords = ['mvp', 'prototype', 'beta', 'beta testing', 'launch', 'launch plan', 'timeline', 'roadmap', 'team'];
    const executionMatches = executionKeywords.filter(kw => text.includes(kw)).length;
    score += Math.min(executionMatches * 3, 15);

    // Partnership/collaboration indicators
    if (text.includes('partner') || text.includes('collaborate') || text.includes('network')) {
      score += 5;
    }

    return Math.min(Math.max(score, 0), 100);
  }

  /**
   * Innovation Factor: How unique/differentiated is this idea?
   * Keywords: "novel", "unique", "first", "only", "new approach"
   */
  private static scoreInnovationFactor(idea: IdeaInput): number {
    const text = (idea.title + ' ' + idea.description).toLowerCase();

    let score = 50; // Base score

    // Differentiation keywords
    const innovationKeywords = ['novel', 'unique', 'first', 'only', 'different', 'new approach', 'innovative', 'breakthrough', 'proprietary', 'patent'];
    const innovationMatches = innovationKeywords.filter(kw => text.includes(kw)).length;
    score += Math.min(innovationMatches * 4, 20);

    // Competitive advantage language
    if (text.includes('vs ') || text.includes('versus') || text.includes('unlike') || text.includes('better than')) {
      score += 10;
    }

    // Technology positioning
    const techPositioning = ['blockchain', 'ai', 'machine learning', 'quantum', 'web3', 'iot', 'ar', 'vr'];
    const techMatches = techPositioning.filter(tech => text.includes(tech)).length;
    score += Math.min(techMatches * 3, 10);

    // Incremental vs transformational
    if (text.includes('improve') || text.includes('enhance') || text.includes('better')) {
      score += 5; // Positive but modest
    }

    return Math.min(Math.max(score, 0), 100);
  }

  /**
   * Scalability: Can this grow beyond early adoption?
   * Keywords: "scale", "grow", "viral", "network effects", "automation"
   */
  private static scoreScalability(idea: IdeaInput): number {
    const text = (idea.title + ' ' + idea.description).toLowerCase();

    let score = 50; // Base score

    // Scalability keywords
    const scalabilityKeywords = ['scale', 'grow', 'viral', 'exponential', 'network effects', 'automation', 'leverage', 'multiply'];
    const scalabilityMatches = scalabilityKeywords.filter(kw => text.includes(kw)).length;
    score += Math.min(scalabilityMatches * 4, 20);

    // Platform/infrastructure indicators
    if (text.includes('platform') || text.includes('infrastructure') || text.includes('ecosystem')) {
      score += 10;
    }

    // Recurring revenue indicators
    if (text.includes('subscription') || text.includes('recurring') || text.includes('saas')) {
      score += 10;
    }

    // Network effects
    if (text.includes('network') || text.includes('community') || text.includes('collaboration')) {
      score += 10;
    }

    // One-time/limited scale
    if (text.includes('service') && text.includes('local')) {
      score -= 10; // Local services scale differently
    }

    return Math.min(Math.max(score, 0), 100);
  }

  /**
   * Calculate overall score from breakdown (weighted average)
   */
  private static calculateOverallScore(breakdown: ScoreBreakdown): number {
    // Weights based on importance in startup evaluation
    const weights = {
      problemClarity: 0.15,       // Must understand the problem
      solutionViability: 0.20,    // Solution must be achievable
      marketPotential: 0.25,      // Market size is critical
      executionReadiness: 0.15,   // Team matters
      innovationFactor: 0.15,     // Differentiation important
      scalability: 0.10,          // Growth potential
    };

    const weighted =
      breakdown.problemClarity * weights.problemClarity +
      breakdown.solutionViability * weights.solutionViability +
      breakdown.marketPotential * weights.marketPotential +
      breakdown.executionReadiness * weights.executionReadiness +
      breakdown.innovationFactor * weights.innovationFactor +
      breakdown.scalability * weights.scalability;

    return Math.round(weighted);
  }

  /**
   * Calculate valuation range in USD
   * Based on overall score and market context
   */
  private static calculateValuation(score: number, idea: IdeaInput): { low: number; mid: number; high: number } {
    // Base valuations for different score ranges
    let baseValuation = 0;

    if (score >= 85) {
      // Exceptional ideas: $2-5M range (strong fundamentals)
      baseValuation = 3500000;
    } else if (score >= 70) {
      // Strong ideas: $1-3M range
      baseValuation = 2000000;
    } else if (score >= 55) {
      // Viable ideas: $500K-1.5M range
      baseValuation = 1000000;
    } else if (score >= 40) {
      // Early-stage ideas: $100K-500K range
      baseValuation = 300000;
    } else {
      // Developmental ideas: $10K-100K range
      baseValuation = 50000;
    }

    // Category multiplier
    const categoryMultipliers: { [key: string]: number } = {
      'fintech': 1.3,
      'healthtech': 1.3,
      'saas': 1.2,
      'marketplace': 1.15,
      'ai': 1.25,
      'deeptech': 1.15,
    };

    const categoryKey = Object.keys(categoryMultipliers).find(key =>
      idea.category.toLowerCase().includes(key)
    );
    const multiplier = categoryKey ? categoryMultipliers[categoryKey] : 1.0;

    const adjustedValuation = baseValuation * multiplier;

    return {
      low: Math.round(adjustedValuation * 0.6),
      mid: Math.round(adjustedValuation),
      high: Math.round(adjustedValuation * 1.5),
    };
  }

  /**
   * Generate actionable suggestions based on evaluation
   */
  private static generateSuggestions(idea: IdeaInput, breakdown: ScoreBreakdown): string[] {
    const suggestions: string[] = [];

    if (breakdown.problemClarity < 60) {
      suggestions.push('Clearly define the specific problem you\'re solving and who experiences it most acutely');
    }

    if (breakdown.solutionViability < 60) {
      suggestions.push('Detail your solution approach - what is it exactly, and why does it work better than alternatives?');
    }

    if (breakdown.marketPotential < 60) {
      suggestions.push('Research and articulate your Total Addressable Market (TAM) to demonstrate scale potential');
    }

    if (breakdown.executionReadiness < 60) {
      suggestions.push('Highlight your team\'s relevant experience and skills needed to execute this vision');
    }

    if (breakdown.innovationFactor < 60) {
      suggestions.push('Articulate what makes your approach unique or different from existing solutions');
    }

    if (breakdown.scalability < 60) {
      suggestions.push('Explain how this idea scales beyond initial users - what are the growth mechanisms?');
    }

    // Positive suggestions
    if (breakdown.marketPotential >= 75) {
      suggestions.push('Strong market opportunity identified - focus on execution and differentiation');
    }

    if (breakdown.innovationFactor >= 75) {
      suggestions.push('Your unique approach is compelling - ensure it\'s clearly communicated to potential collaborators');
    }

    // Default suggestion if score is low overall
    if (suggestions.length === 0) {
      suggestions.push('Consider conducting customer discovery to validate your assumptions about the problem and solution');
    }

    return suggestions;
  }

  /**
   * Identify potential risk factors
   */
  private static identifyRiskFactors(idea: IdeaInput, breakdown: ScoreBreakdown): string[] {
    const risks: string[] = [];

    if (breakdown.executionReadiness < 50) {
      risks.push('Team execution capability - consider adding complementary skills');
    }

    if (breakdown.solutionViability < 50) {
      risks.push('Technical feasibility unclear - prototype or validate core assumptions');
    }

    if (breakdown.marketPotential < 50) {
      risks.push('Market size validation needed - verify addressable market exists');
    }

    const text = (idea.title + ' ' + idea.description).toLowerCase();

    if (text.length < 100) {
      risks.push('Detailed description could strengthen evaluation - provide more context');
    }

    if (!idea.creatorProfile || !idea.creatorProfile.skills || idea.creatorProfile.skills.length === 0) {
      risks.push('No skills profile - highlight relevant expertise to increase confidence');
    }

    return risks;
  }
}

export default DeterministicEvaluationService;
