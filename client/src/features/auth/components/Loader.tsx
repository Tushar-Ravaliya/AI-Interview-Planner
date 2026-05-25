export default function Loader() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-parchment">
      <div className="flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-terra animate-pulse-dot" />
        <span className="w-1.5 h-1.5 rounded-full bg-terra animate-pulse-dot delay-200" />
        <span className="w-1.5 h-1.5 rounded-full bg-terra animate-pulse-dot delay-400" />
      </div>
    </div>
  );
}
