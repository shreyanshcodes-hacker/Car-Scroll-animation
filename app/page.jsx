import CarScrollAnimation from "../components/CarScrollAnimation";

export default function Page() {
  return (
    <main>
      <CarScrollAnimation />

      {/* Content that follows the pinned animation, so normal scrolling continues afterwards. */}
      <section className="flex min-h-[70vh] flex-col items-center justify-center gap-3 bg-[#121212] px-6 py-24 text-center">
        <p className="text-sm uppercase tracking-[0.3em] text-white/40">
          End of animation
        </p>
        <p className="max-w-md text-base text-white/60">
        </p>
      </section>
    </main>
  );
}
