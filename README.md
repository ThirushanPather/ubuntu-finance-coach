# Ubuntu Finance Coach

**An AI-powered financial literacy platform empowering unbanked South Africans with instant access to personalized budgeting and savings guidance.**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-18.0-blue.svg)](https://reactjs.org/)
[![Claude AI](https://img.shields.io/badge/AI-Claude%20Sonnet%204.5-purple.svg)](https://www.anthropic.com/)

---

## 📖 Table of Contents

- [Overview](#overview)
- [Problem Statement](#problem-statement)
- [Solution](#solution)
- [Architecture](#architecture)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Installation & Setup](#installation--setup)
- [Usage](#usage)
- [Agent System](#agent-system)
- [Context Management](#context-management)
- [File Structure](#file-structure)
- [Future Roadmap](#future-roadmap)
- [Contributing](#contributing)
- [License](#license)

---

## 🌍 Overview

**Ubuntu Finance Coach** is a conversational AI financial companion designed specifically for the **18 million financially illiterate, unbanked South Africans**. Built on the philosophy of Ubuntu ("I am because we are"), the platform provides:

- ✅ **AI-powered budget creation** through natural conversation
- ✅ **Cash-first design** - no bank account required
- ✅ **Multi-language support** - Zulu, Xhosa, Sotho, Afrikaans
- ✅ **Culturally authentic** - understands stokvels, burial societies, extended family obligations
- ✅ **Compliance-first** - built-in FAIS regulatory guardrails

**Target Users:** Low-income South Africans managing cash income (SASSA grants, piece jobs, stokvels) without access to traditional banking or financial tools.

---

## 🎯 Problem Statement

**How do we enable 2.7 million (15%) of the 18 million financially illiterate, unbanked South Africans to achieve financial literacy and structured money management by December 2026?**

### The Gap
- **18 million** South Africans are financially illiterate
- **11 million** adults have no bank accounts
- **68%** live paycheck-to-paycheck with zero savings
- **93%** have mobile phone access (distribution channel exists!)

Existing solutions (22seven, banking apps) require bank accounts and assume financial literacy. **Ubuntu Finance Coach fills this gap.**

---

## 💡 Solution

Ubuntu Finance Coach is a **voice-first, AI-powered cash management companion** that:

### 1. Removes Barriers
- ❌ No bank account required
- ❌ No financial literacy assumed
- ❌ No forms to fill out
- ✅ Just conversation in your language

### 2. Automates Everything
**User:** "I need help with my budget. My income is R15000"  
**AI Coach:** [Suggests 50/30/20 breakdown]  
**User:** "Yes, create it"  
**AI Coach:** ✅ Budget auto-created with visual progress bars

The AI automatically creates budgets, sets savings goals, and tracks spending through natural conversation.

### 3. Understands South African Context
- Mentions SASSA grants, Capitec, TymeBank
- Understands township economics
- Supports stokvels and burial societies
- Culturally sensitive to extended family obligations

### 4. Ensures Compliance
A two-agent system ensures all financial advice complies with South African FAIS regulations (see [Agent System](#agent-system)).

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        USER INTERFACE                           │
│                    (React + Vite Frontend)                      │
│                                                                 │
│  Dashboard  │  Budget  │  Transactions  │  Savings  │  AI Coach│
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                   STATE MANAGEMENT LAYER                        │
│                    (React Context API)                          │
│                                                                 │
│  • FinanceContext (transactions, budget, goals)                │
│  • localStorage persistence (JSON)                             │
│  • Conversation history (chatMessages)                         │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                        API LAYER                                │
│                  (Vite Proxy → ARK API)                         │
│                                                                 │
│  POST /api/v1/queries → Creates query targeting team           │
│  GET /api/v1/queries/{id} → Polls for response (1s interval)   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    ARK AGENT ORCHESTRATION                      │
│                    (Kubernetes-based)                           │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │          ubuntu-finance-team (Sequential)                │  │
│  │                                                          │  │
│  │  ┌────────────────────┐      ┌────────────────────┐    │  │
│  │  │  Finance Advisor   │ ───► │ Compliance Agent   │    │  │
│  │  │                    │      │                    │    │  │
│  │  │ • Creates budgets  │      │ • Reviews output   │    │  │
│  │  │ • Sets goals       │      │ • Adds FAIS        │    │  │
│  │  │ • Adds transactions│      │   disclaimers      │    │  │
│  │  │ • Financial advice │      │ • Ensures legal    │    │  │
│  │  │                    │      │   compliance       │    │  │
│  │  └────────────────────┘      └────────────────────┘    │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      AI MODEL LAYER                             │
│              (Claude Sonnet 4.5 via LiteLLM)                    │
│                                                                 │
│  Model: claude-sonnet-4-5-20250929                             │
│  Gateway: McKinsey LiteLLM Proxy                               │
└─────────────────────────────────────────────────────────────────┘
```

---

## ✨ Key Features

### 1. AI-Powered Budget Creation
- **Conversational interface** - No forms, just chat
- **Automatic creation** - AI outputs JSON, frontend parses and creates budget
- **50/30/20 rule** - Industry-standard budget allocation
- **Visual progress bars** - See spending vs. budget in real-time

### 2. Savings Goals Management
- **Flexible goals** - Emergency fund, education, business, etc.
- **Deadline tracking** - Visual countdown to goal date
- **Progress tracking** - Watch your savings grow
- **Add funds** - Balance decreases when money added to goals

### 3. Current Balance Tracking
**Not "Monthly Income" - "Current Balance"**
```
Current Balance = Total Income - Total Expenses - Money in Savings Goals
```
This reflects **real cash on hand** for users managing physical money, not abstract bank balances.

### 4. Multi-Language Support
- Zulu
- Xhosa
- Sotho
- Afrikaans
- English

AI detects language and responds accordingly.

### 5. Compliance Guardrails
Two-agent system ensures FAIS compliance:
- ✅ General financial literacy: Allowed
- ❌ Specific investment products: Blocked with disclaimer
- ❌ Guaranteed returns: Flagged and corrected

---

## 🛠️ Tech Stack

### Frontend
- **React 18** - Component-based UI
- **Vite** - Build tool and dev server
- **React Context API** - State management
- **localStorage** - Client-side data persistence

### Backend / AI
- **ARK (Agent Runtime for Kubernetes)** - McKinsey's agent orchestration platform
- **Claude Sonnet 4.5** - Anthropic's latest model (`claude-sonnet-4-5-20250929`)
- **McKinsey LiteLLM Gateway** - Model access and quota management
- **Kubernetes** - Agent deployment and scaling

### Deployment
- **Frontend:** Localhost (development) → Vercel/Netlify (production)
- **Backend:** Kubernetes cluster via ARK
- **API Proxy:** Vite dev server proxies `/api` to ARK API

---

## 🚀 Installation & Setup

### Prerequisites
- Node.js 18+
- npm or yarn
- kubectl configured with McKinsey cluster access
- ARK API access token

### 1. Clone Repository
```bash
git clone https://github.com/ThirushanPather/ubuntu-finance-coach.git
cd ubuntu-finance-coach/ubuntu-finance-coach-minimal
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Deploy ARK Agents
```bash
# Deploy Model (if not already deployed)
kubectl apply -f agent-backup.yaml

# Deploy Finance Advisor Agent
kubectl apply -f agent-updated.yaml

# Deploy Compliance Agent
kubectl apply -f ubuntu-compliance-agent.yaml

# Deploy Team (Sequential orchestration)
kubectl apply -f ubuntu-finance-team.yaml

# Verify deployment
kubectl get agents
kubectl get teams
```

### 4. Update API Secret (if needed)
```bash
kubectl create secret generic default-model-token \
  --from-literal=token=YOUR_API_KEY \
  --dry-run=client -o yaml | kubectl apply -f -
```

### 5. Start Port-Forward (Development)
```bash
kubectl port-forward svc/ark-api 8080:80 -n default
```

### 6. Start Frontend
```bash
npm run dev
```

Access at: `http://localhost:3000`

---

## 📱 Usage

### Creating a Budget
1. Open AI Coach tab
2. Say: `"I need help creating a budget. My income is R15000"`
3. AI suggests breakdown
4. Say: `"Yes, create it"`
5. ✅ Budget auto-created in Budget tab

### Setting a Savings Goal
1. In AI Coach: `"I want to save R10000 for an emergency fund by June 2025"`
2. AI calculates timeline
3. Say: `"Yes, create it"`
4. ✅ Goal appears in Savings tab

### Adding a Transaction
1. In AI Coach: `"I just spent R500 on groceries"`
2. ✅ Transaction added, balance updated

### Adding to Savings Goal
1. Go to Savings tab
2. Click "Add Funds" on any goal
3. Enter amount (validates against current balance)
4. ✅ Balance decreases, goal progress increases

---

## 🤖 Agent System

Ubuntu Finance Coach uses a **two-agent sequential team** for responsible AI:

### Agent 1: Finance Advisor (`ubuntu-orchestrator-agent`)
**Role:** Primary financial literacy coach

**Capabilities:**
- Conversational budgeting guidance
- Savings goal recommendations
- Expense tracking advice
- South African context awareness (stokvels, SASSA, etc.)
- Multi-language responses

**Output Format:**
When user approves budget/goal/transaction, outputs structured JSON:
```json
```budget
{"income": 15000, "categories": [...], "totalBudget": 13500}
```
```

**Model:** Claude Sonnet 4.5 (`claude-sonnet-4-5-20250929`)

**Configuration:** `agent-updated.yaml`

---

### Agent 2: Compliance Agent (`ubuntu-compliance-agent`)
**Role:** FAIS regulatory compliance review

**Capabilities:**
- Scans finance advisor output for violations
- Detects specific investment company names (Allan Gray, Sanlam, etc.)
- Detects return guarantees ("10% return", "guaranteed 8%")
- Detects product-specific advice (unit trusts, ETFs, stocks)
- Adds regulatory disclaimers when violations found

**Output Format:**
If violations detected, prepends:
```
⚠️ COMPLIANCE NOTICE: This is general financial literacy guidance only. 
Ubuntu Finance Coach cannot recommend specific investment products. 
For personalized investment advice, consult a licensed Financial Services Provider (FSP).

---

[Original response follows...]
```

**Model:** Claude Sonnet 4.5 (`claude-sonnet-4-5-20250929`)

**Configuration:** `ubuntu-compliance-agent.yaml`

---

### Team Orchestration (`ubuntu-finance-team`)
**Strategy:** Sequential

**Flow:**
1. User sends message
2. **Finance Advisor** processes input with full conversation history
3. Finance Advisor outputs response (may include ```budget/```goal/```transaction blocks)
4. **Compliance Agent** receives Finance Advisor's output
5. Compliance Agent scans for FAIS violations
6. If violations found → adds disclaimer
7. If no violations → passes through unchanged
8. Final response returned to user

**Why Sequential?**
- Separation of concerns (finance logic vs. compliance logic)
- Easy to update compliance rules without touching finance advisor
- Demonstrates responsible AI governance
- Regulatory audit trail (both agent responses logged)

**Configuration:** `ubuntu-finance-team.yaml`

```yaml
apiVersion: ark.mckinsey.com/v1alpha1
kind: Team
metadata:
  name: ubuntu-finance-team
spec:
  strategy: sequential
  members:
    - name: ubuntu-orchestrator-agent
      type: agent
    - name: ubuntu-compliance-agent
      type: agent
```

---

## 💾 Context Management

### How Conversation Context Works

**Problem:** Claude has no memory between API calls. Each request is stateless.

**Solution:** Store full conversation history in browser localStorage and send it with every request.

### Implementation

#### 1. Storage Layer (`localStorage`)
**Location:** Browser's localStorage (client-side)

**Key:** `chatMessages`

**Format:** JSON array
```json
[
  {
    "role": "assistant",
    "content": "Sawubona! 👋 I'm your Ubuntu Finance Coach..."
  },
  {
    "role": "user", 
    "content": "I need help creating a budget. My income is R15000"
  },
  {
    "role": "assistant",
    "content": "Wonderful! Let me help you create a budget..."
  }
]
```

**Persistence:** Survives page refreshes, browser restarts

**Lifecycle:**
- Created on first app load
- Updated after every message exchange
- Cleared when user clicks "Clear Chat" button

---

#### 2. Context Injection (`Chat.jsx`)

**Before sending to ARK API**, the entire conversation history is concatenated into the `input` field:

```javascript
const conversationContext = updatedMessages
  .slice(0, -1) // Exclude current message
  .map(m => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`)
  .join('\n\n');

const fullInput = conversationContext 
  ? `Previous conversation:\n${conversationContext}\n\nCurrent user message: ${input}`
  : input;
```

**Example API payload:**
```json
{
  "name": "query-1234567890",
  "input": "Previous conversation:\nAssistant: Sawubona! ...\nUser: I need help...\nAssistant: ...\n\nCurrent user message: create the budget",
  "targets": [
    {"name": "ubuntu-finance-team", "type": "team"}
  ]
}
```

---

#### 3. Why This Approach?

**Alternative Considered:** ARK's `conversationHistory` parameter
- ❌ Not supported by ARK API (our testing showed it was ignored)

**Chosen Approach:** Embed history in `input` field as text
- ✅ Works with any LLM backend
- ✅ Full control over context format
- ✅ Claude can read and understand conversation flow
- ✅ No server-side database needed

**Trade-offs:**
- ❌ Token usage increases with longer conversations (cost consideration)
- ✅ Complete user privacy (no server-side storage)
- ✅ Works offline (localStorage persists)

---

#### 4. Context Limits

**Current Implementation:**
- No limit on conversation length
- Entire history sent every time
- localStorage max: ~5-10MB (thousands of messages)

**For Production:**
Would implement:
- Sliding window (last 20 messages)
- Summarization of older context
- Server-side conversation storage for multi-device sync

---

### Other Data Persistence

All user data is stored in **browser localStorage** as JSON:

| Key | Data | Format |
|-----|------|--------|
| `chatMessages` | Conversation history | JSON array of message objects |
| `financeUser` | User profile | `{name, monthlyIncome}` |
| `financeTransactions` | Income/expenses | JSON array of transaction objects |
| `financeBudget` | Budget data | `{income, categories, totalBudget}` |
| `financeSavingsGoals` | Savings goals | JSON array of goal objects |
| `financeBadges` | Earned badges | JSON array of badge IDs |
| `financeStreak` | Daily streak | `{current, lastActive}` |

**Why localStorage?**
- ✅ No backend database required (reduces complexity)
- ✅ Instant reads/writes (fast UI updates)
- ✅ Works offline
- ✅ Privacy-first (data never leaves device)
- ✅ Perfect for MVP/hackathon demo

**Production Considerations:**
- Migrate to PostgreSQL/MongoDB for multi-device sync
- Add user authentication
- Enable cloud backup

---

## 📂 File Structure

```
ubuntu-finance-coach-minimal/
├── src/
│   ├── contexts/
│   │   └── FinanceContext.jsx          # Global state management
│   ├── components/
│   │   ├── Chat.jsx                    # AI coach interface
│   │   ├── Chat.css
│   │   ├── Dashboard.jsx               # Overview with current balance
│   │   ├── Dashboard.css
│   │   ├── Budget.jsx                  # Budget management
│   │   ├── Budget.css
│   │   ├── BudgetModal.jsx             # Budget creation form
│   │   ├── BudgetModal.css
│   │   ├── Transactions.jsx            # Transaction CRUD
│   │   ├── Transactions.css
│   │   ├── TransactionModal.jsx        # Transaction form
│   │   ├── TransactionModal.css
│   │   ├── Savings.jsx                 # Goals management
│   │   ├── Savings.css
│   │   ├── SavingsModal.jsx            # Goal creation form
│   │   ├── SavingsModal.css
│   │   └── AddToGoalModal.jsx          # Add funds to goal
│   ├── App.jsx                         # Main app with routing
│   ├── App.css
│   ├── main.jsx                        # React entry point
│   └── index.css                       # Global styles
├── agent-backup.yaml                   # Model configuration
├── agent-updated.yaml                  # Finance advisor agent
├── ubuntu-compliance-agent.yaml        # Compliance agent
├── ubuntu-finance-team.yaml            # Sequential team config
├── package.json
├── vite.config.js                      # Proxy config
└── index.html

Kubernetes Resources:
├── Model: default (Claude Sonnet 4.5)
├── Agents:
│   ├── ubuntu-orchestrator-agent       # Finance advisor
│   └── ubuntu-compliance-agent         # Compliance review
└── Team: ubuntu-finance-team           # Sequential orchestration
```

---

## 🚦 Future Roadmap

### Phase 1: MVP Enhancements (Months 1-3)
- [ ] USSD version for feature phones
- [ ] Offline mode with sync
- [ ] Stokvel multi-member tracking
- [ ] CSV export for transactions
- [ ] Monthly spending reports

### Phase 2: Scale Features (Months 4-6)
- [ ] Backend database (PostgreSQL)
- [ ] User authentication
- [ ] Multi-device sync
- [ ] Push notifications for budget alerts
- [ ] Referral system

### Phase 3: Advanced AI (Months 7-12)
- [ ] Debt payoff planning
- [ ] Investment education (compliant)
- [ ] Predictive budgeting based on patterns
- [ ] Voice input/output (full conversational)
- [ ] Community challenges/leaderboards

### Phase 4: Partnerships (Months 13-18)
- [ ] SASSA integration for grant recipients
- [ ] Bank account upgrade path (Capitec/TymeBank)
- [ ] Zero-rated data (MTN/Vodacom partnerships)
- [ ] Corporate wellness B2B product
- [ ] Ethical financial product marketplace

---

## 🤝 Contributing

We welcome contributions! This project was built for McKinsey's Tech2Impact Hackathon but will continue as open-source.

### Areas for Contribution
- **Translations:** Improve Zulu, Xhosa, Sotho, Afrikaans responses
- **UI/UX:** Accessibility improvements, mobile optimization
- **Features:** USSD version, offline mode, stokvel tools
- **Testing:** Unit tests, integration tests, E2E tests
- **Documentation:** Tutorials, guides, video walkthroughs

### How to Contribute
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **McKinsey & Company** - Tech2Impact Hackathon platform and ARK infrastructure
- **Anthropic** - Claude Sonnet 4.5 AI model
- **South African communities** - Inspiration and user feedback
- **Ubuntu philosophy** - "I am because we are"

---

## 📧 Contact

**Project Lead:** Thirushan Pather  
**GitHub:** [@ThirushanPather](https://github.com/ThirushanPather)  
**Repository:** [ubuntu-finance-coach](https://github.com/ThirushanPather/ubuntu-finance-coach)

---

## 🎯 Hackathon Impact Statement

**Ubuntu Finance Coach addresses a critical gap in South African financial inclusion.**

- **Target:** 2.7 million unbanked users by Dec 2026 (15% of 18M addressable market)
- **Impact:** R16.2 billion in collective savings mobilized
- **Social Good:** Breaking generational poverty through financial literacy
- **SDG Alignment:** SDG 1 (No Poverty), SDG 4 (Education), SDG 10 (Reduced Inequalities)

**Because when one of us rises, we all rise.** 🇿🇦

---

*Built with ❤️ for the Ubuntu Finance Coach - McKinsey Tech2Impact Hackathon 2025*
