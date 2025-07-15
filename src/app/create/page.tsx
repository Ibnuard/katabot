"use client";

import { useModal } from "@/context/ModalContext";
import MainLayout from "@/layout/MainLayout";
import { createAgent } from "@/lib/agents";
import { getUser } from "@/lib/user";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page() {
  const [agentName, setAgentName] = useState<string>("");
  const [agentSummary, setAgentSummary] = useState<string>("");
  const [agentDescription, setAgentDescription] = useState<string>("");

  const user = getUser();

  const router = useRouter();

  // modal
  const {
    showModal,
    hideModal,
    setModalType,
    setModalMessage,
    setOnClosePress,
  } = useModal();

  useEffect(() => {
    if (!user) {
      router.replace("/");
    }
  }, []);

  const handleCreateAgent = async () => {
    setModalType("loading");
    showModal();

    try {
      await createAgent(agentName, agentDescription, agentSummary, user?.id!);
      setModalMessage("Sukses membuat agen!");
      setOnClosePress(() => {
        router.replace("/agents");
      });
      setModalType("popup");
    } catch (error: any) {
      setModalMessage(error.message || "Gagal membuat agen, mohon coba lagi!");
      setModalType("popup");
    }
  };

  return (
    <MainLayout>
      <div className="flex flex-col gap-8 p-2.5 max-w-xl w-full mx-auto">
        <div className="flex flex-col gap-2.5">
          <p className="text-sm font-mono text-black">Siapa nama agennya?</p>
          <input
            type="text"
            placeholder="Nama Agen"
            className="input"
            value={agentName}
            maxLength={24}
            onChange={(e) => setAgentName(e.target.value)}
          />
          <p className="text-xs font-mono text-grey-200">
            {agentName.length}/24
          </p>
        </div>

        <div className="flex flex-col gap-2.5">
          <p className="text-sm font-mono text-black">
            Beri deskripsi singkat fungsi si agen
          </p>
          <textarea
            placeholder={`Deskripsi singkat kegunaan si agen...`}
            className="textarea"
            value={agentSummary}
            maxLength={128}
            onChange={(e) => setAgentSummary(e.target.value)}
          />
          <p className="text-xs font-mono text-grey-200">
            {agentSummary.length}/128
          </p>
        </div>

        <div className="flex flex-col gap-2.5">
          <p className="text-sm font-mono text-black">
            Beri deskripsi dan data - data lengkap biar agennya belajar
          </p>
          <textarea
            placeholder={`Deskripsi lengkap... \n\ncth: \nHarga wortel 7000/kg, harga tomat 1000/kg jika jarak lebih dari 5km maka bla bla bla...`}
            className="textarea min-h-[250px]"
            value={agentDescription}
            onChange={(e) => setAgentDescription(e.target.value)}
          />
        </div>

        <button
          disabled={!agentName || !agentDescription || !agentSummary}
          className="btn"
          onClick={handleCreateAgent}
        >
          Simpan Agen
        </button>
      </div>
    </MainLayout>
  );
}
