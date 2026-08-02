export default function AnalyticsCard({

  title,

  value,

}) {

  return (

    <div
      style={{
        minWidth: "140px",

        border: "1px solid #ddd",

        borderRadius: "10px",

        padding: "15px",

        textAlign: "center",

        background: "#fafafa",
      }}
    >

      <div
        style={{
          fontSize: "14px",

          color: "#666",
        }}
      >
        {title}
      </div>

      <div
        style={{
          fontSize: "24px",

          fontWeight: "bold",

          marginTop: "10px",
        }}
      >
        {value}
      </div>

    </div>
  );
}