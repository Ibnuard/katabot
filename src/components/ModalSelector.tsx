// components/ModalSelector.tsx
"use client";

import { useModal } from "@/context/ModalContext";
import Image from "next/image";

export default function ModalSelector() {
  const { modalType, isVisible, hideModal, modalMessage } = useModal();

  if (!isVisible) return null;

  const modalWidth = modalType === "loading" ? "max-w-[84px] max-h-[84px]" : "";

  return (
    <>
      <dialog open className={`modal modal-open z-50`}>
        <div
          className={`modal-box rounded-lg border border-black p-4 shadow-none font-mono ${modalWidth}`}
        >
          {modalType === "loading" && (
            <div className="flex flex-col items-center justify-center">
              <div className="relative w-8 h-8 rounded-full border-4 border-[var(--accent)] border-t-transparent animate-spin ease-in-out duration-700">
                <div>
                  <Image
                    src="/images/logo_mascot.png"
                    alt="logo"
                    width={16}
                    height={16}
                    priority
                  />
                </div>
              </div>
            </div>
          )}

          {modalType === "popup" && (
            <div className="flex flex-col gap-4">
              <p className="text-sm">{modalMessage || "message"}</p>
              <div className="modal-action">
                <form method="dialog">
                  <button className="btn" onClick={hideModal}>
                    Tutup
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </dialog>
    </>
  );
}
