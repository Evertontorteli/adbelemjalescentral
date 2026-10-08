import svgPaths from "../../imports/svg-cuvo98uzqz";

export function Apresentacao() {
  return (
    <section
      id="apresentacao"
      className="px-4 pt-10 pb-8 text-center lg:pt-32 lg:pb-12"
      style={{ background: 'linear-gradient(to bottom, #f3f4f6 0%, #ffffff 100%)' }}
    >
      <img
        src="/static/LogoBleia.svg"
        alt=""
        className="mx-auto mb-5 size-20 object-contain drop-shadow-lg md:size-24"
      />
      <h1 className="mx-auto max-w-md md:max-w-xl">
        <span className="sr-only">AD Belém Jales</span>
        <svg className="w-full" fill="none" preserveAspectRatio="xMidYMid meet" viewBox="0 0 1051 148" aria-hidden>
          <g>
            <path d={svgPaths.p304b7c80} fill="#374151" />
            <path d={svgPaths.p8170a80} fill="#374151" />
            <path d={svgPaths.p38f2ec80} fill="#374151" />
            <path d={svgPaths.p341ae700} fill="#374151" />
            <path d={svgPaths.p3cf14940} fill="#374151" />
            <path d={svgPaths.p35520d80} fill="#374151" />
            <path d={svgPaths.p26eb7b80} fill="#374151" />
            <path d={svgPaths.p35290080} fill="#374151" />
            <path d={svgPaths.p2835e770} fill="#374151" />
            <path d={svgPaths.p28724580} fill="#374151" />
            <path d={svgPaths.p222b9c20} fill="#374151" />
            <path d={svgPaths.pf2e6e00} fill="#374151" />
          </g>
        </svg>
      </h1>
      <p className="mt-3 text-sm font-semibold uppercase tracking-[0.2em] text-[#374151] md:text-base">
        Lugar de cura e recomeços
      </p>
      <p className="mx-auto mt-2 max-w-sm text-sm text-[#4b5563] md:text-base">
        Uma igreja de portas abertas para sua família.
      </p>
    </section>
  );
}
