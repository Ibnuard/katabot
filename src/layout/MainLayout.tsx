import AppHeader from "@/components/AppHeader";
import React from "react";

type TMainLayout = {
  children: React.ReactNode;
};

export default function MainLayout({ children }: TMainLayout) {
  return (
    <div className="w-full">
      <AppHeader />
      <main className="w-full min-h-screen overflow-y-auto mx-auto pt-[5rem] p-2.5">
        {children}
      </main>
    </div>
  );
}
