export default function Loader() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-noir-950">
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-gold animate-pulse-dot" />
        <span className="w-2 h-2 rounded-full bg-gold animate-pulse-dot delay-200" />
        <span className="w-2 h-2 rounded-full bg-gold animate-pulse-dot delay-400" />
      </div>
    </div>
  );
}
