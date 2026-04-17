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
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto space-y-4">
      <div className="flex flex-col space-y-2">
        <label htmlFor="text-input" className="text-sm font-medium text-gray-700">
          {dictionary.label}
        </label>
        <textarea
          id="text-input"
          value={text}
          onChange={handleTextChange}
          placeholder={dictionary.placeholder}
          className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 min-h-30 text-gray-700"
          disabled={isLoading || ocrLoading}
        />
      </div>

      <div className="flex items-center justify-between">
        <div className="relative">
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
            className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {ocrLoading ? dictionary.scanning : dictionary.uploadButton}
          </label>
        </div>

        <button
          type="submit"
          disabled={!text.trim() || isLoading || ocrLoading}
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? dictionary.analyzing : dictionary.analyzeButton}
        </button>
      </div>
    </form>
  );
}