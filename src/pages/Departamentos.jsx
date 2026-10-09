import { useState } from 'react';
import {
  HandHeart,
  Flower2,
  MicVocal,
  Music,
  Piano,
  BadgeCheck,
  GraduationCap,
  Baby,
  Sprout,
  BookOpen,
  Flame,
  Globe,
  HeartHandshake,
  ChevronDown,
  MessageCircle,
} from 'lucide-react';
import { whatsappSecretariaUrl } from '../config/contato.js';

const GRUPOS = [
  {
    id: 'louvor',
    titulo: 'Louvor e música',
    departamentos: [
      { id: 'equipe-louvor', icon: Music, title: 'Equipe de Louvor Dádiva Sagrada', resumo: 'Ministério de louvor e adoração', description: 'A visão do Ministério é sermos achados por Deus como verdadeiros adoradores (João 4:24). Nosso propósito é usar os talentos e habilidades concedidos por Deus sob a unção do Espírito Santo para encorajar o corpo de Cristo a expressar uma verdadeira adoração que glorifique ao Criador, levando a igreja a crescer na prática bíblica do Louvor e da Adoração.' },
      { id: 'coral', icon: MicVocal, title: 'Coral', resumo: 'Vozes femininas e masculinas no louvor', description: 'O Coral tem como objetivo exclusivo a adoração através do louvor. Trabalhamos vozes femininas e masculinas para juntos louvarmos ao Senhor nos cultos e em datas comemorativas. O Coral normalmente apresenta um estilo de música mais sacra e litúrgica, mas também abordamos outros estilos musicais para abranger todos os públicos. Venha participar conosco!' },
      { id: 'orquestra', icon: Piano, title: 'Orquestra Louvores Celestes', resumo: 'Músicos voluntários e aulas gratuitas', description: 'Orquestra Louvores Celestes é um diferencial no nosso templo hoje, com músicos voluntários e capacitados em apresentar o melhor para Deus e nos proporcionar uma experiência única através dos louvores apresentados. Um compromisso que o maestro tem com o ministério é oferecer aulas gratuitas a todos com o desejo de aprender.' },
    ],
  },
  {
    id: 'ensino',
    titulo: 'Ensino e formação',
    departamentos: [
      { id: 'ebd', icon: BookOpen, title: 'Escola Bíblica Dominical', resumo: 'Classes para crianças, jovens e adultos', description: 'Na vida somos eternos alunos. Possuímos classes para crianças, jovens e adultos, sejam eles novos convertidos ou membros, para que todos tenham acesso ao ensino bíblico de qualidade. Venha estar conosco!' },
      { id: 'discipulado', icon: Sprout, title: 'Discipulado', resumo: 'Mentoria para novos convertidos', description: 'A igreja do Senhor vem sofrendo cada vez mais evasões de cristãos que se afastaram de Deus, após aceitarem a Jesus Cristo. O curso de mentoria para novos convertidos foi criado justamente para suprir essa demanda, firmando o cristão na rocha.' },
      { id: 'curso-teologico', icon: GraduationCap, title: 'Curso Teológico', resumo: 'Estudo aprofundado da Palavra de Deus', description: 'O Curso de Teologia tem o intuito de treinar o aluno através do estudo das principais questões teológicas da fé cristã, passando o conhecimento da palavra de Deus de forma profunda e sistemática, para defender a sua fé e obter crescimento espiritual com professores graduados e capacitados.' },
      { id: 'curso-cupom', icon: BadgeCheck, title: 'Curso Cupom', resumo: 'Preparação de obreiros e missionárias', description: 'O Curso Preparatório para Obreiros e Ministros tem por finalidade a capacitação dos futuros obreiros e missionárias. Os participantes recebem orientações a respeito do método de trabalho do ministério, cargos eclesiásticos e hierarquia, bem como as características e conduta que um bom obreiro e missionária precisam ter para desenvolver um trabalho com excelência.' },
    ],
  },
  {
    id: 'familias',
    titulo: 'Famílias e gerações',
    departamentos: [
      { id: 'departamento-infantil', icon: Baby, title: 'Departamento Infantil (DIA)', resumo: 'Ensino bíblico por faixa etária', description: 'DIA trabalha no cuidado das nossas crianças. Para isso, temos material didático exclusivo para cada faixa etária, professores capacitados para ensinar e salas mobiliadas, pensadas em cada detalhe para recebê-las. Provérbios 22:6 diz: "Ensine a criança no caminho em que deve andar, e até quando envelhecer não se desviará dele". Seguimos essa palavra à risca e investimos no futuro cristão de nossas crianças!' },
      { id: 'umadej', icon: Flame, title: 'Grupo de Jovens (UMADEJ)', resumo: 'Jovens unidos para servir a Deus', description: 'UMADEJ tem como objetivo auxiliar os jovens a desenvolver sua identidade em Cristo e promover o crescimento espiritual. Com o CONGRESSO da UMADEJ, realizado uma vez por ano, buscamos unir a juventude. Jovens alinhados em um só propósito: servir a Deus em união, adorar a Ele, lutar contra o pecado e levar vidas para o Céu.' },
      { id: 'circulo-oracao', icon: Flower2, title: 'Círculo de Oração (UFADJA)', resumo: 'Encontros, palestras e chás para mulheres', description: 'O departamento UFADJA visa trabalhar efetivamente com as mulheres da igreja, através de palestras, encontros, chás e reuniões exclusivas para o desenvolvimento individual e coletivo. Nosso objetivo é ajudar as mulheres a melhorar como mãe, esposa, filha e pessoa, tanto dentro da igreja como fora dela.' },
      { id: 'unidos-para-sempre', icon: HeartHandshake, title: 'Unidos Para Sempre', resumo: 'Ministério de casais', description: 'O Ministério de Casais busca apoiar, aconselhar, incentivar e resgatar as famílias através da integração dos casais e do desenvolvimento do testemunho cristão. Os frutos deste trabalho podem ser vistos em diversos lares que foram transformados, restaurados e curados pelo poder de Cristo.' },
    ],
  },
  {
    id: 'acao',
    titulo: 'Ação social e missões',
    departamentos: [
      { id: 'acao-social', icon: HandHeart, title: 'Ação Social', resumo: 'Alimento e apoio a famílias em dificuldade', description: 'Ação social é um trabalho crucial. Gálatas 6:10 diz: Portanto, enquanto temos oportunidade, façamos o bem a todos, especialmente aos da família da fé. Em "fazer o bem" está incluso uma palavra de conforto, oferecer o alimento e suporte necessário a quem está em dificuldades. Por isso, sua ajuda é muito importante, seja mantenedor desta obra e faça famílias felizes.' },
      { id: 'missoes', icon: Globe, title: 'Missões Graça para Todos', resumo: 'Missões, acolhimento e congressos', description: 'A Missão Graça para Todos é um departamento que atua de forma direta e estratégica para ajudar a igreja. Além de acolhimento a cristãos refugiados no Brasil e ao redor do mundo, a Graça Para Todos desenvolve projetos de treinamentos, eventos e congressos buscando sempre ações que possam fortalecer a Igreja e pregar as boas novas a toda criatura.' },
    ],
  },
];

const CARD_CLASS = 'rounded-2xl border border-[#e5e7eb]/80 bg-white shadow-[0_6px_20px_rgba(17,24,39,0.10)]';

function Departamento({ dept }) {
  const [aberto, setAberto] = useState(false);
  const Icon = dept.icon;
  const painelId = `dept-${dept.id}`;

  return (
    <li className="border-b border-[#e5e7eb] last:border-b-0">
      <h3>
        <button
          type="button"
          onClick={() => setAberto((v) => !v)}
          aria-expanded={aberto}
          aria-controls={painelId}
          className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-gray-50 active:bg-gray-100"
        >
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#f3f4f6] text-[#374151]" aria-hidden>
            <Icon className="h-5 w-5" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-base font-bold leading-snug text-[#374151]">{dept.title}</span>
            <span className="block text-sm text-[#4b5563]">{dept.resumo}</span>
          </span>
          <ChevronDown className={`h-5 w-5 shrink-0 text-[#6b7280] transition-transform ${aberto ? 'rotate-180' : ''}`} aria-hidden />
        </button>
      </h3>
      <div id={painelId} hidden={!aberto} className="px-4 pb-4">
        <p className="text-[15px] leading-relaxed text-[#374151]">{dept.description}</p>
        <a
          href={whatsappSecretariaUrl(`Olá! Gostaria de saber como participar do departamento ${dept.title}.`)}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-flex min-h-11 items-center gap-2 rounded-full border border-[#6b7280]/30 bg-white px-4 text-sm font-medium text-[#374151] transition-colors hover:bg-gray-50"
        >
          <MessageCircle className="h-4 w-4" aria-hidden />
          Quero participar
        </a>
      </div>
    </li>
  );
}

export default function Departamentos() {
  return (
    <div className="min-h-screen bg-white pt-8 pb-[calc(8rem+env(safe-area-inset-bottom))] lg:pt-28 lg:pb-24">
      <div className="mx-auto max-w-5xl px-4">
        <header className="mb-6 text-center">
          <h1 className="text-3xl font-semibold tracking-tight text-[#374151] md:text-4xl">Departamentos</h1>
          <p className="mx-auto mt-1 max-w-md text-sm text-[#4b5563] md:text-base">
            Encontre seu lugar e use seus dons para servir.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:items-start">
          {GRUPOS.map((grupo) => (
            <section key={grupo.id} aria-labelledby={`grupo-${grupo.id}`}>
              <h2 id={`grupo-${grupo.id}`} className="mb-3 text-lg font-semibold text-[#374151]">
                {grupo.titulo}
              </h2>
              <ul className={`overflow-hidden ${CARD_CLASS}`}>
                {grupo.departamentos.map((dept) => (
                  <Departamento key={dept.id} dept={dept} />
                ))}
              </ul>
            </section>
          ))}
        </div>

        <section aria-labelledby="fale-conosco" className={`mx-auto mt-10 max-w-md p-5 text-center ${CARD_CLASS}`}>
          <h2 id="fale-conosco" className="text-lg font-bold text-[#374151]">Quer fazer parte de um ministério?</h2>
          <p className="mt-1 text-sm text-[#4b5563]">Fale com a secretaria e descubra como servir e crescer em comunidade.</p>
          <a
            href={whatsappSecretariaUrl('Olá! Gostaria de saber como fazer parte de um ministério da igreja.')}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-[#374151] px-5 text-base font-semibold text-white transition-colors hover:bg-[#4b5563]"
          >
            <MessageCircle className="h-5 w-5" aria-hidden />
            Fale conosco
          </a>
        </section>
      </div>
    </div>
  );
}
