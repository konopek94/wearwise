"use client";

import React, { useState, useRef } from "react";
import Tesseract from "tesseract.js";
import { Dictionary } from "../types";
import { Locale } from "../i18n-config";

interface InputFormProps {
  onAnalyze: (text: string) => void;
  isLoading: boolean;
  dictionary: Dictionary["inputForm"];
  lang: Locale;
  errorMessages: Dictionary["error"];
}

const tesseractLangMap: Record<Locale, string> = {
  en: "eng",
  pl: "pol",
  de: "deu",
  es: "spa",
};

export default function InputForm({ onAnalyze, isLoading, dictionary, lang, errorMessages }: InputFormProps) {
  const [text, setText] = useState("");
  const [ocrLoading, setOcrLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setOcrLoading(true);
    try {
      const tesseractLang = tesseractLangMap[lang] || "eng";
      const result = await Tesseract.recognize(file, tesseractLang, {
        logger: (m) => console.log(m),
      });
      setText((prev) => (prev ? prev + "\n" + result.data.text : result.data.text));
    } catch (error) {
      console.error("OCR failed:", error);
      alert(errorMessages.ocrFailed);
    } finally {
      setOcrLoading(false);
      // Reset file input so the same file can be uploaded again
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim() && !isLoading && !ocrLoading) {
      onAnalyze(text);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-3xl space-y-8">
      <div className="flex flex-col space-y-4">
        <label htmlFor="text-input" className="text-sm font-semibold text-primary-design uppercase tracking-widest">
          {dictionary.label}
        </label>
        <textarea
          id="text-input"
          value={text}
          onChange={handleTextChange}
          placeholder={dictionary.placeholder}
          className="w-full p-6 bg-surface-low border-none rounded-lg shadow-inner focus:bg-surface-lowest focus:ring-0 focus:shadow-ambient transition-all duration-300 min-h-48 text-xl text-on-surface placeholder:text-surface-highest/60 leading-relaxed font-light"
          disabled={isLoading || ocrLoading}
        />
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-6">
        <div className="relative w-full sm:w-auto">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            ref={fileInputRef}
            className="hidden"
            id="image-upload"
            disabled={isLoading || ocrLoading}
          />
          <label
            htmlFor="image-upload"
            className="cursor-pointer w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 border-none shadow-ambient text-base font-semibold rounded-lg text-on-surface bg-surface-highest hover:bg-surface-highest/80 transition-all active:scale-95 disabled:opacity-50"
          >
            {ocrLoading ? (
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 bg-on-surface rounded-full animate-bounce"></span>
                {dictionary.scanning}
              </span>
            ) : dictionary.uploadButton}
          </label>
        </div>

        <button
          type="submit"
          disabled={!text.trim() || isLoading || ocrLoading}
          className="w-full sm:w-auto inline-flex items-center justify-center px-12 py-4 border-none text-lg font-bold rounded-lg shadow-ambient text-white bg-secondary-design hover:bg-secondary-design/90 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <span className="flex items-center gap-3">
              <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
              {dictionary.analyzing}
            </span>
          ) : dictionary.analyzeButton}
        </button>
      </div>
    </form>
  );
}