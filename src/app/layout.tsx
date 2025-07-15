import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { ModalProvider } from "@/context/ModalContext";
import ModalSelector from "@/components/ModalSelector";

// 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

const poppinsSans = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Katabot",
  description: "Buat agen chatbot modal ngetik",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppinsSans.variable} antialiased`}>
        <ModalProvider>
          {children}
          <ModalSelector />
        </ModalProvider>
      </body>
    </html>
  );
}
