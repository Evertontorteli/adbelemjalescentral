import { useState } from 'react';
import { Copy, Check, Building2, ChevronDown } from 'lucide-react';

const QRCODE_PIX_SRC = '/static/qrcode_pix.png';

const PIX_RECEBEDOR = 'AD Belém Jales';
const PIX_KEY_CNPJ = '53.218.798/0001-09';
// Código "PIX copia e cola" lido do QR Code em static/qrcode_pix.png (sem valor definido: a pessoa digita no banco)
const PIX_COPIA_E_COLA =
  '00020126360014BR.GOV.BCB.PIX0114532187980001095204000053039865802BR5914AD BELEM JALES6005Jales62070503***6304270F';

const BANCO_NOME = 'Itaú';
const BANCO_CODIGO = '341';
const BANCO_AGENCIA = '0614';
const BANCO_CONTA = '27620-2';

const CARD_CLASS = 'rounded-2xl border border-[#e5e7eb]/80 bg-white shadow-[0_6px_20px_rgba(17,24,39,0.10)]';

async function copiarTexto(texto) {
  try {
    await navigator.clipboard.writeText(texto);
    return true;
  } catch {
    // Alguns navegadores (ou o app instalado) bloqueiam a área de transferência: tenta o método antigo
    const campo = document.createElement('textarea');
    campo.value = texto;
    campo.setAttribute('readonly', '');
    campo.style.position = 'fixed';
    campo.style.opacity = '0';
    document.body.appendChild(campo);
    campo.select();
    const ok = document.execCommand('copy');
    campo.remove();
    return ok;
  }
}

/** Botão que copia um texto e mostra "Copiado!" por 2 segundos. */
function BotaoCopiar({ texto, rotulo, variante = 'secundario', className = '' }) {
  const [estado, setEstado] = useState('parado');

  const copiar = async () => {
    setEstado((await copiarTexto(texto)) ? 'copiado' : 'erro');
    setTimeout(() => setEstado('parado'), 2000);
  };

  const estilos = {
    primario: 'w-full min-h-12 justify-center rounded-full bg-[#374151] px-5 text-base font-semibold text-white hover:bg-[#4b5563]',
    secundario: 'w-full min-h-11 justify-center rounded-full border border-[#6b7280]/30 bg-white px-5 text-sm font-medium text-[#374151] hover:bg-gray-50',
    icone: 'h-11 w-11 shrink-0 justify-center rounded-full text-[#374151] hover:bg-gray-100',
  };

  const Icone = estado === 'copiado' ? Check : Copy;
  const mensagem = estado === 'copiado' ? 'Copiado!' : estado === 'erro' ? 'Não foi possível copiar' : rotulo;

  return (
    <button
      type="button"
      onClick={copiar}
      className={`inline-flex items-center gap-2 transition-colors active:scale-[0.98] ${estilos[variante]} ${className}`}
      aria-label={variante === 'icone' ? rotulo : undefined}
    >
      <Icone className={variante === 'primario' ? 'h-5 w-5' : 'h-4 w-4'} aria-hidden />
      {variante !== 'icone' && mensagem}
      <span className="sr-only" aria-live="polite">{estado === 'copiado' ? 'Copiado' : ''}</span>
    </button>
  );
}

function CartaoPix() {
  const [qrErro, setQrErro] = useState(false);

  return (
    <section aria-labelledby="titulo-pix" className={`${CARD_CLASS} p-5`}>
      <div className="text-center">
        <h2 id="titulo-pix" className="text-lg font-bold text-[#374151]">PIX</h2>
        <p className="text-sm text-[#4b5563]">Recebedor: {PIX_RECEBEDOR}</p>
        <p className="text-sm text-[#4b5563]">Chave CNPJ: <span className="font-semibold text-[#374151]">{PIX_KEY_CNPJ}</span></p>
      </div>

      <div className="mt-4 flex flex-col items-center">
        {qrErro ? (
          <p className="py-6 text-sm text-[#4b5563]">QR Code indisponível. Use o código ou a chave abaixo.</p>
        ) : (
          <img
            src={QRCODE_PIX_SRC}
            alt="QR Code do PIX da AD Belém Jales"
            className="h-56 w-56 rounded-xl border border-[#e5e7eb] bg-white object-contain p-2"
            onError={() => setQrErro(true)}
          />
        )}
        <p className="mt-2 text-xs text-[#6b7280]">Escaneie com a câmera do app do banco</p>
      </div>

      <div className="mt-5 flex flex-col gap-3 border-t border-[#e5e7eb] pt-5">
        <BotaoCopiar texto={PIX_COPIA_E_COLA} rotulo="Copiar código PIX" variante="primario" />
        <p className="text-center text-xs leading-relaxed text-[#4b5563]">
          Ou no app do banco, escolha <strong>PIX Copia e Cola</strong>, cole o código e digite o valor.
        </p>
        <BotaoCopiar texto={PIX_KEY_CNPJ.replace(/\D/g, '')} rotulo="Copiar chave CNPJ" />
      </div>
    </section>
  );
}

function LinhaDado({ rotulo, valor }) {
  return (
    <div className="flex items-center justify-between gap-3 py-1">
      <div>
        <dt className="text-xs uppercase tracking-wider text-[#6b7280]">{rotulo}</dt>
        <dd className="text-lg font-semibold text-[#374151]">{valor}</dd>
      </div>
      <BotaoCopiar texto={valor} rotulo={`Copiar ${rotulo.toLowerCase()}`} variante="icone" />
    </div>
  );
}

/** Transferência é pouco usada: fica recolhida embaixo do PIX. */
function CartaoBanco() {
  const [aberto, setAberto] = useState(false);

  return (
    <section aria-labelledby="titulo-banco" className={`${CARD_CLASS} px-5 py-1`}>
      <h2 id="titulo-banco">
        <button
          type="button"
          onClick={() => setAberto((v) => !v)}
          aria-expanded={aberto}
          aria-controls="dados-banco"
          className="flex min-h-14 w-full items-center gap-3 text-left text-[#374151]"
        >
          <Building2 className="h-5 w-5 shrink-0 text-[#6b7280]" aria-hidden />
          <span className="flex-1">
            <span className="block text-base font-semibold">Transferência bancária</span>
            <span className="block text-sm font-normal text-[#4b5563]">Banco {BANCO_NOME} ({BANCO_CODIGO})</span>
          </span>
          <ChevronDown className={`h-5 w-5 shrink-0 transition-transform ${aberto ? 'rotate-180' : ''}`} aria-hidden />
        </button>
      </h2>
      <div id="dados-banco" hidden={!aberto} className="pb-4">
        <dl className="divide-y divide-[#e5e7eb] border-t border-[#e5e7eb]">
          <LinhaDado rotulo="Agência" valor={BANCO_AGENCIA} />
          <LinhaDado rotulo="Conta" valor={BANCO_CONTA} />
        </dl>
        <BotaoCopiar
          texto={`Banco: ${BANCO_NOME} (${BANCO_CODIGO})\nAgência: ${BANCO_AGENCIA}\nConta: ${BANCO_CONTA}`}
          rotulo="Copiar todos os dados"
          className="mt-3"
        />
      </div>
    </section>
  );
}

export function Doacoes() {
  return (
    <div id="doacoes" className="mx-auto max-w-4xl px-4">
      <header className="mb-6 text-center">
        <h1 className="text-3xl font-semibold tracking-tight text-[#374151] md:text-4xl">Doação</h1>
        <p className="mt-1 text-sm text-[#4b5563] md:text-base">Contribua com a obra de Deus</p>
      </header>

      <div className="mx-auto flex max-w-md flex-col gap-4">
        <CartaoPix />
        <CartaoBanco />
      </div>

      <figure className="mx-auto mt-8 max-w-2xl px-2 text-center">
        <blockquote className="text-sm italic leading-relaxed text-[#4b5563] md:text-base">
          “Trazei todos os dízimos à casa do tesouro, para que haja mantimento na minha casa, e depois fazei prova
          de mim nisto, diz o Senhor dos Exércitos.”
        </blockquote>
        <figcaption className="mt-2 text-sm font-semibold text-[#374151]">Malaquias 3:10</figcaption>
      </figure>
    </div>
  );
}
