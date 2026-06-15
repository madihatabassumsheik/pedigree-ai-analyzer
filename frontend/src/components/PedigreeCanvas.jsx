import PersonNode from "./PersonNode";
import React, { useCallback, useState } from "react";
import PropertiesPanel from "./PropertiesPanel";
import jsPDF from "jspdf";
import { templates } from "../data/templates";

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

          name: node.data.label,

          gender: node.data.gender,

          affected: node.data.affected,

          generation:
            node.data.generation,
        })),

        relationships: edges.map((edge) => ({
          source: edge.source,

          target: edge.target,

          relationshipType:
            edge.data?.relationshipType ||
            "parent-child",
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

  const exportPDF = () => {

    if (!result) {
      alert("Run analysis first");
      return;
    }

    const doc = new jsPDF();

    doc.setFontSize(18);

    doc.text(
      "Pedigree AI Analyzer Report",
      20,
      20
    );

    doc.setFontSize(12);

    doc.text(
      `Inheritance Type: ${result.prediction}`,
      20,
      40
    );

    doc.text(
      `Confidence: ${result.confidence}`,
      20,
      50
    );

    doc.text(
      `Reason: ${result.reason}`,
      20,
      60
    );

    let y = 80;

    doc.text(
      "Genotype Inference",
      20,
      y
    );

    y += 10;

    result.genotypes?.forEach((person) => {

      doc.text(
        `${person.name} -> ${person.genotype}`,
        20,
        y
      );

      y += 10;
    });

    y += 10;

    doc.text(
      "Future Child Risk",
      20,
      y
    );

    y += 10;

    doc.text(
      `Affected: ${result.future_child_risk?.affected}`,
      20,
      y
    );

    y += 10;

    doc.text(
      `Carrier: ${result.future_child_risk?.carrier}`,
      20,
      y
    );

    y += 10;

    doc.text(
      `Normal: ${result.future_child_risk?.normal}`,
      20,
      y
    );

    doc.save("Pedigree_Report.pdf");
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

  const savePedigree = () => {

    const pedigreeData = {

      nodes,

      edges,

      savedAt: new Date()
        .toISOString(),
    };

    const blob = new Blob(
      [
        JSON.stringify(
          pedigreeData,
          null,
          2
        ),
      ],
      {
        type: "application/json",
      }
    );

    const url =
      URL.createObjectURL(blob);

    const a =
      document.createElement("a");

    a.href = url;

    a.download =
      "pedigree_case.json";

    a.click();

    URL.revokeObjectURL(url);
  };

  const loadPedigree = (event) => {

    const file =
    event.target.files[0];

    if (!file) return;

    const reader =
      new FileReader();

    reader.onload = (e) => {

      const data =
        JSON.parse(
          e.target.result
        );

      setNodes(data.nodes || []);

      setEdges(data.edges || []);
    };

    reader.readAsText(file);
  };

  const loadTemplate = (template) => {

    setNodes(template.nodes);

    setEdges(template.edges);

    setResult(null);
  };

  return (
    <div style={{ padding: "10px" }}>

      <div style={{ marginBottom: "10px" }}>
      <div
        style={{
          marginBottom: "15px",
        }}
      >

        <h3>Disease Templates</h3>

        <button
          onClick={() =>
            loadTemplate(
              templates.huntingtons
            )
          }
        >
          Huntington's
        </button>

        <button
          onClick={() =>
            loadTemplate(
              templates.thalassemia
            )
          }
          style={{
            marginLeft: "10px",
          }}
        >
          Thalassemia
        </button>

        <button
          onClick={() =>
            loadTemplate(
              templates.colorBlindness
            )
          }
          style={{
            marginLeft: "10px",
          }}
        >
          Color Blindness
        </button>

      </div>
 

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
        onClick={exportPDF}
        style={{
          marginLeft: "10px",
          padding: "10px 20px",
          cursor: "pointer",
        }}
      >
        Export PDF
      </button>

      <button
        onClick={savePedigree}
        style={{
          marginLeft: "10px",
          padding: "10px",
        }}
      >
        Save Pedigree
      </button>

      <label
        style={{
          marginLeft: "10px",
          padding: "10px",
          border: "1px solid #ccc",
          cursor: "pointer",
        }}
      >
        Load Pedigree

        <input
          type="file"
          accept=".json"
          style={{
            display: "none",
          }}
          onChange={loadPedigree}
        />
      </label>

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

          {result.risk && (
            <div
              style={{
                marginTop: "15px",
                padding: "10px",
                border: "1px solid #ddd",
                borderRadius: "8px",
                backgroundColor: "#fafafa",
              }}
            >
              <h4>Genetic Risk Estimate</h4>

              <p>
                <b>Example Cross:</b>{" "}
                {result.risk.example}
              </p>

              <p>
                <b>Affected Child Risk:</b>{" "}
                {result.risk.affected_probability}
              </p>

              <p>
                <b>Carrier Risk:</b>{" "}
                {result.risk.carrier_probability}
              </p>

              <p>
                <b>Normal Child Probability:</b>{" "}
                {result.risk.normal_probability}
              </p>

            </div>
          )}

          {result.genotypes && (
            <div>
              <h4>Genotype Inference</h4>

              {result.genotypes.map((person, index) => (
                <div key={index}>
                  {person.name} → {person.genotype}
                </div>
              ))}
            </div>
          )}

          {result.future_child_risk && (
            <div style={{ marginTop: "15px" }}>
              <h4>Future Child Risk</h4>

              <p>
                Affected:
                {" "}
                {result.future_child_risk.affected}
              </p>

              <p>
                Carrier:
                {" "}
                {result.future_child_risk.carrier}
              </p>

              <p>
                Normal:
                {" "}
                {result.future_child_risk.normal}
              </p>
            </div>
          )}

          {result.warnings &&
            result.warnings.length > 0 && (

              <div
                style={{
                  marginTop: "15px",
                  padding: "10px",
                  backgroundColor: "#fff3cd",
                  border: "1px solid #ffeeba",
                }}
              >

                <h4>
                  Validation Warnings
                </h4>

                <ul>

                  {result.warnings.map(
                    (warning, index) => (

                      <li key={index}>
                        {warning}
                      </li>

                    )
                  )}

                </ul>

              </div>
            )}
        </div>
      )}

    </div>
  );
}

