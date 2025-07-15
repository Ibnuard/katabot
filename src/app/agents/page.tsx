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
            <p className="text-sm font-mono font-semibold mb-6">
              Mau coba bikin agen sendiri?
            </p>
            <button onClick={() => router.push("/create")} className="btn">
              Mulai Buat Agen
            </button>
          </div>
        )}

        {agents.length > 0 && (
          <div>
            <p className="text-sm font-mono font-semibold mb-6">
              Agen yang siap dicobain
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {agents.map((agent) => (
                <AgentCard
                  key={agent.id}
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
