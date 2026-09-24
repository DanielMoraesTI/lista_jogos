"use client";

// Último recurso: erro no layout raiz. Precisa renderizar <html> e <body>.
export default function GlobalError({ reset }: { error: Error; reset: () => void }) {
  return (
    <html lang="pt-BR">
      <body style={{ fontFamily: "system-ui", background: "#12121c", color: "#eee", display: "grid", placeItems: "center", minHeight: "100vh", margin: 0 }}>
        <div style={{ textAlign: "center", padding: 16 }}>
          <h1>Game Over</h1>
          <p>Ocorreu um erro crítico.</p>
          <button onClick={reset} style={{ padding: "8px 16px", cursor: "pointer" }}>
            Tentar novamente
          </button>
        </div>
      </body>
    </html>
  );
}
