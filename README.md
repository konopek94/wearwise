# 👕 WearWise

**WearWise** is an AI-powered web application designed to help consumers make smarter, more sustainable choices about the clothing and footwear they buy. 

Have you ever looked at a clothing label and wondered what "60% Recycled Polyester, 40% Viscose" actually means for the environment, how long the garment will last, or if it will be comfortable? WearWise solves this problem. 

By analyzing the material composition of products, WearWise evaluates them across three key metrics:
- 🌱 **Sustainability:** Is it eco-friendly, biodegradable, or made from recycled materials?
- 🛡️ **Durability:** Will it last long and resist wear and tear?
- ☁️ **Comfort:** Is it breathable, soft, and suitable for skin contact?

It also detects the risk of **microplastics shedding** (a major environmental concern with synthetic fabrics) and provides a clear, actionable verdict: **"Buy"**, **"Consider"**, or **"Avoid"**. 

Whether you're shopping online and copy-pasting the material breakdown, or checking a label in a store and snapping a quick photo, WearWise gives you the insights you need to build a better, greener wardrobe.

---

## ✨ Features

- **Text Input:** Manually enter the product name or material composition directly into the app.
- **Image Upload (OCR):** Upload a photo of a clothing label, and the app will automatically extract the text using client-side OCR (Tesseract.js).
- **AI Analysis:** Uses Google Gemini AI to parse materials, normalize composition, and score the product.
- **Results Dashboard:** View visual progress bars for sustainability, durability, and comfort, along with a final verdict and a short summary explaining the reasoning.
- **Internationalization (i18n):** Full support for English, Polish, German, and Spanish with automatic locale detection.
- **Persistent Closet:** Save your items to a permanent wardrobe dashboard (powered by Supabase).
- **Wardrobe Analytics:** Get aggregated insights on your collection's sustainability index and material mix.

## 🛠 Tech Stack

- **Frontend:** Next.js 16 (App Router), React 19, Tailwind CSS v4
- **Backend:** Supabase (Auth + PostgreSQL)
- **AI Integration:** Google Gemini 2.5 Flash
- **OCR:** Tesseract.js (Client-side, localized)

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- A Google Gemini API Key
- A Supabase Project (URL and Anon Key)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/wearwise.git
   cd wearwise
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root:
   ```env
   GEMINI_API_KEY=your_gemini_key
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

### Running the Development Server

Start the Next.js development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

## 🧪 Testing Locally

### 1. Internationalization
- Visit `/en`, `/pl`, `/de`, or `/es` to see the localized UI.
- Use the **Language Switcher** in the top-right glass bar to toggle languages.
- Upload a label in a specific language; the OCR will automatically use the correct language pack.

### 2. Authentication & Closet
- Go to `/en/login` and enter your email. You will receive a **Magic Link** in your email (check your Supabase dashboard > Auth > Users if testing with a mock email).
- Once logged in, analyze any product and click **"Add to Closet"**.
- Visit `/en/closet` to see your saved items and the **Analytics Dashboard**.

### 3. History Migration
- Use the app while logged out to create some "Recent Searches" (stored in `localStorage`).
- Sign in via the login page.
- On the home page, the app will automatically detect your local history and migrate it to your Supabase Closet.

## 🌍 Deployment

The easiest way to deploy this Next.js app is to use [Vercel](https://vercel.com/). 

1. Push your code to GitHub.
2. Import the project in Vercel.
3. Add the `GEMINI_API_KEY` environment variable in the Vercel project settings.
4. Deploy!

## 📄 License

MIT