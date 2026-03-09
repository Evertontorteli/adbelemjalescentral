import {
  Heart,
  Users,
  BookOpen,
  Baby,
  Music,
  Globe,
  Handshake,
  Mic2,
  GraduationCap,
  Cross,
  MessageCircle,
} from 'lucide-react';

const DEPARTAMENTOS = [
  { id: 'acao-social', icon: Heart, title: 'Ação Social', description: 'Ação social é um trabalho crucial. Gálatas 6:10 diz: Portanto, enquanto temos oportunidade, façamos o bem a todos, especialmente aos da família da fé. Em "fazer o bem" está incluso uma palavra de conforto, oferecer o alimento e suporte necessário a quem está em dificuldades. Por isso, sua ajuda é muito importante, seja mantenedor desta obra e faça famílias felizes.', color: 'from-rose-500/90 to-pink-600/90' },
  { id: 'circulo-oracao', icon: Users, title: 'Círculo de Oração (UFADJA)', description: 'O departamento UFADJA visa trabalhar efetivamente com as mulheres da igreja, através de palestras, encontros, chás e reuniões exclusivas para o desenvolvimento individual e coletivo. Nosso objetivo é ajudar as mulheres a melhorar como mãe, esposa, filha e pessoa, tanto dentro da igreja como fora dela.', color: 'from-purple-500/90 to-indigo-600/90' },
  { id: 'coral', icon: Mic2, title: 'Coral', description: 'O Coral tem como objetivo exclusivo a adoração através do louvor. Trabalhamos vozes femininas e masculinas para juntos louvarmos ao Senhor nos cultos e em datas comemorativas. O Coral normalmente apresenta um estilo de música mais sacra e litúrgica, mas também abordamos outros estilos musicais para abranger todos os públicos. Venha participar conosco!', color: 'from-blue-500/90 to-cyan-600/90' },
  { id: 'curso-cupom', icon: BookOpen, title: 'Curso Cupom', description: 'O Curso Preparatório para Obreiros e Ministros tem por finalidade a capacitação dos futuros obreiros e missionárias. Os participantes recebem orientações a respeito do método de trabalho do ministério, cargos eclesiásticos e hierarquia, bem como as características e conduta que um bom obreiro e missionária precisam ter para desenvolver um trabalho com excelência.', color: 'from-amber-500/90 to-orange-600/90' },
  { id: 'curso-teologico', icon: GraduationCap, title: 'Curso Teológico', description: 'O Curso de Teologia tem o intuito de treinar o aluno através do estudo das principais questões teológicas da fé cristã, passando o conhecimento da palavra de Deus de forma profunda e sistemática, para defender a sua fé e obter crescimento espiritual com professores graduados e capacitados.', color: 'from-red-500/90 to-rose-600/90' },
  { id: 'departamento-infantil', icon: Baby, title: 'Departamento Infantil (DIA)', description: 'DIA trabalha no cuidado das nossas crianças. Para isso, temos material didático exclusivo para cada faixa etária, professores capacitados para ensinar e salas mobiliadas, pensadas em cada detalhe para recebê-las. Provérbios 22:6 diz: "Ensine a criança no caminho em que deve andar, e até quando envelhecer não se desviará dele". Seguimos essa palavra à risca e investimos no futuro cristão de nossas crianças!', color: 'from-green-500/90 to-emerald-600/90' },
  { id: 'discipulado', icon: Cross, title: 'Discipulado', description: 'A igreja do Senhor vem sofrendo cada vez mais evasões de cristãos que se afastaram de Deus, após aceitarem a Jesus Cristo. O curso de mentoria para novos convertidos foi criado justamente para suprir essa demanda, firmando o cristão na rocha.', color: 'from-teal-500/90 to-cyan-600/90' },
  { id: 'ebd', icon: BookOpen, title: 'Escola Bíblica Dominical', description: 'Na vida somos eternos alunos. Possuímos classes para crianças, jovens e adultos, sejam eles novos convertidos ou membros, para que todos tenham acesso ao ensino bíblico de qualidade. Venha estar conosco!', color: 'from-indigo-500/90 to-purple-600/90' },
  { id: 'equipe-louvor', icon: Music, title: 'Equipe de Louvor Dádiva Sagrada', description: 'A visão do Ministério é sermos achados por Deus como verdadeiros adoradores (João 4:24). Nosso propósito é usar os talentos e habilidades concedidos por Deus sob a unção do Espírito Santo para encorajar o corpo de Cristo a expressar uma verdadeira adoração que glorifique ao Criador, levando a igreja a crescer na prática bíblica do Louvor e da Adoração.', color: 'from-violet-500/90 to-purple-600/90' },
  { id: 'umadej', icon: Users, title: 'Grupo de Jovens (UMADEJ)', description: 'UMADEJ tem como objetivo auxiliar os jovens a desenvolver sua identidade em Cristo e promover o crescimento espiritual. Com o CONGRESSO da UMADEJ, realizado uma vez por ano, buscamos unir a juventude. Jovens alinhados em um só propósito: servir a Deus em união, adorar a Ele, lutar contra o pecado e levar vidas para o Céu.', color: 'from-orange-500/90 to-red-600/90' },
  { id: 'missoes', icon: Globe, title: 'Missões Graça para Todos', description: 'A Missão Graça para Todos é um departamento que atua de forma direta e estratégica para ajudar a igreja. Além de acolhimento a cristãos refugiados no Brasil e ao redor do mundo, a Graça Para Todos desenvolve projetos de treinamentos, eventos e congressos buscando sempre ações que possam fortalecer a Igreja e pregar as boas novas a toda criatura.', color: 'from-sky-500/90 to-blue-600/90' },
  { id: 'orquestra', icon: Music, title: 'Orquestra Louvores Celestes', description: 'Orquestra Louvores Celestes é um diferencial no nosso templo hoje, com músicos voluntários e capacitados em apresentar o melhor para Deus e nos proporcionar uma experiência única através dos louvores apresentados. Um compromisso que o maestro tem com o ministério é oferecer aulas gratuitas a todos com o desejo de aprender.', color: 'from-fuchsia-500/90 to-pink-600/90' },
  { id: 'unidos-para-sempre', icon: Handshake, title: 'Unidos Para Sempre', description: 'O Ministério de Casais busca apoiar, aconselhar, incentivar e resgatar as famílias através da integração dos casais e do desenvolvimento do testemunho cristão. Os frutos deste trabalho podem ser vistos em diversos lares que foram transformados, restaurados e curados pelo poder de Cristo.', color: 'from-emerald-500/90 to-teal-600/90' },
];

export default function Departamentos() {
  return (
    <div className="min-h-screen bg-white pt-24 pb-40 md:pt-28 md:pb-24">
      <div className="max-w-5xl mx-auto px-4 relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#6b7280]/8 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 left-0 w-64 h-64 bg-[#4b5563]/5 rounded-full blur-3xl pointer-events-none" />

        <header className="text-center mb-20 md:mb-24 relative z-10">
          <span className="text-[#374151] tracking-widest uppercase text-sm font-medium">
            Ministérios
          </span>
          <h1 className="text-[#374151] text-3xl md:text-5xl mt-2 mb-4 font-semibold tracking-tight">
            DEPARTAMENTOS
          </h1>
          <p className="text-[#374151] text-lg max-w-2xl mx-auto mb-0">
            Conheça os setores e ministérios que compõem a AD Belém Jales. Encontre seu lugar e use seus dons para servir.
          </p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 relative z-10">
          {DEPARTAMENTOS.map((dept) => {
            const Icon = dept.icon;
            return (
              <article
                key={dept.id}
                className="rounded-2xl border border-[#e5e7eb]/80 bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-col"
              >
                <div
                  className="p-6 md:p-8 flex flex-col flex-1"
                  style={{ gap: '1.5rem' }}
                >
                  <div>
                    <Icon className="w-5 h-5 md:w-6 md:h-6 text-[#374151]" aria-hidden />
                  </div>
                  <h2 className="text-[#374151] text-lg md:text-xl font-semibold leading-tight">
                    {dept.title}
                  </h2>
                  <p className="text-[#374151] text-base leading-relaxed">
                    {dept.description}
                  </p>
                </div>
              </article>
            );
          })}
        </div>

        <section
          id="fale-conosco-departamentos"
          className="mt-16 mb-16 md:mb-24 text-center relative z-10 w-full"
          aria-label="Fale conosco"
        >
          <div className="rounded-2xl border border-[#e5e7eb] bg-white px-10 py-12 md:px-14 md:py-16 shadow-md max-w-2xl mx-auto">
            <h3 className="text-[#374151] text-xl md:text-2xl font-semibold mb-4">
              Quer fazer parte de um ministério?
            </h3>
            <p className="text-[#374151] text-base md:text-lg leading-relaxed mb-8 max-w-xl mx-auto">
              Entre em contato conosco e descubra como você pode servir e crescer em comunidade.
            </p>
            <a
              href="/#redes-sociais"
              className="inline-flex items-center gap-2 bg-[#e5e7eb] hover:bg-[#d1d5db] text-[#374151] px-6 py-3 rounded-full transition-all shadow-lg border border-[#6b7280]/30"
            >
              <MessageCircle className="w-5 h-5" />
              <span>Fale conosco</span>
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
