import { Handle, Position } from "reactflow";

export default function PersonNode({ data }) {

  const isFemale = data.gender === "female";

  const backgroundColor = data.affected
    ? "#ef5350"
    : "#e3f2fd";

  return (
    <div
      style={{
        width: 70,
        height: 70,

        borderRadius: isFemale ? "50%" : "8px",

        backgroundColor,

        border: "3px solid #333",

        display: "flex",

        alignItems: "center",

        justifyContent: "center",

        fontWeight: "bold",

        textAlign: "center",

        padding: "5px",

        position: "relative",
      }}
    >

      {/* Incoming connection */}
      <Handle
        type="target"
        position={Position.Top}
      />

      {data.label}

      {/* Outgoing connection */}
      <Handle
        type="source"
        position={Position.Bottom}
      />

    </div>
  );
}