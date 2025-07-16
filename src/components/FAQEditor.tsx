"use client";

import { useState } from "react";

type FAQ = {
  value: string[];
  setValue: (value: string[]) => void;
  isCreator?: boolean;
};

export default function FAQEditor({ value, setValue, isCreator }: FAQ) {
  //const [faqList, setFaqList] = useState<string[]>([]);
  const [newFAQ, setNewFAQ] = useState<string>("");
  const [isAdding, setIsAdding] = useState(false);

  const handleAddClick = () => {
    setIsAdding(true);
  };

  const handleSaveFAQ = () => {
    if (newFAQ.trim() === "") return;
    setValue([...value, newFAQ.trim()]);
    setNewFAQ("");
    setIsAdding(false);
  };

  const handleDeleteFAQ = (index: number) => {
    setValue(value.filter((_, i) => i !== index));
  };

  return (
    <div className="flex flex-col gap-2.5">
      <p className="text-sm font-mono text-black">
        Daftar pertanyaan apa yang sering ditanyakan?
      </p>

      <div className="card p-2.5">
        <div className="card-title flex flex-row justify-between items-center">
          <span className="font-semibold">FAQ</span>
          {isCreator && (
            <button className="btn btn-sm" onClick={handleAddClick}>
              Tambah FAQ
            </button>
          )}
        </div>

        <div
          className={`flex flex-col gap-2 ${
            isAdding || value.length > 0 ? "card-body" : ""
          }`}
        >
          {/* List FAQ */}
          {value.map((faq, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-2 bg-gray-50 border rounded"
            >
              <span className="text-sm">{faq}</span>
              {isCreator && (
                <button
                  className="btn btn-xs btn-error text-white"
                  onClick={() => handleDeleteFAQ(index)}
                >
                  ❌
                </button>
              )}
            </div>
          ))}

          {/* Input FAQ baru – muncul di paling bawah */}
          {isAdding && (
            <div className="flex items-center gap-2 mt-2">
              <input
                type="text"
                value={newFAQ}
                onChange={(e) => setNewFAQ(e.target.value)}
                placeholder="Tulis pertanyaan..."
                className="input input-bordered w-full"
              />
              <button className="btn btn-sm" onClick={handleSaveFAQ}>
                Simpan
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
