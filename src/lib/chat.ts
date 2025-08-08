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
  contextChat: Chat[],
  api_data?: string
) => {
  let API_DATA_RESPONSE;

  if (api_data != null) {
    const response = await fetch(api_data, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (data) {
      API_DATA_RESPONSE = JSON.stringify(data);
    }
  }

  const response = await fetch("/api/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      agent: agent,
      question: userQuestion,
      context: JSON.stringify(contextChat),
      data_source: API_DATA_RESPONSE,
    }),
  });

  const data = await response.json();

  return data.answer;
};
