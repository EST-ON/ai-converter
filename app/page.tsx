"use client";
import { useState } from "react";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [markdown, setMarkdown] = useState("");
  const [loading, setLoading] = useState(false);

  const handleConvert = async () => {
    if (!file) return alert("Файлды таңдаңыз!");
    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://127.0.0.1:8000/convert", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (response.ok) {
        setMarkdown(data.markdown);
      } else {
        alert("Қате: " + data.detail);
      }
    } catch (error) {
      alert("Backend серверімен байланыс жоқ! (Python терминалын тексеріңіз)");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-white p-8 font-sans text-black">
      <div className="max-w-2xl mx-auto space-y-8">
        <header className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-blue-600">AI Document Converter</h1>
          <p className="text-gray-500">PDF немесе Excel файлдарын AI түсінетін форматқа айналдыру</p>
        </header>

        <div className="border-2 border-dashed border-gray-200 rounded-xl p-12 text-center bg-gray-50">
          <input 
            type="file" 
            onChange={(e) => setFile(e.target.files?.[0] || null)} 
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 mb-6"
          />
          <button 
            onClick={handleConvert}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition disabled:bg-gray-400"
          >
            {loading ? "Түрлендіруде..." : "Түрлендіру (Transform now)"}
          </button>
        </div>

        {markdown && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold">Нәтиже:</h2>
            <div className="p-6 bg-gray-900 rounded-lg text-green-400 overflow-auto max-h-96 whitespace-pre-wrap font-mono text-sm shadow-2xl">
              {markdown}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}