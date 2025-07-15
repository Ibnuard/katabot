interface IAgentCard {
  title: string;
  summary: string;
  onClick: () => void;
  onClickDetail: () => void;
}

export default function AgentCard(props: IAgentCard) {
  return (
    <div className="card w-full card-xs">
      <div className="card-body">
        <h2 className="card-title text-xs font-mono">{props.title}</h2>
        <p>{props.summary}</p>
        <div className="justify-end card-actions mt-4">
          <button onClick={props.onClickDetail} className="btn">
            Detail Agen
          </button>
          <button onClick={props.onClick} className="btn">
            Cobain Agen
          </button>
        </div>
      </div>
    </div>
  );
}
