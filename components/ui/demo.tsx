import KineticGrid from "@/components/ui/kinetic-grid";

export default function Default() {
  return (
    <KineticGrid>
      <div className="flex min-h-[550px] flex-col items-center justify-center px-6 text-center">
        <span className="mb-5 rounded-full border border-white/15 px-4 py-1.5 text-xs font-medium tracking-wider uppercase text-cyan-400 bg-white/5 backdrop-blur-md">
          Interactive Grid Matrix
        </span>
        <h1 className="max-w-3xl text-4xl font-extrabold tracking-tight text-white sm:text-6xl font-heading">
          Move your cursor. Click anywhere.
        </h1>
        <p className="mt-4 max-w-lg text-lg text-slate-400">
          A kinetic grid that warps toward the pointer and ripples dynamically on every click.
        </p>
      </div>
    </KineticGrid>
  );
}
