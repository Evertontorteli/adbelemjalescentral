import { Smartphone } from 'lucide-react';

/**
 * Aparece só com o celular deitado (regra .aviso-paisagem em globals.css),
 * pedindo para voltar à posição vertical.
 */
export function AvisoPaisagem() {
  return (
    <div
      className="aviso-paisagem fixed inset-0 flex-col items-center justify-center gap-3 bg-white px-6 text-center"
      style={{ zIndex: 2147483646 }}
    >
      <Smartphone className="h-12 w-12 text-[#374151]" aria-hidden />
      <p className="text-lg font-semibold text-[#374151]">Gire o celular</p>
      <p className="text-sm text-[#4b5563]">O app da AD Belém Jales funciona na posição vertical.</p>
    </div>
  );
}
