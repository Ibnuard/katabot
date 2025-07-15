"use client";

import { useModal } from "@/context/ModalContext";
import MainLayout from "@/layout/MainLayout";
import { getAgent, updateAgentById } from "@/lib/agents";
import { getUser } from "@/lib/user";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Agent = {
  id: number;
  agent_name: string;
  agent_summary: string;
  agent_description: string;
  creator_id: string;
};

export default function Page() {
  const [agent, setAgent] = useState<Agent>();
  const [agentName, setAgentName] = useState<string>("");
  const [agentSummary, setAgentSummary] = useState<string>("");
  const [agentDescription, setAgentDescription] = useState<string>("");

  const user = getUser();

  const router = useRouter();
  const { agenId } = useParams();

  const IS_CREATOR = user?.id == agent?.creator_id;

  // modal
  const {
    showModal,
    hideModal,
    setModalType,
    setModalMessage,
    setOnClosePress,
  } = useModal();

  // get agent detail
  useEffect(() => {
    const getAgentDetail = async () => {
      setModalType("loading");
      showModal();
      try {
        const agent: Agent = await getAgent(agenId as string);
        setAgentName(agent.agent_name);
        setAgentSummary(agent.agent_summary);
        setAgentDescription(agent.agent_description);
        setAgent(agent);
        hideModal();
      } catch (error) {
        setModalMessage("Gagal mendapatkan data agen, coba lagi yaa!");
        setOnClosePress(() => router.back());
        setModalType("popup");
      }
    };

    getAgentDetail();
  }, []);

  const handleUpdateAgent = async () => {
    setModalType("loading");
    showModal();

    try {
      await updateAgentById(agenId as string, {
        agent_name: agentName,
        agent_summary: agentSummary,
        agent_description: agentDescription,
      });
      setModalMessage("Sukses menyimpan agen!");
      setOnClosePress(() => {
        router.replace("/agents");
      });
      setModalType("popup");
    } catch (error) {
      setModalMessage("Gagal menyimpan agen, mohon coba lagi!");
      setModalType("popup");
    }
  };

  return (
    <MainLayout>
      <div className="flex flex-col gap-8 p-2.5 max-w-xl w-full mx-auto">
        <div className="flex flex-col gap-2.5">
          <p className="text-sm font-mono text-black">Nama agen</p>
          <input
            type="text"
            placeholder="Nama Agen"
            className="input"
            value={agentName}
            maxLength={24}
            disabled={!IS_CREATOR}
            onChange={(e) => setAgentName(e.target.value)}
          />
          {IS_CREATOR && (
            <p className="text-xs font-mono text-grey-200">
              {agentName.length}/24
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2.5">
          <p className="text-sm font-mono text-black">Deskripsi singkat agen</p>
          <textarea
            placeholder={`Deskripsi singkat kegunaan si agen...`}
            className="textarea"
            value={agentSummary}
            maxLength={128}
            disabled={!IS_CREATOR}
            onChange={(e) => setAgentSummary(e.target.value)}
          />
          {IS_CREATOR && (
            <p className="text-xs font-mono text-grey-200">
              {agentSummary.length}/128
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2.5">
          <p className="text-sm font-mono text-black">
            Deskripsi dan data - data lengkap yang dipelajari agen
          </p>
          <textarea
            placeholder={`Deskripsi lengkap... \n\ncth: \nHarga wortel 7000/kg, harga tomat 1000/kg jika jarak lebih dari 5km maka bla bla bla...`}
            className="textarea min-h-[250px]"
            value={agentDescription}
            disabled={!IS_CREATOR}
            onChange={(e) => setAgentDescription(e.target.value)}
          />
        </div>

        {IS_CREATOR && (
          <button
            disabled={!agentName || !agentDescription || !agentSummary}
            className="btn"
            onClick={() => handleUpdateAgent()}
          >
            Simpan Perubahan
          </button>
        )}
      </div>
    </MainLayout>
  );
}
