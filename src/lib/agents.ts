import { supabase } from "./supabase";

export const createAgent = async (
  agentName: string,
  agentDescription: string,
  agentSummary: string,
  creatorId: string,
  faqList: string[],
  dataSource?: string
) => {
  // Cek apakah sudah ada agent dengan creator_id yang sama
  const { data: existingAgent, error: fetchError } = await supabase
    .from("agent")
    .select("id")
    .eq("creator_id", creatorId)
    .maybeSingle();

  if (fetchError) throw fetchError;

  if (existingAgent) {
    throw new Error("Kamu sudah membuat agen sebelumnya.");
  }

  // Jika belum ada, lanjut buat agen baru
  const { data, error } = await supabase.from("agent").insert({
    agent_name: agentName,
    agent_description: agentDescription,
    agent_summary: agentSummary,
    creator_id: creatorId,
    faq_list: faqList,
    api_data: dataSource,
  });

  if (error) throw error;
  return data;
};

export const getAgents = async () => {
  const { data, error } = await supabase
    .from("agent")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
};

export const getAgent = async (id: number | string) => {
  const { data, error } = await supabase
    .from("agent")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
};

export const updateAgentById = async (
  agentId: number | string,
  updatedData: {
    agent_name?: string;
    agent_description?: string;
    agent_summary?: string;
    faq_list?: string[];
    api_data?: string;
  }
) => {
  const { data, error } = await supabase
    .from("agent")
    .update(updatedData)
    .eq("id", agentId)
    .select()
    .single();

  if (error) throw error;
  return data;
};
