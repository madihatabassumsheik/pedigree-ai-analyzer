import { useState, useEffect } from "react";

export default function PropertiesPanel({
  selectedNode,
  onRename,
  onDelete,
  onGenerationChange,
  onAffectedChange,
}) {

  const [name, setName] = useState("");
  const [generation, setGeneration] = useState(1);
  const [affected, setAffected] = useState(false);

    useEffect(() => {

        if (selectedNode) {

            setName(
            selectedNode.data.label
            );

            setGeneration(
            selectedNode.data.generation
            );

            setAffected(
            selectedNode.data.affected
            );
        }

        }, [selectedNode]);

  if (!selectedNode) {
    return (
      <div>
        <h3>No Selection</h3>
        <p>Click a node.</p>
      </div>
    );
  }

  return (
    <div>

      <h3>Selected Person</h3>

      <div style={{ marginBottom: "10px" }}>
        <label>
          <b>Name:</b>
        </label>

        <br />

        <input
        value={name}
        onChange={(e) =>
            setName(e.target.value)
        }
        style={{
            width: "100%",
            boxSizing: "border-box",
            padding: "8px",
            marginTop: "5px",
        }}
        />
      </div>

        <div
        style={{
            marginBottom: "10px",
        }}
        >

        <label>
            <b>Generation</b>
        </label>

        <br />

        <select
            value={generation}
            onChange={(e) =>
            setGeneration(
                Number(e.target.value)
            )
            }
            style={{
            width: "100%",
            padding: "8px",
            boxSizing: "border-box",
            }}
        >
            <option value={1}>1</option>
            <option value={2}>2</option>
            <option value={3}>3</option>
            <option value={4}>4</option>
        </select>

        </div>

        <div
        style={{
            marginBottom: "15px",
        }}
        >

        <label>

            <input
            type="checkbox"
            checked={affected}
            onChange={(e) =>
                setAffected(
                e.target.checked
                )
            }
            />

            {" "}
            Affected Individual

        </label>

        </div>

      <p>
        <b>Gender:</b>{" "}
        {selectedNode.data.gender}
      </p>

      <p>
        <b>Generation:</b>{" "}
        {selectedNode.data.generation}
      </p>

      <p>
        <b>Affected:</b>{" "}
        {selectedNode.data.affected
          ? "Yes"
          : "No"}
      </p>

        <div
        style={{
            display: "flex",
            gap: "10px",
            marginTop: "10px",
        }}
        >

        <button
            onClick={() =>
            onRename(
                selectedNode.id,
                name
            )
            }
        >
            Save Name
        </button>

        <button
            onClick={() =>
                onGenerationChange(
                selectedNode.id,
                generation
                )
            }
            >
            Save Generation
        </button>

        <button
            onClick={() =>
                onAffectedChange(
                selectedNode.id,
                affected
                )
            }
            >
            Save Disease Status
        </button>

        <button
            onClick={() =>
            onDelete(selectedNode.id)
            }
        >
            Delete Person
        </button>

        </div>

    </div>
  );
}