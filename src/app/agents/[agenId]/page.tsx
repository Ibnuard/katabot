"use client";

import { useModal } from "@/context/ModalContext";
import MainLayout from "@/layout/MainLayout";
import { getAgent } from "@/lib/agents";
import { replyChat } from "@/lib/chat";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Agent = {
  id: number;
  agent_name: string;
  agent_summary: string;
  agent_description: string;
  faq_list: string[];
  api_data?: string;
};

type Chat = {
  type: "chat-start" | "chat-end";
  message?: string;
  isLoading?: boolean;
};

export default function Page() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [agent, setAgent] = useState<Agent>();
  const [userChat, setUserChat] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const router = useRouter();
  const { agenId } = useParams();

  const {
    showModal,
    hideModal,
    setModalMessage,
    setModalType,
    setOnClosePress,
  } = useModal();

  // get agent detail
  useEffect(() => {
    const getAgentDetail = async () => {
      setModalType("loading");
      showModal();
      try {
        const agent = await getAgent(agenId as string); // cast karena agenId tipe string | string[]
        setAgent(agent);
        hideModal();
      } catch (error) {
        console.log("Error", error);

        setModalMessage("Gagal mendapatkan data agen, coba lagi yaa!");
        setOnClosePress(() => router.back());
        setModalType("popup");
      }
    };

    getAgentDetail();
  }, []);

  // inisiate chat
  useEffect(() => {
    if (agent && chats.length < 1) {
      setChats((prev) => [
        ...prev,
        {
          type: "chat-start",
          message: `Halo saya ${agent.agent_name}, ada yang bisa saya bantu?`,
        },
      ]);
    }
  }, [agent]);

  async function handleSendMessage(message?: string) {
    const chat = message ? message : userChat;

    setLoading(true);
    setChats((prev) => [...prev, { type: "chat-end", message: chat }]);
    setUserChat("");

    // agent side
    setChats((prev) => [...prev, { type: "chat-start", isLoading: true }]);
    const botReply = await replyChat(agent!, chat, chats, agent?.api_data);

    if (botReply) {
      setChats((prev) => {
        const updated = [...prev];
        updated.pop();
        updated.push({ type: "chat-start", message: botReply });
        return updated;
      });

      setLoading(false);
    }
  }

  return (
    <MainLayout>
      {/* Info Collapse */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-8 p-4 lg:p-8">
        <div className="block md:hidden">
          <div
            tabIndex={0}
            className="collapse collapse-arrow border border-gray-200 bg-[#fffaf0] rounded-lg"
          >
            <div className="flex flex-row items-center gap-2 collapse-title">
              <div>
                <Image
                  src="/images/logo_mascot.png"
                  alt="logo"
                  width={14}
                  height={14}
                  priority
                />
              </div>

              <div className="font-mono text-sm font-semibold">
                {agent?.agent_name}
              </div>
            </div>

            <div className="collapse-content text-sm">
              {agent?.agent_summary}
            </div>
          </div>
        </div>

        <div className="card p-4 bg-[#fffaf0] border border-gray-200 hidden md:block">
          <div className="flex flex-row items-center gap-2">
            <div>
              <Image
                src="/images/logo_mascot.png"
                alt="logo"
                width={14}
                height={14}
                priority
              />
            </div>

            <div className="card-title text-sm font-mono font-semibold">
              {agent?.agent_name}
            </div>
          </div>

          <div className="card-body">{agent?.agent_summary}</div>
        </div>

        {/* Chat Card */}
        <div className="card bg-white border border-base-300 shadow p-0 h-[calc(100vh-12rem)] overflow-hidden">
          {/* Chat Area */}
          <div className="flex flex-col h-full">
            {/* Chat Messages Scroll Area */}
            <div className="flex-1 overflow-y-auto px-4 py-2 space-y-3">
              {chats.map((item: Chat, index: number) => {
                return (
                  <div key={index} className={`chat ${item.type}`}>
                    <div
                      className={`chat-bubble ${
                        item.type == "chat-start" ? "" : "chat-bubble-primary"
                      }`}
                    >
                      {item.isLoading ? (
                        <div className="flex items-center gap-1">
                          <span className="w-1.5 h-1.5 bg-[var(--accent)] rounded-full animate-bounce ease-in-out [animation-delay:.1s]" />
                          <span className="w-1.5 h-1.5 bg-[var(--accent)] rounded-full animate-bounce ease-in-out [animation-delay:.2s]" />
                          <span className="w-1.5 h-1.5 bg-[var(--accent)] rounded-full animate-bounce ease-in-out [animation-delay:.3s]" />
                        </div>
                      ) : (
                        item.message
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Chat Input */}
            <div className="border-t border-base-300 p-3">
              <div className="flex flex-row gap-2.5 mb-4 overflow-x-auto whitespace-nowrap p-2.5">
                {agent?.faq_list.map((item: string, index: number) => {
                  return (
                    <button
                      key={index}
                      onClick={() => handleSendMessage(item)}
                      disabled={loading}
                      className="btn card px-2.5 py-1.5 shrink-0 min-w-max"
                    >
                      <div className="text-xs">{item}</div>
                    </button>
                  );
                })}
              </div>
              <form
                className="flex gap-2"
                onSubmit={(e) => {
                  e.preventDefault(); // mencegah reload
                  if (!userChat || loading) return;
                  handleSendMessage();
                }}
              >
                <input
                  type="text"
                  disabled={loading}
                  placeholder="Tulis pesan..."
                  className="input input-bordered w-full font-mono text-sm bg-white"
                  value={userChat}
                  onChange={(e) => setUserChat(e.target.value)}
                />

                <button
                  type="submit"
                  disabled={!userChat || loading}
                  className="btn bg-[var(--accent)] text-white hover:brightness-110"
                >
                  Kirim
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
