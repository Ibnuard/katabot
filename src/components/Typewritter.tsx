"use client";

import { useEffect, useState } from "react";

export default function Typewriter({
  text,
  speed = 50,
  pause = 1000,
  className = "",
}: {
  text: string;
  speed?: number; // kecepatan mengetik/menghapus per karakter (ms)
  pause?: number; // jeda sebelum mulai hapus atau mulai ulang (ms)
  className?: string;
}) {
  const [displayedText, setDisplayedText] = useState("");
  const [index, setIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const handleTyping = () => {
      if (!isDeleting) {
        if (index < text.length) {
          setDisplayedText(text.slice(0, index + 1));
          setIndex(index + 1);
        } else {
          // sudah selesai ngetik, tunggu sebentar lalu mulai hapus
          setTimeout(() => setIsDeleting(true), pause);
        }
      } else {
        if (index > 0) {
          setDisplayedText(text.slice(0, index - 1));
          setIndex(index - 1);
        } else {
          // selesai menghapus, tunggu sebentar lalu mulai ulang
          setTimeout(() => setIsDeleting(false), pause);
        }
      }
    };

    const timer = setTimeout(handleTyping, speed);

    return () => clearTimeout(timer);
  }, [index, isDeleting, text, speed, pause]);

  return (
    <span className={className}>
      {displayedText}
      <span className="animate-pulse">|</span>
    </span>
  );
}
