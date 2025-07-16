type Agent = {
  id: number;
  agent_name: string;
  agent_summary: string;
  agent_description: string;
};

type Chat = {
  type: "chat-start" | "chat-end";
  message?: string;
  isLoading?: boolean;
};

export const replyChat = async (
  agent: Agent,
  userQuestion: string,
  contextChat: Chat[]
) => {
  const response = await fetch("/api/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      agent: agent,
      question: userQuestion,
      context: JSON.stringify(contextChat),
    }),
  });

  const data = await response.json();

  return data.answer;
};
