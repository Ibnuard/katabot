type Agent = {
  id: number;
  agent_name: string;
  agent_summary: string;
  agent_description: string;
};

export const replyChat = async (agent: Agent, userQuestion: string) => {
  const response = await fetch("/api/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      agent: agent,
      question: userQuestion,
    }),
  });

  const data = await response.json();

  return data?.choices[0]?.message.content;
};
