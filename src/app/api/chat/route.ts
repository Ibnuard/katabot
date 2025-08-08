import { NextResponse } from "next/server";

export async function POST(req: Request) {
  console.log(">>> HIT /api/chat route");
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

  try {
    const body = await req.json();
    const { agent, question, context, data_source } = body;

    const agentIntl = `
    Perhatikan data berikut

    ${agent.agent_description}

    berdasarkan data diatas berprilakulah sebagai assisten customer service dimana kamu akan membantu pelanggan untuk menjawab pertanyaan mereka, jika pertanyaan pelanggan tidak ada yang sesuai dengan data diatas atau out of topic maka cukup jawab dengan maaf dan senyuman, usahakan setiap jawaban harus mengandung emot ceria tapi jangan terlalu lebay dan jangan basa basi juga, secukupnya aja, jangan gunakan tanda tanda seperti simbol untuk bold atau kiasan agar terlihat tetap profesional
    `;

    const MESSAGES = [
      {
        role: "system",
        content: `Nama kamu adalah ${agent.agent_name}`,
      },
      {
        role: "system",
        content: `Jawab berdasarkan history chat berikut, dimana type chat-start adalah dari sisi bot dan chat-end adalah pesan dari sisi user, berikut data history chatnya \n\n${context}`,
      },
      {
        role: "system",
        content: agentIntl,
      },
      {
        role: "user",
        content: question,
      },
    ];

    if (data_source) {
      MESSAGES.push({
        role: "system",
        content: `Berikut adalah data tambahan dari api ${data_source}; Jawab pertanyaan berdasarkan data yg diberikan`,
      });
    }

    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "deepseek/deepseek-chat-v3-0324:free",
        stream: false,
        messages: MESSAGES,
      }),
    });

    const text = await res.text();

    try {
      const json = JSON.parse(text);
      const answer = json.choices?.[0]?.message?.content ?? "Gagal menjawab.";
      return NextResponse.json({ answer });
    } catch (jsonErr) {
      console.log("JSON Err", jsonErr);

      return NextResponse.json(
        { error: "Response not JSON", text },
        { status: 500 }
      );
    }
  } catch (e: unknown) {
    console.error("ERROR:", e);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
