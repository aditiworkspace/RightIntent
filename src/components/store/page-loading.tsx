export function PageLoading() {
  return (
    <main
      className="[min-height:55vh] [display:flex] [align-items:center] [justify-content:center] [color:var(--muted)] [font:10px_var(--mono)] [letter-spacing:.12em] [text-transform:uppercase]"
      role="status"
      aria-live="polite"
    >
      Loading
    </main>
  );
}
