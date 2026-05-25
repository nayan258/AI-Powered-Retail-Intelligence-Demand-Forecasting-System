# SmartRetail AI - Predictive Retail Analytics Platform

SmartRetail AI is an advanced, visually stunning, dark-themed retail analytics system built entirely in modern React and Next.js. It features a complete pipeline for processing retail data to generate actionable insights, visualize trends, and perform ML-like analytics natively in the browser and across server routes.

## Features

- **Executive Dashboard:** High-level KPIs, animated metric cards, regional sales distribution, and revenue trends.
- **Sales Analytics:** Interactive deep-dive into product performance and category distributions using Recharts.
- **AI Demand Forecasting:** Advanced time-series projection mimicking predictive models for 7/14/30/60 day sales forecasts.
- **Customer Segmentation:** Automated approximate RFM (Recency, Frequency, Monetary) clustering mapping users into High-Value, Loyal, At-Risk, and New segments.
- **Fraud / Anomaly Detection:** Statistical variance-based Outlier detection scoring isolating suspicious or highly abnormal transaction spikes.
- **Inventory Optimization:** Velocity-based restock recommendations.
- **AI Business Insight Generator:** Dynamic context-aware insights powered by Gemini APIs to process the data summaries and output plain-english recommendations.

## Tech Stack

- **Frontend Framework:** Next.js (App Router), React 19
- **Styling:** Tailwind CSS, Framer Motion (for animations)
- **Data Visualization:** Recharts
- **Icons:** Lucide React
- **AI Engine:** Google Gemini SDK (`@google/genai`)
- **Data Processing:** Native TypeScript (approximate KMeans, Z-Score, and Time-Series Modeling)

## Installation & Usage

1. **Install Dependencies:**
   \`\`\`bash
   npm install
   \`\`\`

2. **Configure Environment:**
   Create a \`.env\` file in the root directory and add your Gemini API Key:
   \`\`\`env
   GEMINI_API_KEY=your_api_key_here
   \`\`\`

3. **Start Development Server:**
   \`\`\`bash
   npm run dev
   \`\`\`

4. **Access:**
   Navigate to \`http://localhost:3000\`.
   The application includes a standard demo login screen (any ID/Password combo works).

## Data Generation
A robust synthetic data generator is bundled natively into the application (`lib/data.ts`) producing thousands of rows of realistic sales data based on seeded randomization for consistent visualizations.
