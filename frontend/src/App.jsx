import PedigreeCanvas from "./components/PedigreeCanvas";

function App() {
  return (
    <div>
      <h1 style={{ padding: "10px" }}>
        Pedigree AI Analyzer
      </h1>

      {/* Legend */}
      <div style={{ padding: "10px", fontSize: "14px" }}>
        <p>🔵 Normal Individual</p>
        <p>🔴 Affected Individual</p>
      </div>

      <p style={{ paddingLeft: "10px" }}>
      Drag between nodes to create family relationships.
      </p>

      <PedigreeCanvas />
    </div>
  );
}

export default App;