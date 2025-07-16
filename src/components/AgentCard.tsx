import { getUser } from "@/lib/user";

interface IAgentCard {
  creatorId: string;
  title: string;
  summary: string;
  onClick: () => void;
  onClickDetail: () => void;
}

export default function AgentCard(props: IAgentCard) {
  const user = getUser();
  const IS_CREATOR = user?.id == props.creatorId;

  return (
    <div className="card w-full card-xs">
      <div className="card-body">
        <h2 className="card-title text-xs font-mono">{props.title}</h2>
        <p>{props.summary}</p>
        <div className="justify-end card-actions mt-4">
          <button onClick={props.onClickDetail} className="btn">
            {IS_CREATOR ? "Edit Agen" : "Detail Agen"}
          </button>
          <button onClick={props.onClick} className="btn">
            Cobain Agen
          </button>
        </div>
      </div>
    </div>
  );
}
