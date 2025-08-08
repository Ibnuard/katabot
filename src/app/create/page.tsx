"use client";

import FAQEditor from "@/components/FAQEditor";
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
  const [dataSource, setDataSource] = useState<string>("");
  const [faqList, setFAQList] = useState<string[]>([]);

  const user = getUser();

  const router = useRouter();

  // modal
  const { showModal, setModalType, setModalMessage, setOnClosePress } =
    useModal();

  useEffect(() => {
    if (!user) {
      router.replace("/");
    }
  }, []);

  const handleCreateAgent = async () => {
    setModalType("loading");
    showModal();

    try {
      if (!user?.id) {
        throw new Error("User ID tidak ditemukan");
      }

      await createAgent(
        agentName,
        agentDescription,
        agentSummary,
        user.id,
        faqList,
        dataSource
      );
      setModalMessage("Sukses membuat agen!");
      setOnClosePress(() => {
        router.replace("/agents");
      });
      setModalType("popup");
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : "Gagal membuat agen, mohon coba lagi!";
      setModalMessage(message);
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

        <div className="flex flex-col gap-2.5">
          <p className="text-sm font-mono text-black">
            (Opsional) API sumber data agen
          </p>
          <div className="relative">
            <div className="relative">
              <input
                type="text"
                placeholder="https://example.com/api/data.json"
                className="input pr-20 z-10" // tetap z-10 agar di bawah chip
                value={dataSource}
                onChange={(e) => setDataSource(e.target.value)}
              />
              <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 bg-blue-100 text-blue-700 text-xs font-mono px-2 py-0.5 rounded-full border border-blue-300 z-20">
                GET
              </span>
            </div>
          </div>
          <p className="text-xs font-mono text-grey-200">
            Agen akan belajar dari API ini jika disediakan.
          </p>
        </div>

        <FAQEditor isCreator={true} value={faqList} setValue={setFAQList} />

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
