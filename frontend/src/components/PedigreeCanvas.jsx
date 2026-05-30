import PersonNode from "./PersonNode";
import React, { useCallback, useState } from "react";
import PropertiesPanel from "./PropertiesPanel";

import ReactFlow, {
  addEdge,
  useNodesState,
  useEdgesState,
  Background,
  Controls,
} from "reactflow";

import "reactflow/dist/style.css";

import { predictInheritance } from "../api/pedigree";

const nodeTypes = {
  person: PersonNode,
};

const initialNodes = [
  {
    id: "1",

    type: "person",

    position: { x: 100, y: 50 },

    data: {
      label: "Father",
      gender: "male",
      affected: false,
      generation: 2,
    },
  },

  {
    id: "2",

    type: "person",

    position: { x: 300, y: 50 },

    data: {
      label: "Mother",
      gender: "female",
      affected: true,
      generation: 2,
    },
  },

  {
    id: "3",

    type: "person",

    position: { x: 200, y: 220 },

    data: {
      label: "Child",
      gender: "male",
      affected: true,
      generation: 3,
    },
  },
];

const initialEdges = [
  {
    id: "e1-3",
    source: "1",
    target: "3",

    animated: true,

    style: {
      strokeWidth: 2,
    },
  },

  {
    id: "e2-3",
    source: "2",
    target: "3",

    animated: true,

    style: {
      strokeWidth: 2,
    },
  },
];

export default function PedigreeCanvas() {

  const [result, setResult] = useState(null);

  const [loading, setLoading] = useState(false);
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [selectedEdgeId, setSelectedEdgeId] = useState(null);
  const [nodeCount, setNodeCount] = useState(4);

  const [nodes, setNodes, onNodesChange] =
    useNodesState(initialNodes);

  const [edges, setEdges, onEdgesChange] =
    useEdgesState(initialEdges);

  const selectedNode =
  nodes.find(
    (n) => n.id === selectedNodeId
  ) || null;

const onConnect = useCallback(
  (params) =>

    setEdges((eds) =>
      addEdge(
        {
          ...params,

          animated: true,

          style: {
            strokeWidth: 2,
          },
        },

        eds
      )
    ),

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

        gender: node.data.gender,

        affected: node.data.affected,
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

  const addPerson = (gender) => {

  const newNode = {

    id: String(nodeCount),

    type: "person",

    position: {
      x: 100 + Math.random() * 400,
      y: 300 + Math.random() * 200,
    },

    data: {
      label:
        gender === "male"
          ? `Male ${nodeCount}`
          : `Female ${nodeCount}`,

      gender,

      affected: false,
      generation: 3,
    },
  };

  setNodes((nds) => [...nds, newNode]);

  setNodeCount((prev) => prev + 1);
};

const arrangeGenerations = () => {

    setNodes((nds) => {

      let generationCounts = {};

      return nds.map((node) => {

        const generation =
          node.data.generation || 3;

        if (!generationCounts[generation]) {
          generationCounts[generation] = 0;
        }

        const index =
          generationCounts[generation]++;

        return {
          ...node,

          position: {
            x: 150 + index * 220,
            y: generation * 150,
          },
        };
      });
    });
  };

  const onNodeClick = (event, node) => {

    setSelectedNodeId(node.id);
  };

  const onEdgeClick = (event, edge) => {

    console.log("Edge selected:", edge.id);

    setSelectedEdgeId(edge.id);
  };

  const renameNode = (nodeId, newName) => {

  console.log("Rename requested:");
  console.log(nodeId, newName);

      setNodes((nds) =>
        nds.map((n) => {

          if (n.id === nodeId) {

            console.log("Updating node:", n.id);

            return {
              ...n,
              data: {
                ...n.data,
                label: newName,
              },
            };
          }

          return n;
        })
      );
    };

    const updateGeneration = (
      nodeId,
      generation
    ) => {

      setNodes((nds) =>
        nds.map((n) => {

          if (n.id === nodeId) {

            return {
              ...n,

              data: {
                ...n.data,

                generation,
              },
            };
          }

          return n;
        })
      );

      setTimeout(
        arrangeGenerations,
        100
      );
    };

  const updateAffectedStatus = (
      nodeId,
      affected
    ) => {

      setNodes((nds) =>
        nds.map((n) => {

          if (n.id === nodeId) {

            return {
              ...n,

              data: {
                ...n.data,

                affected,
              },
            };
          }

          return n;
        })
      );
    };

  const deleteNode = (nodeId) => {

    setNodes((nds) =>
      nds.filter(
        (n) => n.id !== nodeId
      )
    );

    setEdges((eds) =>
      eds.filter(
        (e) =>
          e.source !== nodeId &&
          e.target !== nodeId
      )
    );

    setSelectedNodeId(null);
  };

  const deleteRelationship = () => {

    if (!selectedEdgeId) {

      alert("Select a relationship first.");

      return;
    }

    setEdges((eds) =>
      eds.filter(
        (e) => e.id !== selectedEdgeId
      )
    );

    setSelectedEdgeId(null);
  };

  return (
    <div style={{ padding: "10px" }}>

      <div style={{ marginBottom: "10px" }}>

  <button
    onClick={() => addPerson("male")}
    style={{
      marginRight: "10px",
      padding: "10px",
      cursor: "pointer",
    }}
  >
    + Add Male
  </button>

  <button
    onClick={() => addPerson("female")}
    style={{
      padding: "10px",
      cursor: "pointer",
    }}
  >
    + Add Female
  </button>

  <button
    onClick={arrangeGenerations}
    style={{
      marginLeft: "10px",
      padding: "10px",
      cursor: "pointer",
    }}
  >
    Arrange Generations
  </button>

</div>

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

      <button
        onClick={deleteRelationship}
        style={{
          marginLeft: "10px",
          padding: "10px",
          cursor: "pointer",
        }}
      >
        Delete Relationship
      </button>
     <div
  style={{
    display: "flex",
    gap: "20px",
    marginTop: "10px",
  }}
>

      <div
        style={{
          flex: 3,
          height: "500px",
          border: "1px solid #ccc",
        }}
      >
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          onEdgeClick={onEdgeClick}
          fitView
        >
          <Background gap={20} size={1} />
          <Controls />
        </ReactFlow>
      </div>

      <div
        style={{
          flex: 1,
          border: "1px solid #ccc",
          padding: "10px",
          minHeight: "500px",
        }}
      >
      <PropertiesPanel
        selectedNode={selectedNode}
        onRename={renameNode}
        onDelete={deleteNode}
        onGenerationChange={updateGeneration}
        onAffectedChange={updateAffectedStatus}
      />
      </div>

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

