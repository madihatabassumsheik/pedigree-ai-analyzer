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

      <PedigreeCanvas />
    </div>
  );
}

export default App;