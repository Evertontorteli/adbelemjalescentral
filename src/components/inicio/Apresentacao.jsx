/**
 * Cabeçalho do Início (a apresentação completa fica na tela de entrada).
 * No celular é uma barra fixa no topo, como em um app; no computador fica no fluxo da página.
 */
export function Apresentacao() {
  return (
    <header
      id="apresentacao"
      className="sticky top-0 z-40 border-b border-[#e5e7eb] bg-white/90 backdrop-blur-md lg:static lg:border-b-0 lg:bg-transparent lg:backdrop-blur-none"
      style={{ paddingTop: 'env(safe-area-inset-top)' }}
    >
      <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-3 lg:pt-32 lg:pb-10">
        <img src="/static/LogoBleia.svg" alt="" className="size-9 shrink-0 object-contain lg:size-12" />
        <div className="min-w-0">
          <h1 className="text-base font-bold leading-tight text-[#374151] lg:text-xl">AD Belém Jales</h1>
          <p className="text-xs text-[#4b5563] lg:text-sm">Lugar de cura e recomeços</p>
        </div>
      </div>
    </header>
  );
}
