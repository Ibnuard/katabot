"use client";

import AgentCard from "@/components/AgentCard";
import { useModal } from "@/context/ModalContext";
import MainLayout from "@/layout/MainLayout";
import { getAgents } from "@/lib/agents";
import { getUser } from "@/lib/user";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Agent = {
  id: number;
  agent_name: string;
  agent_summary: string;
  agent_description: string;
  creator_id: string;
};

export default function Page() {
  const router = useRouter();
  const [agents, setAgents] = useState<Agent[]>([]);

  const user = getUser();
  const { showModal, setModalType, hideModal, setModalMessage } = useModal();

  useEffect(() => {
    const fetchAgents = async () => {
      setModalType("loading");
      showModal();
      try {
        const data = await getAgents();
        setAgents(data);
        hideModal();
      } catch (err) {
        setModalMessage("Gagal mengambil daftar agen");
        setModalType("popup");
        console.error("Gagal mengambil data agen:", err);
      }
    };

    fetchAgents();
  }, []);

  return (
    <MainLayout>
      <div className="flex flex-col gap-12 p-2.5 md:p-7 lg:p-11">
        {user && (
          <div>
            <p className="text-title text-accent mb-2">Bikin Agen Sendiri</p>
            <p className="text-subtitle mb-6">
              Eksperimen dengan ide kamu dan buat AI yang bisa bantu banyak hal.
            </p>
            <button onClick={() => router.push("/create")} className="btn">
              + Buat Agen
            </button>
          </div>
        )}

        {agents.length > 0 && (
          <div>
            <p className="text-title mb-2">Agen Siap Pakai 🤖</p>
            <p className="text-subtitle mb-6">
              Langsung coba beberapa agen yang udah dibuat pengguna lain.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {agents.map((agent) => (
                <AgentCard
                  key={agent.id}
                  creatorId={agent.creator_id}
                  title={agent.agent_name}
                  summary={agent.agent_summary}
                  onClick={() => router.push(`/agents/${agent.id}`)}
                  onClickDetail={() =>
                    router.push(`/agents/${agent.id}/detail`)
                  }
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
