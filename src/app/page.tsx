"use client";

import Typewriter from "@/components/Typewritter";
import { useModal } from "@/context/ModalContext";
import { supabase } from "@/lib/supabase";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Page() {
  const router = useRouter();
  const { showModal, hideModal, setModalType } = useModal();

  function handleLogin() {
    setModalType("loading");
    showModal();

    supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
      },
    });

    hideModal();
  }

  // Check session when redirected back
  useEffect(() => {
    const checkSession = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (data.session) {
        const user = data.session.user;
        localStorage.setItem("user", JSON.stringify(user));
        router.replace("/agents");
      }

      console.log("Error", error);
    };

    checkSession();
  }, []);

  return (
    <div className="relative grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <div className="absolute inset-0">
        <div className="absolute inset-0 w-full h-full bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem]"></div>
      </div>
      <div className="flex flex-col gap-[48px] row-start-2 items-center z-50">
        <div className="flex flex-col items-center gap-4">
          <Image
            src="/images/logo.png"
            alt="logo"
            width={250}
            height={48}
            priority
          />

          <Typewriter
            text="Buat agen chatbot modal ngetik"
            speed={50}
            pause={1000}
            className="text-sm text-gray-500 font-mono"
          />
        </div>

        <div className="flex flex-row gap-4">
          <button onClick={handleLogin} className="btn gap-2.5">
            <Image src="/google.svg" alt="Google Logo" width={18} height={18} />
            Masuk dulu
          </button>
          <button onClick={() => router.push("/agents")} className="btn">
            Coba aja
          </button>
        </div>

        <a
          href="https://www.linkedin.com/in/ibnuard"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:cursor-pointer absolute bottom-10 font-mono text-sm text-black flex gap-2.5 items-center"
        >
          Lets connect on
          <Image src="/linkedin.svg" alt="Linkedin" width={18} height={18} />
        </a>
      </div>
    </div>
  );
}
