"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const getSessionAndRedirect = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (data.session) {
        localStorage.setItem("user", JSON.stringify(data.session.user));
        router.replace("/agents");
      } else {
        router.replace("/"); // fallback kalau gagal login
      }
    };

    getSessionAndRedirect();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center font-mono text-sm">
      Menyiapkan akun Anda...
    </div>
  );
}
