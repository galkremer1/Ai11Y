export function Placeholder() {
  return (
    <div style={{ textAlign: "center" }}>
      <div
        className="ai11y-empathy-placeholder"
        style={{ width: 320, height: 192, margin: "0 auto" }}
      >
        <div
          className="ai11y-empathy-titlebar"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            height: 32,
            borderRadius:
              "var(--pf-t--global--border--radius--small) var(--pf-t--global--border--radius--small) 0 0",
            padding: "0 12px",
          }}
        >
          <div
            style={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              backgroundColor:
                "var(--pf-t--global--color--status--danger--default)",
            }}
          />
          <div
            style={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              backgroundColor:
                "var(--pf-t--global--color--status--warning--default)",
            }}
          />
          <div
            style={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              backgroundColor:
                "var(--pf-t--global--color--status--success--default)",
            }}
          />
          <div
            className="ai11y-empathy-skeleton"
            style={{ flex: 1, height: 16, marginLeft: 16 }}
          />
        </div>
        <div
          style={{
            padding: 16,
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}
        >
          <div
            className="ai11y-empathy-skeleton"
            style={{ height: 12, width: "75%" }}
          />
          <div
            className="ai11y-empathy-skeleton"
            style={{ height: 12, width: "50%" }}
          />
          <div
            style={{
              height: 32,
              width: 96,
              borderRadius: "var(--pf-t--global--border--radius--small)",
              backgroundColor: "var(--pf-t--global--color--brand--default)",
            }}
          />
          <div
            className="ai11y-empathy-skeleton"
            style={{ height: 12, width: "100%" }}
          />
        </div>
      </div>
      <p
        style={{
          fontSize: "var(--pf-t--global--font--size--xs)",
          color: "var(--pf-t--global--text--color--subtle)",
          marginTop: "var(--pf-t--global--spacer--md)",
        }}
      >
        Empathy preview — enter a URL above and click Audit
      </p>
    </div>
  );
}
