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

## 🛠 Tech Stack

- **Frontend:** Next.js (App Router), React, Tailwind CSS
- **Backend:** Node.js (Next.js API Routes)
- **AI Integration:** Google Gen AI SDK (`@google/genai`)
- **OCR:** Tesseract.js (Client-side)

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- A Google Gemini API Key

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
   Copy the example environment file and add your Google Gemini API key.
   ```bash
   cp .env.example .env.local
   ```
   Open `.env.local` and set your key:
   ```env
   GEMINI_API_KEY=your_api_key_here
   ```

### Running the Development Server

Start the Next.js development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## 🌍 Deployment

The easiest way to deploy this Next.js app is to use [Vercel](https://vercel.com/). 

1. Push your code to GitHub.
2. Import the project in Vercel.
3. Add the `GEMINI_API_KEY` environment variable in the Vercel project settings.
4. Deploy!

## 📄 License

MIT