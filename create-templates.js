const mongoose = require('mongoose');
require('dotenv').config();

const templateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: true,
  },
  icon: {
    type: String,
    default: '💡',
  },
  category: {
    type: String,
    required: true,
    enum: ['Technology', 'Healthcare', 'Finance', 'Education', 'Marketplace', 'AI', 'Other'],
  },
  sections: [
    {
      id: String,
      title: String,
      description: String,
      placeholder: String,
      hints: [String],
      warnings: [String],
      wordCountTarget: Number,
      required: {
        type: Boolean,
        default: false,
      },
    },
  ],
  isDefault: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const Template = mongoose.model('Template', templateSchema);

const templates = [
  {
    name: 'SaaS Product',
    description: 'Perfect for software-as-a-service ideas with recurring revenue',
    icon: '☁️',
    category: 'Technology',
    isDefault: true,
    sections: [
      {
        id: 'problem',
        title: 'The Problem',
        description: 'What pain point does your SaaS solve?',
        placeholder: 'Describe the specific problem your target users face...',
        hints: ['Be specific', 'Focus on frequency of problem', 'Quantify if possible'],
        required: true,
        wordCountTarget: 150,
      },
      {
        id: 'solution',
        title: 'Your Solution',
        description: 'How does your SaaS solve it?',
        placeholder: 'Explain how your product solves the problem uniquely...',
        hints: ['Highlight differentiators', 'Mention key features', 'Explain the workflow'],
        required: true,
        wordCountTarget: 200,
      },
      {
        id: 'target_market',
        title: 'Target Market',
        description: 'Who is your ideal customer?',
        placeholder: 'Describe your target user profile, company size, industry...',
        hints: ['Be specific about company type', 'Define user roles', 'Estimate TAM'],
        required: true,
        wordCountTarget: 150,
      },
      {
        id: 'business_model',
        title: 'Business Model',
        description: 'How will you make money?',
        placeholder: 'Subscription price, pricing tiers, or revenue model...',
        hints: ['Monthly or annual pricing', 'Freemium strategy', 'Upsell opportunities'],
        required: true,
        wordCountTarget: 100,
      },
      {
        id: 'competition',
        title: 'Competition',
        description: 'Who are your competitors and how are you different?',
        placeholder: 'List competitors and explain your competitive advantage...',
        hints: ['Name direct competitors', 'List indirect alternatives', 'Your differentiation'],
        required: false,
        wordCountTarget: 150,
      },
    ],
  },
  {
    name: 'Mobile App',
    description: 'Ideal for consumer-facing mobile applications',
    icon: '📱',
    category: 'Technology',
    isDefault: true,
    sections: [
      {
        id: 'use_case',
        title: 'Primary Use Case',
        description: 'What will users do with your app?',
        placeholder: 'Describe the main action users take in your app...',
        hints: ['Be specific', 'Think about daily/weekly usage', 'Define user journey'],
        required: true,
        wordCountTarget: 150,
      },
      {
        id: 'unique_features',
        title: 'Unique Features',
        description: 'What makes your app special?',
        placeholder: 'List 3-5 differentiating features...',
        hints: ['Focus on user experience', 'Mention tech innovations', 'Social/community aspects'],
        required: true,
        wordCountTarget: 150,
      },
      {
        id: 'monetization',
        title: 'Monetization Strategy',
        description: 'How will you generate revenue?',
        placeholder: 'Free with ads, premium tier, in-app purchases...',
        hints: ['Free or paid', 'Ad strategy', 'IAP or subscriptions'],
        required: false,
        wordCountTarget: 100,
      },
      {
        id: 'target_demographics',
        title: 'Target Demographics',
        description: 'Who is your ideal user?',
        placeholder: 'Age range, interests, tech-savviness...',
        hints: ['Define age range', 'Lifestyle/interests', 'Pain points they have'],
        required: true,
        wordCountTarget: 150,
      },
    ],
  },
  {
    name: 'Healthcare Innovation',
    description: 'For healthcare products, services, or medical devices',
    icon: '⚕️',
    category: 'Healthcare',
    isDefault: true,
    sections: [
      {
        id: 'medical_problem',
        title: 'Medical Problem',
        description: 'What health issue does this address?',
        placeholder: 'Describe the clinical problem and patient population...',
        hints: ['Include prevalence/statistics', 'Define patient journey', 'Current limitations'],
        required: true,
        wordCountTarget: 150,
      },
      {
        id: 'clinical_approach',
        title: 'Clinical Approach',
        description: 'How does your solution work medically?',
        placeholder: 'Explain the clinical mechanism or treatment approach...',
        hints: ['Evidence-based', 'Mention studies/trials', 'Safety considerations'],
        required: true,
        wordCountTarget: 200,
      },
      {
        id: 'regulatory_path',
        title: 'Regulatory Path',
        description: 'How will you navigate regulations?',
        placeholder: 'FDA approval strategy, insurance coverage, certifications...',
        hints: ['Identify regulatory class', 'Timeline estimate', 'Key compliance steps'],
        required: false,
        wordCountTarget: 150,
      },
      {
        id: 'market_opportunity',
        title: 'Market Opportunity',
        description: 'Size and growth of addressable market',
        placeholder: 'Patient population size, market growth rate, pricing...',
        hints: ['Patient numbers', 'Market size in dollars', 'Growth projections'],
        required: true,
        wordCountTarget: 150,
      },
    ],
  },
];

async function seedTemplates() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/dreamcraft');
    console.log('Connected to MongoDB');

    // Clear existing templates
    await Template.deleteMany({});
    console.log('Cleared existing templates');

    // Insert new templates
    const created = await Template.insertMany(templates);
    console.log(`✅ Created ${created.length} templates`);

    created.forEach((t) => {
      console.log(`  - ${t.name} (${t.category})`);
    });

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (err) {
    console.error('Error seeding templates:', err);
    process.exit(1);
  }
}

seedTemplates();
