# Rayeva — AI-Powered Sustainable Commerce Platform

Rayeva is a **B2B sustainable commerce intelligence platform** that uses AI (Google Gemini) to automate product cataloging, generate strategic procurement proposals, quantify environmental impact, and provide automated customer support — all optimized for sustainability-focused businesses.

---

## Table of Contents

- [Architecture Overview](#architecture-overview)
- [AI Pipeline Design](#ai-pipeline-design)
- [Module 1: AI Auto-Category & Tag Generator](#module-1-ai-auto-category--tag-generator)
- [Module 2: AI B2B Proposal Generator](#module-2-ai-b2b-proposal-generator)
- [Module 3: AI Impact Reporting Generator (Planned)](#module-3-ai-impact-reporting-generator-planned)
- [Module 4: AI WhatsApp Support Bot (Planned)](#module-4-ai-whatsapp-support-bot-planned)
- [AI Prompt Design Philosophy](#ai-prompt-design-philosophy)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Testing & Verification](#testing--verification)

---

## Architecture Overview

Every AI module in Rayeva follows a **clean, layered pipeline** that separates concerns across five layers:

```
┌─────────────────────────────────────────────────────────────────────┐
│                        FRONTEND (React + Vite)                      │
│  ProductAI.tsx │ ProposalAI.tsx │ ImpactAI.tsx │ SupportBot.tsx     │
└───────┬─────────────────┬──────────────────┬────────────────────────┘
        │ HTTP POST       │ HTTP POST        │ HTTP POST / Webhook
┌───────▼─────────────────▼──────────────────▼────────────────────────┐
│                       CONTROLLER LAYER                              │
│  product.controller │ proposal.controller │ impact │ whatsapp       │
│  • Validates input                                                  │
│  • Returns structured JSON response                                 │
└───────┬─────────────────┬──────────────────┬────────────────────────┘
        │                 │                  │
┌───────▼─────────────────▼──────────────────▼────────────────────────┐
│                        USE CASE LAYER                               │
│  categorize-product │ generate-proposal │ generate-impact │ support │
│  • Fetches required data from database                              │
│  • Builds AI context (enriches input with DB data)                  │
│  • Calls AIService with the correct prompt                          │
│  • Persists AI output to database                                   │
└───────┬─────────────────┬──────────────────┬────────────────────────┘
        │                 │                  │
┌───────▼─────────────────▼──────────────────▼────────────────────────┐
│                        AI SERVICE LAYER                             │
│  ai.service.ts                                                      │
│  • Calls Google Gemini API with structured output enforcement       │
│  • Uses responseMimeType: 'application/json' + responseSchema       │
│  • Retry logic with exponential backoff (max 3 retries)             │
│  • Logs every interaction to AIInteractionLog (success + failure)   │
└───────┬─────────────────────────────────────────────────────────────┘
        │
┌───────▼─────────────────────────────────────────────────────────────┐
│                     PROMPT + SCHEMA LAYER                           │
│  Each module has:                                                   │
│  • A JSON Schema (entities/*.schema.ts) — defines AI output shape  │
│  • A Prompt file (prompts/*.prompt.ts) — system + user templates    │
│  • Registered in PromptRegistry for centralized management          │
└─────────────────────────────────────────────────────────────────────┘
```

### Data Flow (Every Module)

```
User Input → Controller (validate) → Use Case (enrich from DB) → AIService (call Gemini)
                                                                       ↓
                                             ← JSON Response ← Gemini API (structured output)
                                                                       ↓
                                                              Log to AIInteractionLog
                                                                       ↓
                                                              Persist result to DB
                                                                       ↓
                                                              Return to Frontend
```

---

## AI Pipeline Design

The core of Rayeva is the `AIService` class. It provides a single `execute<T>()` method that every module uses:

```typescript
// ai.service.ts — Simplified
async execute<T>(params: {
    systemPrompt: string;        // AI persona and rules
    userPrompt: string;          // Dynamic input with context
    jsonSchema: any;             // Forces Gemini to return this exact shape
    metadata: PromptMetadata;    // For logging (module name, version, prompt ID)
    model?: string;              // Default: gemini-1.5-flash
}): Promise<AIResponse<T>>
```

**Key design decisions:**
- **Structured output enforcement**: Gemini's `responseMimeType: 'application/json'` + `responseSchema` ensures the AI always returns valid, parseable JSON matching our schema — no regex parsing or fragile text extraction.
- **Automatic retry**: Up to 3 attempts with exponential backoff (2s → 4s → 8s).
- **Full audit trail**: Every call (success or failure) is logged to `AIInteractionLog` with latency, payload, and status.

---

## Module 1: AI Auto-Category & Tag Generator
**Status: ✅ Implemented**

### What It Does
Takes a product title and description and uses AI to generate structured catalog metadata:

| Output | Description |
|---|---|
| **Primary Category** | Main product category (e.g., Home & Garden, Apparel) |
| **Sub-Category** | More specific classification (e.g., Kitchen Utensils) |
| **SEO Tags** | 5–10 high-quality keywords for search discoverability |
| **Sustainability Filters** | Verified eco-attributes (plastic-free, biodegradable, vegan, etc.) |

### AI Persona
**Senior AI Catalog Specialist** — approaches categorization with e-commerce merchandising expertise, focusing on product discoverability and sustainability transparency.

### How It Works

```
POST /api/products/categorize
Body: { title: "Bamboo Coffee Cup", description: "Reusable cup made from..." }
```

```
1. Controller validates title + description
2. Use Case calls AIService with the categorization prompt
3. Gemini returns structured JSON matching CategoryTagSchema
4. Result is persisted to the Product table in PostgreSQL
5. JSON response returned to frontend
```

### Schema Shape
```json
{
  "primaryCategory": "Home & Kitchen",
  "subCategory": "Reusable Drinkware",
  "seoTags": ["bamboo", "reusable", "eco-friendly", "coffee cup", "sustainable"],
  "sustainabilityFilters": ["plastic-free", "biodegradable", "sustainably sourced"]
}
```

### Files
| File | Role |
|---|---|
| `entities/category-tag.schema.ts` | JSON schema for Gemini output |
| `prompts/categorize-product.prompt.ts` | System prompt (v1.1.0) + user template |
| `use-cases/categorize-product.use-case.ts` | Orchestration: AI call → persist to DB |
| `controllers/product.controller.ts` | HTTP layer |
| `frontend/src/views/ProductAI.tsx` | UI: form input + result display |

---

## Module 2: AI B2B Proposal Generator
**Status: ✅ Implemented**

### What It Does
Generates a strategic sustainability procurement proposal for a B2B client, selecting products from the real database that match their budget and sustainability goals.

| Output | Description |
|---|---|
| **Product Mix** | AI-selected products with quantity and strategic reasoning |
| **Budget Utilization** | Percentage of budget used, ensuring no overspend |
| **Cost Breakdown** | Subtotal + eco-savings/credits |
| **Impact Summary** | Executive-level sustainability positioning statement |

### AI Persona
**Senior Sustainability Strategy Consultant** — thinks like a procurement advisor, balancing budget efficiency with maximum environmental impact.

### How It Works

```
POST /api/proposals/generate
Body: { customerName: "Eco-Hotels", budgetLimit: 1500, sustainabilityPreferences: ["Plastic-free", "FSC Certified"] }
```

```
1. Controller validates input and checks sustainability preferences
2. Use Case fetches ALL products from the Product table
3. Products are formatted into a catalog string with prices and sustainability filters
4. Gemini receives the catalog + budget + preferences and selects an optimal mix
5. Result is persisted to the Proposal table
6. Frontend displays product mix, financial breakdown, and impact summary
```

### Schema Shape
```json
{
  "budgetUtilization": 87.5,
  "productMix": [
    {
      "productId": "uuid-123",
      "productName": "Bamboo Coffee Cup",
      "quantity": 50,
      "reasoning": "Directly addresses plastic-free preference with high sustainability impact."
    }
  ],
  "costBreakdown": {
    "subtotal": 1312.50,
    "savings": 75.00
  },
  "impactSummary": "This proposal strategically positions Eco-Hotels as a leader in..."
}
```

### Files
| File | Role |
|---|---|
| `entities/proposal.schema.ts` | JSON schema for Gemini output |
| `prompts/generate-proposal.prompt.ts` | System prompt (v1.1.0) + user template |
| `use-cases/generate-proposal.use-case.ts` | Orchestration: fetch products → AI call → persist |
| `controllers/proposal.controller.ts` | HTTP layer |
| `frontend/src/views/ProposalAI.tsx` | UI: form + curated product mix + financial breakdown |

---

## Module 3: AI Impact Reporting Generator (Planned)
**Status: 🔮 Future Implementation**

### What It Will Do
When a B2B order is placed, generate a **quantified environmental impact report** using AI-driven estimation logic.

| Output | Description |
|---|---|
| **Plastic Saved (kg)** | Estimated by comparing sustainable materials vs conventional plastic |
| **Carbon Avoided (kg CO₂)** | Lifecycle emission difference vs non-sustainable alternatives |
| **Local Sourcing Impact** | Summary of how the order supports local supply chains |
| **Executive Impact Statement** | Board-ready paragraph stored with the order |

### Planned AI Persona
**Senior Environmental Data Analyst** — uses industry benchmarks to produce conservative, credible estimates.

### Implementation Architecture

```
POST /api/impact/generate
Body: { customerName: "GreenCorp", items: [{ productId: "uuid", quantity: 50 }] }
```

```
1. Controller validates order items
2. Use Case fetches each product's sustainability filters from the Product table
3. Enriched product data (materials, categories, filters) sent to Gemini
4. Gemini estimates impact using hardcoded industry benchmarks in the prompt:
   - Bamboo vs plastic: ~0.3 kg plastic saved per unit
   - Recycled vs virgin material: ~0.8 kg CO2 saved per unit
   - Locally sourced vs imported: ~0.5 kg CO2 saved per unit
5. AI returns per-product breakdown + aggregate totals + executive statement
6. Result stored in the Order.impactReport field (JSON)
```

### Planned Schema Shape
```json
{
  "plasticSavedKg": 15.0,
  "carbonAvoidedKgCo2": 40.0,
  "localSourcingImpact": "This order supports 3 local manufacturers...",
  "executiveImpactStatement": "GreenCorp's procurement of 50 bamboo units...",
  "breakdownByProduct": [
    {
      "productName": "Bamboo Coffee Cup",
      "quantity": 50,
      "plasticSavedKg": 15.0,
      "carbonAvoidedKgCo2": 40.0,
      "reasoning": "Bamboo replaces single-use polypropylene..."
    }
  ]
}
```

### New Files Required
| File | Role |
|---|---|
| `entities/impact.schema.ts` | JSON schema for impact output |
| `prompts/generate-impact.prompt.ts` | Prompt with estimation benchmarks |
| `use-cases/generate-impact.use-case.ts` | Fetch product data → AI call → store on Order |
| `controllers/impact.controller.ts` | HTTP layer |
| `prisma/schema.prisma` (modify) | Add `Order` model with `impactReport` JSON field |
| `frontend/src/views/ImpactAI.tsx` | UI: environmental scorecard + breakdown table |

---

## Module 4: AI WhatsApp Support Bot (Planned)
**Status: 🔮 Future Implementation**

### What It Will Do
A conversational AI agent connected to WhatsApp (via Twilio or Meta Cloud API) that answers customer queries using **real database data**, handles return policies, escalates critical issues, and logs every conversation.

| Capability | Description |
|---|---|
| **Order Status Queries** | AI queries the Order table in real-time to provide accurate tracking info |
| **Return Policy Handling** | Answers policy questions using embedded business rules in the prompt |
| **Priority Escalation** | Automatically flags refund requests, damage reports, and urgent issues |
| **Conversation Logging** | Full message thread stored in PostgreSQL for audit compliance |

### Planned AI Persona
**Rayeva Operations Concierge** — professional and warm, suitable for B2B communication. Equipped with strict escalation rules.

### Implementation Architecture

```
                    ┌──────────────────────────────────┐
                    │    Customer sends WhatsApp msg    │
                    └───────────────┬──────────────────┘
                                    │
                    ┌───────────────▼──────────────────┐
                    │     Twilio / Meta Cloud API       │
                    │   (forwards to webhook URL)       │
                    └───────────────┬──────────────────┘
                                    │
                    ┌───────────────▼──────────────────┐
                    │  POST /api/whatsapp/webhook       │
                    │  whatsapp.controller.ts           │
                    └───────────────┬──────────────────┘
                                    │
                    ┌───────────────▼──────────────────┐
                    │  handle-support-message.use-case  │
                    │                                   │
                    │  1. Load or create conversation   │
                    │  2. Detect order ID in message     │
                    │  3. Fetch order data from DB       │
                    │  4. Build context (history + data) │
                    │  5. Call Gemini                    │
                    │  6. Check action: ESCALATE?        │
                    │  7. Save reply to conversation     │
                    └───────────────┬──────────────────┘
                                    │
              ┌─────────────────────┼─────────────────────┐
              │                     │                     │
     ┌────────▼───────┐  ┌─────────▼────────┐  ┌─────────▼────────┐
     │  action: REPLY  │  │ action: ESCALATE │  │ action: RESOLVE  │
     │  Send response  │  │ Flag for human   │  │ Close ticket     │
     │  back to user   │  │ Notify admin     │  │ Mark resolved    │
     └────────────────┘  └──────────────────┘  └──────────────────┘
```

### Escalation Triggers (Hardcoded in Prompt)
The AI **must** escalate when the customer mentions:
- Refund requests
- Damaged or defective products
- Urgent or emergency situations
- Legal threats or complaints
- Requests to speak with a human

### Planned Schema Shape (AI Response)
```json
{
  "reply": "Hi! Your order ORD-4521 was shipped on March 3rd and is expected to arrive by March 7th.",
  "action": "REPLY",
  "escalationReason": "",
  "dataUsed": ["Order lookup: ORD-4521"]
}
```

### New Files Required
| File | Role |
|---|---|
| `entities/support-response.schema.ts` | JSON schema with action enum (REPLY/ESCALATE/RESOLVE) |
| `prompts/support-bot.prompt.ts` | Concierge persona + escalation rules + return policy |
| `use-cases/handle-support-message.use-case.ts` | Conversation management + DB queries + AI call |
| `controllers/whatsapp.controller.ts` | Webhook handler + Twilio/Meta reply API |
| `prisma/schema.prisma` (modify) | Add `SupportConversation` model |
| `frontend/src/views/SupportBot.tsx` | UI: conversation feed + escalation alerts |

---

## AI Prompt Design Philosophy

Rayeva uses a deliberate, multi-layered approach to prompt engineering. Every prompt in the system is designed with the following principles:

### 1. Professional Persona Assignment

Each module assigns the AI a **specific expert role** with clear domain expertise:

| Module | Persona | Why |
|---|---|---|
| Product AI | Senior AI Catalog Specialist | E-commerce merchandising expertise for accurate categorization |
| Proposal AI | Senior Sustainability Strategy Consultant | Strategic procurement thinking for budget-optimal proposals |
| Impact AI | Senior Environmental Data Analyst | Quantitative, evidence-based environmental estimation |
| WhatsApp Bot | Rayeva Operations Concierge | Professional yet warm B2B communication style |

**Why it matters**: A persona gives the AI a consistent "mindset." Instead of generic responses, the AI's output reflects domain-specific vocabulary, priorities, and decision-making logic.

### 2. Structured Rule Sections

Every prompt is divided into clearly labeled sections using visual separators:

```
--------------------------------------------------
CATEGORY SELECTION RULES
--------------------------------------------------

1. Choose the most appropriate primary category...
2. Avoid overly generic categorization...
```

**Why it matters**: LLMs process instructions more reliably when they're organized into discrete, labeled blocks. This prevents rules from being ignored or conflated.

### 3. Constrained Output via JSON Schema

Rayeva does **not** rely on the AI to format its own output. Instead, every prompt is paired with a strict JSON schema that is passed directly to Gemini's `responseSchema` parameter:

```typescript
// In ai.service.ts
config: {
    responseMimeType: 'application/json',  // Forces JSON output
    responseSchema: jsonSchema.schema,      // Forces exact shape
}
```

**Why it matters**: This eliminates parsing failures. The AI cannot return markdown, explanations, or malformed JSON — Gemini enforces the schema at the API level.

### 4. Negative Constraints ("Do NOT")

Every prompt explicitly states what the AI should **avoid**:

```
Do NOT include:
• explanations
• markdown
• commentary
• additional text
```

**Why it matters**: Without negative constraints, LLMs tend to add helpful explanations or formatting that breaks downstream parsing. Explicit "do not" rules reduce this behavior significantly.

### 5. Domain-Specific Benchmarks (Module 3)

For quantitative tasks, the prompt **provides reference data** rather than letting the AI invent numbers:

```
ESTIMATION BENCHMARKS:
• Bamboo replacing plastic: ~0.3 kg plastic saved per unit
• Recycled vs virgin material: ~0.8 kg CO2 saved per unit
```

**Why it matters**: Without benchmarks, LLMs often generate impressive-sounding but unreliable numbers. Embedding reference data in the prompt grounds the AI's calculations in real-world estimates.

### 6. Escalation Logic (Module 4)

For critical operations, the prompt includes **mandatory behavioral rules** that override the AI's default helpfulness:

```
You MUST set action to "ESCALATE" if the customer mentions:
- Refund requests
- Damaged or defective products
- Urgent or emergency situations
```

**Why it matters**: In production systems, you cannot trust the AI to always make correct judgment calls about sensitive issues. Hardcoded escalation triggers act as safety guardrails.

### 7. Prompt Versioning

Every prompt includes metadata with a semantic version:

```typescript
metadata: {
    id: "categorize-product",
    version: "1.1.0",
    module: "Module 1",
}
```

**Why it matters**: When you update a prompt, the version is logged alongside every AI interaction. This allows you to trace quality changes back to specific prompt updates and A/B test different versions.

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18 + TypeScript + Vite + Framer Motion |
| **Backend** | Node.js + Express + TypeScript |
| **AI Engine** | Google Gemini API (`@google/genai` SDK) |
| **Database** | PostgreSQL (hosted on Neon) |
| **ORM** | Prisma |
| **Styling** | Vanilla CSS + Tailwind utilities |

---

## Project Structure

```
Rayeva/
├── backend/
│   ├── prisma/
│   │   └── schema.prisma              # Data models (Product, Proposal, AIInteractionLog)
│   ├── src/
│   │   ├── config/                     # Environment config
│   │   ├── controllers/               # HTTP handlers (product, proposal, stats)
│   │   ├── entities/                   # JSON schemas for AI structured output
│   │   │   ├── category-tag.schema.ts  # Module 1 output shape
│   │   │   └── proposal.schema.ts      # Module 2 output shape
│   │   ├── repositories/              # Prisma client
│   │   ├── services/
│   │   │   ├── ai.service.ts           # Core Gemini integration (shared by all modules)
│   │   │   └── prompts/               # AI prompt definitions
│   │   │       ├── index.ts            # BasePrompt interface + PromptRegistry
│   │   │       ├── categorize-product.prompt.ts  # Module 1 prompt
│   │   │       └── generate-proposal.prompt.ts   # Module 2 prompt
│   │   ├── use-cases/                 # Business logic orchestrators
│   │   │   ├── categorize-product.use-case.ts
│   │   │   └── generate-proposal.use-case.ts
│   │   ├── app.ts                      # Express app + route registration
│   │   └── index.ts                    # Server entry point
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── layout/                 # Sidebar, Layout shell
│   │   ├── views/
│   │   │   ├── Dashboard.tsx           # AI Insights Hub (live stats)
│   │   │   ├── ProductAI.tsx           # Module 1 UI
│   │   │   ├── ProposalAI.tsx          # Module 2 UI
│   │   │   └── AILogs.tsx              # Real-time audit log viewer
│   │   ├── services/
│   │   │   └── api.ts                  # Axios API client
│   │   └── index.css                   # Global design system
│   └── package.json
│
└── README.md
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL database (or a Neon account)
- Google Gemini API key

### Environment Variables
Create `backend/.env`:
```env
DATABASE_URL="postgresql://user:pass@host:5432/rayeva?sslmode=require"
GEMINI_API_KEY="your-gemini-api-key"
PORT=3000
```

### Installation
```bash
# Install backend dependencies
cd backend
npm install

# Run database migrations
npx prisma migrate dev

# Seed product data
npx ts-node seed-products.ts

# Install frontend dependencies
cd ../frontend
npm install
```

---

## Testing & Verification

### 1. Start the Backend
```bash
cd backend
npm run dev
```
Server starts on `http://localhost:3000`.

### 2. Start the Frontend
```bash
cd frontend
npm run dev
```
App starts on `http://localhost:5173`.

### 3. Module 1: Product AI Categorizer
1. Navigate to the **Product AI** tab via the sidebar.
2. Enter a product like "Reusable Bamboo Coffee Cup" and a description.
3. Click **Run Categorization**.
4. **Verify**: You should see AI-generated categories, SEO tags, and sustainability filters.

### 4. Module 2: B2B Proposal Builder
1. Navigate to the **Proposal AI** tab.
2. Enter a client name (e.g., "Eco-Hotels Inc").
3. Set a budget (e.g., `1500`).
4. Select at least two sustainability preferences (e.g., `Plastic-free`, `FSC Certified`).
5. Click **Generate AI Proposal**.
6. **Verify**: The AI will curate a product mix, provide a financial breakdown, and generate an impact summary. Use the **View JSON** toggle to inspect the raw structured output.

### 5. Audit & Verification
- **AI Logs**: Go to the **AI Logs** tab to see real-time interaction metadata (latency, model, status) for all AI decisions.
- **Dashboard**: The **AI Insights Hub** shows live performance stats including total interactions, success rates, and average latency.
- **Database**: Run `npx ts-node verify-db.ts` in the `backend` folder to inspect stored records directly.
