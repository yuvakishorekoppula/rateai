export interface PricingPlan {
  planName: string;
  monthlyPrice: number | string;
  yearlyPrice?: number | string;
  billingType: string;
  features: string[];
  customPricing: boolean;
  usageNotes?: string;
}

export interface Platform {
  id: string;
  name: string;
  category: string;
  website: string;
  description: string;
  pricingPlans: PricingPlan[];
}

export const pricingData: Platform[] = [
  {
    id: "cursor",
    name: "Cursor",
    category: "IDE",
    website: "https://cursor.sh",
    description: "An AI-native code editor designed for high-performance pair programming, featuring deep integration with LLMs for code generation and refactoring.",
    pricingPlans: [
      {
        planName: "Hobby",
        monthlyPrice: 0,
        billingType: "Free",
        features: [
          "Limited agent requests/completions",
          "15-day Pro trial",
          "Standard AI models"
        ],
        customPricing: false
      },
      {
        planName: "Pro",
        monthlyPrice: 20,
        yearlyPrice: 16,
        billingType: "Per User / Monthly",
        features: [
          "Unlimited tab completions",
          "$20/mo usage credits",
          "Advanced AI models (Claude 3.5 Sonnet, GPT-4o)",
          "Private mode"
        ],
        customPricing: false
      },
      {
        planName: "Pro+",
        monthlyPrice: 60,
        billingType: "Per User / Monthly",
        features: [
          "3x usage limits compared to Pro",
          "Higher priority for agent requests",
          "Advanced collaborative features"
        ],
        customPricing: false
      },
      {
        planName: "Ultra",
        monthlyPrice: 200,
        billingType: "Per User / Monthly",
        features: [
          "20x usage limits compared to Pro",
          "Highest priority access",
          "Concierge support"
        ],
        customPricing: false
      },
      {
        planName: "Business",
        monthlyPrice: 40,
        billingType: "Per User / Monthly",
        features: [
          "Admin dashboard",
          "SAML/SSO",
          "Centralized billing",
          "Usage statistics"
        ],
        customPricing: false
      },
      {
        planName: "Enterprise",
        monthlyPrice: "Custom",
        billingType: "Contact Sales",
        features: [
          "Custom deployments",
          "Dedicated infrastructure",
          "Enterprise-grade security & compliance"
        ],
        customPricing: true
      }
    ]
  },
  {
    id: "github-copilot",
    name: "GitHub Copilot",
    category: "IDE Extension",
    website: "https://github.com/features/copilot",
    description: "The world's most widely used AI developer tool, integrated directly into your editor to provide real-time code suggestions and chat-based assistance.",
    pricingPlans: [
      {
        planName: "Individual",
        monthlyPrice: 10,
        yearlyPrice: 100,
        billingType: "Per User / Monthly",
        features: [
          "Code completions in IDE",
          "Copilot Chat in IDE and Mobile",
          "Copilot in CLI",
          "Knowledge bases (limited)"
        ],
        customPricing: false
      },
      {
        planName: "Pro+",
        monthlyPrice: 39,
        billingType: "Per User / Monthly",
        features: [
          "Advanced chat capabilities",
          "Enhanced model access",
          "Higher usage limits"
        ],
        customPricing: false
      },
      {
        planName: "Business",
        monthlyPrice: 19,
        billingType: "Per User / Monthly",
        features: [
          "Policy management",
          "Audit logs",
          "Enterprise-grade security",
          "IP indemnity"
        ],
        customPricing: false
      },
      {
        planName: "Enterprise",
        monthlyPrice: 39,
        billingType: "Per User / Monthly",
        features: [
          "Customized models based on your codebase",
          "Advanced documentation search",
          "Fine-grained access control"
        ],
        customPricing: false
      }
    ]
  },
  {
    id: "claude",
    name: "Claude",
    category: "Chatbot / LLM",
    website: "https://claude.ai",
    description: "Anthropic's flagship AI assistant, known for its high reasoning capabilities, large context window, and helpful, harmless personality.",
    pricingPlans: [
      {
        planName: "Free",
        monthlyPrice: 0,
        billingType: "Free",
        features: [
          "Access to Claude 3.5 Sonnet",
          "Daily message limits",
          "Web and mobile access"
        ],
        customPricing: false
      },
      {
        planName: "Pro",
        monthlyPrice: 20,
        yearlyPrice: 17,
        billingType: "Per User / Monthly",
        features: [
          "5x more usage than Free",
          "Priority access during high traffic",
          "Early access to new features",
          "Claude 3.5 Opus access"
        ],
        customPricing: false,
        usageNotes: "Yearly price is an annual equivalent billed yearly."
      },
      {
        planName: "Max 5x",
        monthlyPrice: 100,
        billingType: "Per User / Monthly",
        features: [
          "Substantially higher usage limits",
          "Enhanced priority"
        ],
        customPricing: false
      },
      {
        planName: "Max 20x",
        monthlyPrice: 200,
        billingType: "Per User / Monthly",
        features: [
          "Maximum possible usage for individuals",
          "VIP priority access"
        ],
        customPricing: false
      },
      {
        planName: "Team",
        monthlyPrice: 25,
        billingType: "Per Seat / Monthly",
        features: [
          "Minimum 5 seats",
          "Higher usage limits than Pro",
          "Centralized billing & administration",
          "Early access to collaboration features"
        ],
        customPricing: false
      },
      {
        planName: "Enterprise",
        monthlyPrice: "Custom",
        billingType: "Contact Sales",
        features: [
          "SSO & Directory Sync",
          "Expanded context windows",
          "Admin controls & security",
          "Dedicated support"
        ],
        customPricing: true
      }
    ]
  },
  {
    id: "chatgpt",
    name: "ChatGPT",
    category: "Chatbot / LLM",
    website: "https://chatgpt.com",
    description: "OpenAI's iconic AI assistant, providing versatile capabilities for writing, coding, analysis, and image generation with DALL-E.",
    pricingPlans: [
      {
        planName: "Free",
        monthlyPrice: 0,
        billingType: "Free",
        features: [
          "Access to GPT-4o mini",
          "Limited access to GPT-4o",
          "Web, iOS, and Android access"
        ],
        customPricing: false
      },
      {
        planName: "Plus",
        monthlyPrice: 20,
        billingType: "Per User / Monthly",
        features: [
          "5x more messages for GPT-4o",
          "Access to DALL-E, Browsing, and Advanced Data Analysis",
          "Early access to new features like Voice Mode"
        ],
        customPricing: false
      },
      {
        planName: "Pro",
        monthlyPrice: "100-200",
        billingType: "Per User / Monthly",
        features: [
          "Unlimited GPT-4o and o1-preview",
          "Highest compute priority",
          "Advanced tools for power users"
        ],
        customPricing: false
      },
      {
        planName: "Team",
        monthlyPrice: "25-30",
        billingType: "Per User / Monthly",
        features: [
          "Higher message limits for GPT-4o",
          "Workspace for team collaboration",
          "Admin console for management",
          "Data excluded from training"
        ],
        customPricing: false
      },
      {
        planName: "Enterprise",
        monthlyPrice: "Custom",
        billingType: "Contact Sales",
        features: [
          "Unlimited, high-speed GPT-4o",
          "Enterprise-grade security & privacy",
          "SSO & Domain verification",
          "Dedicated account management"
        ],
        customPricing: true
      }
    ]
  },
  {
    id: "anthropic-api",
    name: "Anthropic API",
    category: "API",
    website: "https://www.anthropic.com/api",
    description: "Direct access to Claude models via API for developers to build powerful AI applications with reliability and safety.",
    pricingPlans: [
      {
        planName: "Pay-as-you-go",
        monthlyPrice: "Usage-based",
        billingType: "Usage-based",
        features: [
          "Access to all Claude 3.5 & 3 models",
          "Token-based pricing (Input/Output)",
          "Tiered rate limits based on usage history",
          "Developer dashboard & API keys"
        ],
        customPricing: false,
        usageNotes: "Pricing varies by model (Opus, Sonnet, Haiku)."
      }
    ]
  },
  {
    id: "openai-api",
    name: "OpenAI API",
    category: "API",
    website: "https://openai.com/api",
    description: "A comprehensive suite of AI models accessible via API, including GPT-4o, GPT-3.5, Whisper, and Embeddings.",
    pricingPlans: [
      {
        planName: "Pay-as-you-go",
        monthlyPrice: "Usage-based",
        billingType: "Usage-based",
        features: [
          "Access to GPT-4o, o1-preview, and more",
          "Token-based pricing (Input/Output)",
          "Batch API for 50% discount",
          "Fine-tuning capabilities"
        ],
        customPricing: false,
        usageNotes: "Pay for what you use per million tokens."
      }
    ]
  },
  {
    id: "gemini",
    name: "Gemini",
    category: "Chatbot / API",
    website: "https://gemini.google.com",
    description: "Google's most capable AI models, integrated across Google Workspace and available as a standalone assistant and developer API.",
    pricingPlans: [
      {
        planName: "Pro/Advanced",
        monthlyPrice: 20,
        billingType: "Per User / Monthly",
        features: [
          "Access to Gemini 1.5 Pro",
          "Integrated with Google Docs, Gmail, etc.",
          "2TB of Google One storage",
          "Priority access to latest models"
        ],
        customPricing: false
      },
      {
        planName: "API",
        monthlyPrice: "Usage-based",
        billingType: "Usage-based",
        features: [
          "Access via Google AI Studio or Vertex AI",
          "Free tier for Gemini 1.5 Flash (with limits)",
          "Pay-per-token for higher limits",
          "Massive 1M+ context window"
        ],
        customPricing: false
      }
    ]
  },
  {
    id: "windsurf",
    name: "Windsurf",
    category: "IDE",
    website: "https://codeium.com/windsurf",
    description: "An innovative IDE powered by Codeium, featuring advanced context-awareness and 'Flow' for seamless AI-assisted development.",
    pricingPlans: [
      {
        planName: "Pro",
        monthlyPrice: 20,
        billingType: "Per User / Monthly",
        features: [
          "Advanced context indexing",
          "Unlimited high-quality completions",
          "Priority model access",
          "Enhanced multi-file edits"
        ],
        customPricing: false
      }
    ]
  }
];
