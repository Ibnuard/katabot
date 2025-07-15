"use client";

import { useModal } from "@/context/ModalContext";
import { supabase } from "@/lib/supabase";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AppHeader() {
  const router = useRouter();
  const [userAvatar, setUserAvatar] = useState<string | null>(null);
  const { setModalType, showModal, hideModal } = useModal();
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        const avatarUrl = user.user_metadata?.avatar_url ?? null;
        setUserAvatar(avatarUrl);
        setIsAuth(true);
      } catch (e) {
        console.error("Gagal parse user dari localStorage", e);
        setIsAuth(false);
      }
    }
  }, []);

  const handleLogout = async () => {
    setModalType("loading");
    showModal();

    await supabase.auth.signOut();
    localStorage.removeItem("user");
    hideModal();
    router.replace("/");
  };

  return (
    <header className="navbar bg-white shadow-sm fixed top-0 z-50 px-8">
      <div className="flex-1">
        <div onClick={() => router.replace("/")}>
          <Image
            className="hover:cursor-pointer"
            src="/images/logo.png"
            alt="logo"
            width={128}
            height={32}
            priority
          />
        </div>
      </div>
      {isAuth && (
        <div className="dropdown dropdown-end">
          <div
            tabIndex={0}
            role="button"
            className="btn-circle avatar cursor-pointer"
          >
            <div className="w-8 rounded-full">
              {!userAvatar ? (
                <div className="w-8 h-8 rounded-full bg-primary"></div>
              ) : (
                <img alt="User Profile" src={userAvatar || ""} />
              )}
            </div>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content rounded-box z-1 mt-3 w-52 p-2 shadow"
          >
            <li>
              <a
                onClick={handleLogout}
                className="font-mono font-semibold hover:text-red-400"
              >
                Logout
              </a>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
