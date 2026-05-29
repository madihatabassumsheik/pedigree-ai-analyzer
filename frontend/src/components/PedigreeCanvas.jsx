import React, { useCallback, useState } from "react";

import ReactFlow, {
  addEdge,
  useNodesState,
  useEdgesState,
  Background,
  Controls,
} from "reactflow";

import "reactflow/dist/style.css";

import { predictInheritance } from "../api/pedigree";

const initialNodes = [
  {
    id: "1",
    position: { x: 100, y: 50 },
    data: { label: "♂ Father (Normal)" },
    style: {
      backgroundColor: "#e0f7fa",
      padding: 10,
      border: "1px solid #333",
      borderRadius: "8px",
    },
  },
  {
    id: "2",
    position: { x: 300, y: 50 },
    data: { label: "♀ Mother (Affected)" },
    style: {
      backgroundColor: "#ffebee",
      padding: 10,
      border: "1px solid #333",
      borderRadius: "8px",
    },
  },
  {
    id: "3",
    position: { x: 200, y: 200 },
    data: { label: "♂ Child (Affected)" },
    style: {
      backgroundColor: "#ffebee",
      padding: 10,
      border: "1px solid #333",
      borderRadius: "8px",
    },
  },
];

const initialEdges = [
  {
    id: "e1-3",
    source: "1",
    target: "3",
  },
  {
    id: "e2-3",
    source: "2",
    target: "3",
  },
];

export default function PedigreeCanvas() {

  const [result, setResult] = useState(null);

  const [loading, setLoading] = useState(false);

  const [nodes, setNodes, onNodesChange] =
    useNodesState(initialNodes);

  const [edges, setEdges, onEdgesChange] =
    useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params) =>
      setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const analyzePedigree = async () => {

    console.log("Analyze button clicked");

    setLoading(true);

    try {

      const familyData = {
        family_id: "LIVE001",

        members: nodes.map((node) => ({
          id: node.id,

          gender: node.data.label.includes("♀")
            ? "female"
            : "male",

          affected:
            node.data.label.includes("Affected"),
        })),
      };

      console.log("Sending family data:");
      console.log(familyData);

      const prediction =
        await predictInheritance(familyData);

      console.log("Prediction received:");
      console.log(prediction);

      setResult(prediction);

    } catch (error) {

      console.error("Frontend Error:", error);

      alert("Prediction failed. Check backend.");

    } finally {

      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "10px" }}>

      <button
        onClick={analyzePedigree}
        style={{
          marginBottom: "10px",
          padding: "10px 20px",
          cursor: "pointer",
          fontSize: "16px",
        }}
      >
        {loading
          ? "Analyzing..."
          : "Analyze Pedigree"}
      </button>

      <div
        style={{
          width: "100%",
          height: "500px",
          border: "1px solid #ccc",
        }}
      >
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          fitView
        >
          <Background />
          <Controls />
        </ReactFlow>
      </div>

      {result && (
        <div
          style={{
            marginTop: "20px",
            padding: "15px",
            border: "1px solid #ccc",
            borderRadius: "8px",
          }}
        >
          <h3>Prediction Result</h3>

          <p>
            <b>Inheritance Type:</b>{" "}
            {result.prediction}
          </p>

          <p>
            <b>Confidence:</b>{" "}
            {result.confidence}
          </p>

          <p>
            <b>Reason:</b>{" "}
            {result.reason}
          </p>
        </div>
      )}

    </div>
  );
}

