const editais = [
  {
    id: 'regimento-interno',
    titulo: 'Edital de Convocação de Assembleia Geral Extraordinária',
    itemOrdemDia: 'Leitura e ciência do Regimento Interno da Igreja.',
    textoItem:
      'Durante a Assembleia será procedida a leitura para conhecimento de todos do Regimento Interno da igreja.',
    textoComplementar:
      'O texto integral do Regimento Interno permanecerá à disposição dos membros para consulta prévia na secretaria da Igreja, garantindo-se plena transparência e publicidade dos atos.',
  },
  {
    id: 'reforma-estatuto',
    titulo: 'Edital de Convocação de Assembleia Geral Extraordinária',
    itemOrdemDia:
      'Reforma do Estatuto Social da Igreja, com apreciação e deliberação acerca das alterações, supressões e acréscimos propostos.',
    textoItem:
      'Durante a Assembleia será procedida a leitura apenas dos artigos que sofrerão alteração, supressão ou acréscimo, permanecendo inalterados os demais dispositivos, em razão da extensão do Estatuto vigente, composto por 48 (quarenta e oito) artigos, com seus parágrafos e incisos, em vigor há mais de 19 (dezenove) anos.',
    textoComplementar:
      'O texto integral do Estatuto vigente, bem como a minuta consolidada das alterações propostas, permanecerá à disposição dos membros para consulta prévia na secretaria da Igreja, garantindo-se plena transparência e publicidade dos atos.',
  },
];

const assinaturaPastorClaudioUrl = new URL('../assets/assinatura-pastor-claudio.png', import.meta.url).href;

const CABECALHO = `A IGREJA EVANGÉLICA ASSEMBLEIA DE DEUS EM JALES, PESSOA JURÍDICA DE DIREITO PRIVADO, INSCRITA NO CNPJ SOB Nº 53.218.798/0001-09, TEM SUA SEDE E FORO NA CIDADE E COMARCA DE JALES, ESTADO DE SÃO PAULO, LOCALIZADA NA RUA DOIS, Nº 288, JARDIM AMÉRICA.`;

const CORPO_INICIAL = `O Pastor Presidente da IGREJA EVANGÉLICA ASSEMBLEIA DE DEUS EM JALES, Estado de São Paulo, no uso de suas atribuições estatutárias, convoca todos os membros em pleno gozo de seus direitos estatutários para reunirem-se em ASSEMBLEIA GERAL EXTRAORDINÁRIA, a realizar-se no templo central da Igreja, situado à Avenida Francisco Jalles, nº 3575, Vila Maria, Jales/SP, no dia 09 de maio de 2026, às 19:30h, em primeira convocação, com a presença da maioria absoluta dos membros, ou, em segunda convocação, às 19:45h, com 1/3 (um terço) dos membros, sendo as matérias aprovadas por concorde de 2/3 (dois terços) dos membros presentes, para deliberarem sobre a seguinte ORDEM DO DIA:`;

function Assinatura() {
  return (
    <div className="mt-14">
      <p className="mb-14 text-right text-[1.05rem]">Jales/SP, 09 de abril de 2026.</p>
      <img
        src={assinaturaPastorClaudioUrl}
        alt="Assinatura do Pr. Cláudio de Oliveira, Pastor Presidente"
        className="h-auto w-auto"
        style={{ width: '170px', maxWidth: '170px' }}
        loading="lazy"
      />
      <div className="mt-2 max-w-sm">
        <div className="mb-2 border-t border-[#6b7280]" />
        <p className="text-[1.15rem] font-medium">Cláudio de Oliveira</p>
        <p className="text-[1.1rem] font-semibold">Pastor Presidente</p>
      </div>
    </div>
  );
}

function DocumentoCard({ edital, numero }) {
  return (
    <article className="rounded-2xl border border-[#d1d5db] bg-[#fffefb] p-6 shadow-sm md:p-10">
      <header className="mx-auto mb-8 max-w-4xl text-center">
        <p className="mb-5 text-sm font-semibold uppercase tracking-[0.16em] text-[#4b5563]">
          Edital {String(numero).padStart(2, '0')}
        </p>
        <p className="text-[1.05rem] font-semibold uppercase leading-relaxed tracking-wide text-[#111827] md:text-[1.15rem]">
          {CABECALHO}
        </p>
        <h2 className="mt-8 text-2xl font-bold uppercase tracking-wide text-[#111827] md:text-3xl">
          {edital.titulo}
        </h2>
        <div className="mx-auto mt-6 h-px w-40 bg-[#9ca3af]" />
      </header>

      <div className="mx-auto max-w-4xl space-y-5 text-justify font-serif text-[1.15rem] leading-9 text-[#111827] md:text-[1.22rem]">
        <p>{CORPO_INICIAL}</p>
        <p className="rounded-lg bg-[#f9fafb] px-4 py-3">
          <strong>{numero}. </strong>
          <strong>{edital.itemOrdemDia}</strong>
        </p>
        <p>{edital.textoItem}</p>
        <p>{edital.textoComplementar}</p>
      </div>

      <div className="mx-auto max-w-4xl">
        <Assinatura />
      </div>
    </article>
  );
}

export default function EditalPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f3f4f6] to-[#e5e7eb] pt-24 pb-32 md:pt-28 md:pb-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <header className="mb-10 text-center md:mb-14">
          <h1 className="text-3xl font-semibold tracking-tight text-[#374151] md:text-4xl">Edital</h1>
          <p className="mt-3 text-base text-[#4b5563] md:text-lg">
            Documentos oficiais para leitura da Assembleia Geral Extraordinária
          </p>
        </header>

        <section className="space-y-8">
          {editais.map((edital, idx) => (
            <DocumentoCard key={edital.id} edital={edital} numero={idx + 1} />
          ))}
        </section>
      </div>
    </div>
  );
}
