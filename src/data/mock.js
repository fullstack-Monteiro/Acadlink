export const UNIVERSITIES = [
  'UEM — Universidade Eduardo Mondlane',
  'ISCTEM — Instituto Superior de Ciências e Tecnologia de Moçambique',
  'UCM — Universidade Católica de Moçambique',
  'ISRI — Instituto Superior de Relações Internacionais',
  'A Politécnica — Universidade Politécnica',
  'UniLúrio — Universidade Lúrio',
  'USTM — Universidade São Tomás de Moçambique',
  'ISPU — Instituto Superior Politécnico e Universitário',
  'UP — Universidade Pedagógica',
  'ISCISA — Instituto Superior de Ciências de Saúde',
  'Outra',
]

export const COURSES = [
  'Engenharia Informática', 'Engenharia Civil', 'Medicina', 'Direito',
  'Economia', 'Gestão de Empresas', 'Arquitectura', 'Enfermagem',
  'Educação', 'Jornalismo', 'Relações Internacionais', 'Matemática',
  'Física', 'Química', 'Biologia', 'Outro',
]

export const REACTIONS = [
  { key: 'like',    emoji: '👍', label: 'Like',      color: '#1877F2' },
  { key: 'love',    emoji: '❤️', label: 'Like',      color: '#F33E58' },
  { key: 'haha',    emoji: '😂', label: 'Haha',       color: '#F7B125' },
  { key: 'wow',     emoji: '😮', label: 'Uau',        color: '#F7B125' },
  { key: 'sad',     emoji: '😢', label: 'Triste',     color: '#F7B125' },
  { key: 'angry',   emoji: '😡', label: 'Grr',        color: '#E9710F' },
]

export const ALL_USERS = [
  { id: 1,  name: 'Amina Machava',    username: 'amina.machava',  gender: 'female', university: 'UEM — Universidade Eduardo Mondlane',                          course: 'Engenharia Informática', year: '3º Ano', bio: 'Apaixonada por tecnologia 🚀',                    connections: 248, posts: 14, verified: true,  verifiedUniversity: 'UEM — Universidade Eduardo Mondlane',  status: 'online',  lastSeen: null },
  { id: 2,  name: 'Samuel Nhantumbo', username: 'samuel.n',      gender: 'male',   university: 'UEM — Universidade Eduardo Mondlane',                          course: 'Engenharia Civil',          year: '4º Ano', bio: 'Construindo o futuro de Moçambique 🏗️',           connections: 189, posts: 22, verified: true,  verifiedUniversity: 'UEM — Universidade Eduardo Mondlane',  status: 'offline', lastSeen: Date.now() - 12 * 60 * 1000 },
  { id: 3,  name: 'Fatima Cossa',     username: 'fatima.cossa',   gender: 'female', university: 'ISCTEM — Instituto Superior de Ciências e Tecnologia de Moçambique', course: 'Gestão de Empresas', year: '2º Ano', bio: 'Empreendedora em formação 💼',              connections: 312, posts: 31, verified: false, verifiedUniversity: null,                                   status: 'online',  lastSeen: null },
  { id: 4,  name: 'João Sitoe',       username: 'joao.sitoe',     gender: 'male',   university: 'UP — Universidade Pedagógica',                                 course: 'Educação',            year: '3º Ano', bio: 'Educação transforma vidas 📚',                    connections: 156, posts: 18, verified: false, verifiedUniversity: null,                                   status: 'offline', lastSeen: Date.now() - 2 * 60 * 60 * 1000 },
  { id: 5,  name: 'Beatrice Mondlane',username: 'beatrice.m',    gender: 'female', university: 'UniLúrio — Universidade Lúrio',                                course: 'Medicina',            year: '5º Ano', bio: 'Futura médica 🩺',                                connections: 421, posts: 27, verified: true,  verifiedUniversity: 'UniLúrio — Universidade Lúrio',        status: 'online',  lastSeen: null },
  { id: 6,  name: 'Pedro Macuácua',   username: 'pedro.mac',      gender: 'male',   university: 'UEM — Universidade Eduardo Mondlane',                          course: 'Engenharia Informática', year: '2º Ano', bio: 'Dev em construção 💻',                            connections: 98,  posts: 9,  verified: false, verifiedUniversity: null,                                   status: 'online',  lastSeen: null },
  { id: 7,  name: 'Lúcia Tembe',      username: 'lucia.tembe',    gender: 'female', university: 'ISCTEM — Instituto Superior de Ciências e Tecnologia de Moçambique', course: 'Marketing',     year: '3º Ano', bio: 'Criativa e estratégica ✨',                        connections: 267, posts: 35, verified: false, verifiedUniversity: null,                                   status: 'offline', lastSeen: Date.now() - 35 * 60 * 1000 },
  { id: 8,  name: 'Hélder Bila',      username: 'helder.bila',    gender: 'male',   university: 'UP — Universidade Pedagógica',                                 course: 'Matemática',          year: '4º Ano', bio: 'Números são poesia 🔢',                           connections: 134, posts: 12, verified: false, verifiedUniversity: null,                                   status: 'offline', lastSeen: Date.now() - 24 * 60 * 60 * 1000 },
  { id: 9,  name: 'Sofia Guambe',     username: 'sofia.guambe',   gender: 'female', university: 'UCM — Universidade Católica de Moçambique',                    course: 'Direito',             year: '1º Ano', bio: 'Justiça acima de tudo ⚖️',                        connections: 87,  posts: 7,  verified: true,  verifiedUniversity: 'UCM — Universidade Católica de Moçambique', status: 'online', lastSeen: null },
  { id: 10, name: 'Mário Cuna',       username: 'mario.cuna',     gender: 'male',   university: 'ISRI — Instituto Superior de Relações Internacionais',         course: 'Relações Internacionais', year: '3º Ano', bio: 'O mundo é a minha sala de aula 🌍',               connections: 203, posts: 19, verified: false, verifiedUniversity: null,                                   status: 'offline', lastSeen: Date.now() - 3 * 24 * 60 * 60 * 1000 },
]

export const POSTS = [
  {
    id: 1,
    author: ALL_USERS[1],
    content: 'Acabei de defender a minha monografia com distinção! 🎓 Obrigado a todos que me apoiaram nesta jornada. O tema foi "Gestão de Resíduos Sólidos em Maputo" — um problema real que precisa de soluções reais.',
    category: 'académico',
    image: null,
    reactions: { like: 45, love: 12, haha: 8, wow: 5, sad: 0, angry: 0 },
    myReaction: null,
    commentCount: 23,
    shares: 12,
    time: '2h atrás',
    saved: false,
    comments: [
      { id: 1, author: ALL_USERS[2], text: 'Parabéns Carlos! Mereces muito 🎉', time: '1h atrás', likes: 5 },
      { id: 2, author: ALL_USERS[0], text: 'Que orgulho! Inspiração para todos nós 💪', time: '45min atrás', likes: 3 },
    ],
  },
  {
    id: 2,
    author: ALL_USERS[2],
    content: '🚀 Oportunidade de estágio na Vodacom Moçambique! Estão a recrutar estudantes de Engenharia e TI para o programa de estágio de verão 2026. Prazo: 30 de Maio. Link nas oportunidades!',
    category: 'oportunidade',
    image: null,
    reactions: { like: 89, love: 23, haha: 5, wow: 12, sad: 0, angry: 0 },
    myReaction: 'like',
    commentCount: 41,
    shares: 89,
    time: '4h atrás',
    saved: true,
    comments: [
      { id: 1, author: ALL_USERS[5], text: 'Obrigado pela partilha! Já me inscrevi 🙌', time: '3h atrás', likes: 8 },
      { id: 2, author: ALL_USERS[6], text: 'Alguém sabe se é remunerado?', time: '2h atrás', likes: 2 },
      { id: 3, author: ALL_USERS[2], text: '@lucia.tembe Sim, 15.000 MT/mês!', time: '2h atrás', likes: 12 },
    ],
  },
  {
    id: 3,
    author: ALL_USERS[3],
    content: 'Hackathon Nacional de Inovação Educacional — 15 e 16 de Junho em Maputo. Equipas de 3-5 pessoas. Prémio de 150.000 MT para o 1º lugar. Quem quer formar equipa comigo? 💡',
    category: 'evento',
    image: null,
    reactions: { like: 112, love: 34, haha: 18, wow: 45, sad: 0, angry: 0 },
    myReaction: null,
    commentCount: 67,
    shares: 134,
    time: '6h atrás',
    saved: false,
    comments: [
      { id: 1, author: ALL_USERS[0], text: 'Eu quero participar! Manda mensagem 🙋‍♀️', time: '5h atrás', likes: 7 },
      { id: 2, author: ALL_USERS[5], text: 'Conta comigo também!', time: '4h atrás', likes: 4 },
    ],
  },
  {
    id: 4,
    author: ALL_USERS[4],
    content: 'Partilhando os meus apontamentos de Anatomia do 2º ano. Foram muito úteis para mim, espero que ajudem outros colegas! 📚 #Medicina #UniLurio #Estudo',
    category: 'académico',
    image: null,
    reactions: { like: 67, love: 12, haha: 3, wow: 8, sad: 0, angry: 0 },
    myReaction: 'love',
    commentCount: 18,
    shares: 45,
    time: '1d atrás',
    saved: false,
    comments: [
      { id: 1, author: ALL_USERS[8], text: 'Muito obrigada Beatriz! Salvaste-me 🙏', time: '20h atrás', likes: 6 },
    ],
  },
  {
    id: 5,
    author: ALL_USERS[6],
    content: 'Dica de estudo: o método Pomodoro mudou a minha vida académica. 25 min de foco + 5 min de pausa. Já experimentaram? Os resultados nos exames melhoraram muito! ⏱️📖',
    category: 'académico',
    image: null,
    reactions: { like: 203, love: 45, haha: 22, wow: 89, sad: 0, angry: 0 },
    myReaction: 'wow',
    commentCount: 54,
    shares: 78,
    time: '2d atrás',
    saved: true,
    comments: [
      { id: 1, author: ALL_USERS[7], text: 'Uso há 2 anos, funciona mesmo! 💯', time: '1d atrás', likes: 15 },
      { id: 2, author: ALL_USERS[3], text: 'Vou experimentar antes dos exames finais', time: '1d atrás', likes: 9 },
    ],
  },
  {
    id: 6,
    author: ALL_USERS[9],
    content: 'Conferência Internacional de Estudantes Africanos em Lisboa — candidaturas abertas para estudantes moçambicanos! Cobre passagem + alojamento. Prazo: 1 de Junho 🌍✈️',
    category: 'oportunidade',
    image: null,
    reactions: { like: 178, love: 56, haha: 0, wow: 34, sad: 0, angry: 0 },
    myReaction: null,
    commentCount: 89,
    shares: 201,
    time: '3d atrás',
    saved: false,
    comments: [],
  },
  {
    id: 7,
    author: ALL_USERS[0],
    content: 'Primeiro dia de estágio na Vodacom! 🚀 O ambiente é incrível, a equipa super acolhedora. Mal posso esperar para aprender e contribuir. Obrigada a todos que me apoiaram nesta jornada! #Estágio #Vodacom #EngInformática',
    category: 'académico',
    image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260',
    reactions: { like: 134, love: 67, haha: 12, wow: 23, sad: 0, angry: 0 },
    myReaction: 'love',
    commentCount: 31,
    shares: 18,
    time: '5h atrás',
    saved: false,
    comments: [
      { id: 1, author: ALL_USERS[1], text: 'Parabéns Ana! Vais arrasar 💪', time: '4h atrás', likes: 11 },
      { id: 2, author: ALL_USERS[5], text: 'Que sorte! Como foi o processo de selecção?', time: '3h atrás', likes: 4 },
      { id: 3, author: ALL_USERS[0], text: '@pedro.mac Enviei o CV e fiz uma entrevista técnica. Posso partilhar dicas!', time: '3h atrás', likes: 9 },
    ],
  },
  {
    id: 8,
    author: ALL_USERS[1],
    content: 'Visita técnica ao estaleiro da nova ponte sobre o Rio Zambeze 🏗️ Que projecto monumental! Como futuros engenheiros civis, momentos como este são a razão pela qual escolhemos este curso. #EngCivil #UEM #Moçambique',
    category: 'académico',
    image: 'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260',
    reactions: { like: 212, love: 89, haha: 15, wow: 54, sad: 0, angry: 0 },
    myReaction: 'wow',
    commentCount: 47,
    shares: 62,
    time: '1d atrás',
    saved: false,
    comments: [
      { id: 1, author: ALL_USERS[5], text: 'Que vista incrível! Queria ter ido 😍', time: '22h atrás', likes: 7 },
      { id: 2, author: ALL_USERS[8], text: 'Moçambique a crescer! 🇲🇿', time: '20h atrás', likes: 14 },
    ],
  },
  {
    id: 9,
    author: ALL_USERS[4],
    content: 'Sessão de estudo em grupo antes dos exames finais 📚 Somos 6 colegas do 5º ano de Medicina e já são 23h mas a energia ainda está alta! A biblioteca da UniLúrio é o nosso segundo lar. Força a todos nos exames! 💉🩺',
    category: 'académico',
    image: 'https://images.pexels.com/photos/3775537/pexels-photo-3775537.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260',
    reactions: { like: 301, love: 134, haha: 23, wow: 78, sad: 0, angry: 0 },
    myReaction: 'love',
    commentCount: 63,
    shares: 41,
    time: '2d atrás',
    saved: true,
    comments: [
      { id: 1, author: ALL_USERS[2], text: 'Força guerreiros! 💪 Vão conseguir!', time: '2d atrás', likes: 22 },
      { id: 2, author: ALL_USERS[7], text: 'Medicina é mesmo dedicação total. Respeito enorme 🙏', time: '1d atrás', likes: 18 },
      { id: 3, author: ALL_USERS[4], text: 'Obrigada a todos! Passámos todos 🎉🎉', time: '12h atrás', likes: 45 },
    ],
  },
  {
    id: 10,
    author: ALL_USERS[2],
    content: '🏆 A nossa equipa ganhou o Hackathon Nacional de Inovação! Desenvolvemos uma app de gestão de resíduos sólidos para municípios moçambicanos. 150.000 MT de prémio e, mais importante, uma solução real para o nosso país! Orgulho enorme da equipa 🇲🇿💡',
    category: 'evento',
    image: 'https://images.pexels.com/photos/936051/pexels-photo-936051.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260',
    reactions: { like: 445, love: 234, haha: 45, wow: 189, sad: 0, angry: 0 },
    myReaction: 'love',
    commentCount: 112,
    shares: 203,
    time: '3d atrás',
    saved: false,
    comments: [
      { id: 1, author: ALL_USERS[0], text: 'PARABÉNS!!! Merecidíssimo 🏆🔥', time: '3d atrás', likes: 34 },
      { id: 2, author: ALL_USERS[9], text: 'Que projecto incrível! Quando lançam a app?', time: '2d atrás', likes: 19 },
      { id: 3, author: ALL_USERS[2], text: '@mario.cuna Estamos a trabalhar nisso! Em breve 🚀', time: '2d atrás', likes: 28 },
    ],
  },
  {
    id: 11,
    author: ALL_USERS[6],
    content: 'Workshop de Marketing Digital para estudantes universitários — foi uma tarde incrível! ✨ Aprendemos sobre SEO, redes sociais e estratégias de conteúdo. Obrigada ao ISCTEM pela organização. Quem mais participou? #Marketing #ISCTEM #Workshop',
    category: 'evento',
    image: 'https://images.pexels.com/photos/1239298/pexels-photo-1239298.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260',
    reactions: { like: 167, love: 56, haha: 34, wow: 43, sad: 0, angry: 0 },
    myReaction: null,
    commentCount: 38,
    shares: 29,
    time: '4d atrás',
    saved: false,
    comments: [
      { id: 1, author: ALL_USERS[2], text: 'Eu participei! Foi mesmo muito bom 👏', time: '4d atrás', likes: 8 },
      { id: 2, author: ALL_USERS[3], text: 'Quando é o próximo? Quero ir!', time: '3d atrás', likes: 5 },
    ],
  },
]

export const SUGGESTIONS = [
  { ...ALL_USERS[5], mutual: 5 },
  { ...ALL_USERS[6], mutual: 3 },
  { ...ALL_USERS[7], mutual: 8 },
  { ...ALL_USERS[8], mutual: 2 },
]

export const OPPORTUNITIES = [
  {
    id: 1, type: 'estágio',
    title: 'Estágio em Desenvolvimento de Software',
    company: 'Vodacom Moçambique', location: 'Maputo', deadline: '30 Mai 2026',
    description: 'Programa de estágio para estudantes de Engenharia Informática e áreas afins. Duração de 3 meses com possibilidade de contratação.',
    tags: ['TI', 'Programação', 'Maputo'], featured: true,
  },
  {
    id: 2, type: 'bolsa',
    title: 'Bolsa de Estudos — Mestrado em Portugal',
    company: 'Fundação Calouste Gulbenkian', location: 'Lisboa, Portugal', deadline: '15 Jun 2026',
    description: 'Bolsas para estudantes moçambicanos de excelência para prosseguir estudos de mestrado em universidades portuguesas.',
    tags: ['Bolsa', 'Mestrado', 'Internacional'], featured: true,
  },
  {
    id: 3, type: 'evento',
    title: 'Hackathon Nacional de Inovação',
    company: 'MCTES', location: 'Maputo', deadline: '10 Jun 2026',
    description: 'Competição nacional de inovação tecnológica para estudantes universitários. Prémio de 150.000 MT.',
    tags: ['Hackathon', 'Inovação', 'Tecnologia'], featured: false,
  },
  {
    id: 4, type: 'concurso',
    title: 'Prémio Nacional de Empreendedorismo Jovem',
    company: 'BCI Fomento', location: 'Nacional', deadline: '20 Jul 2026',
    description: 'Concurso para jovens empreendedores com ideias inovadoras. Financiamento até 500.000 MT para os melhores projetos.',
    tags: ['Empreendedorismo', 'Negócios', 'Jovens'], featured: false,
  },
  {
    id: 5, type: 'estágio',
    title: 'Estágio em Finanças e Contabilidade',
    company: 'Banco de Moçambique', location: 'Maputo', deadline: '5 Jun 2026',
    description: 'Oportunidade para estudantes de Economia, Gestão e Contabilidade. Estágio remunerado de 6 meses.',
    tags: ['Finanças', 'Banco', 'Economia'], featured: false,
  },
  {
    id: 6, type: 'bolsa',
    title: 'Bolsa STEM para Mulheres',
    company: 'Google.org Africa', location: 'Remoto', deadline: '1 Jul 2026',
    description: 'Programa de bolsas para mulheres africanas em cursos STEM. Inclui mentoria, networking e suporte financeiro.',
    tags: ['STEM', 'Mulheres', 'Google'], featured: true,
  },
]

export const CONVERSATIONS = [
  {
    id: 1,
    user: ALL_USERS[5],
    lastMessage: 'Obrigado pelos apontamentos! 🙏',
    time: '10:32', unread: 2,
    messages: [
      { id: 1, from: 6, text: 'Olá Ana! Vi o teu post sobre os apontamentos de Cálculo.', time: '10:20' },
      { id: 2, from: 1, text: 'Olá Pedro! Sim, podes pedir que eu envio.', time: '10:25' },
      { id: 3, from: 6, text: 'Obrigado pelos apontamentos! 🙏', time: '10:32' },
    ],
  },
  {
    id: 2,
    user: ALL_USERS[6],
    lastMessage: 'Vemo-nos no hackathon!',
    time: 'Ontem', unread: 0,
    messages: [
      { id: 1, from: 7, text: 'Oi! Viste o hackathon que o João partilhou?', time: 'Ontem' },
      { id: 2, from: 1, text: 'Sim! Estou a pensar participar. Tu?', time: 'Ontem' },
      { id: 3, from: 7, text: 'Vemo-nos no hackathon!', time: 'Ontem' },
    ],
  },
  {
    id: 3,
    user: ALL_USERS[7],
    lastMessage: 'Boa sorte na defesa! 💪',
    time: 'Seg', unread: 0,
    messages: [
      { id: 1, from: 1, text: 'Hélder, tens algum material sobre Álgebra Linear?', time: 'Seg' },
      { id: 2, from: 8, text: 'Tenho sim! Vou enviar amanhã.', time: 'Seg' },
      { id: 3, from: 8, text: 'Boa sorte na defesa! 💪', time: 'Seg' },
    ],
  },
]

export const STORIES = [
  {
    id: 1,
    user: ALL_USERS[1],
    seen: false,
    emoji: '🎓',
    text: 'Defesa hoje!',
    image: 'https://www.isutc.ac.mz/wp-content/uploads/2023/10/1D4A0864-scaled.jpg'
  },
  {
    id: 2,
    user: ALL_USERS[2],
    seen: false,
    emoji: '💼',
    text: 'Estágio Vodacom',
    image: 'https://jornal.uem.mz/wp-content/uploads/2023/10/Estudante-da-UEM-conquista-3%C2%B0-lugar-do-concurso-Ponte-Chinesa.jpg'
  },
  {
    id: 3,
    user: ALL_USERS[4],
    seen: true,
    emoji: '📚',
    text: 'Apontamentos',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS5ShmPhiEK3b7XdyHpvL6jUQF52iU5WBkzNg&s'
  },
  {
    id: 4,
    user: ALL_USERS[6],
    seen: true,
    emoji: '✨',
    text: 'Dica do dia',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQSVq3PGBcuuQPxiOCa5dS7QS20bxr-pXlChg&s'
  },
  {
    id: 5,
    user: ALL_USERS[9],
    seen: false,
    emoji: '🌍',
    text: 'Conferência',
    image: 'https://images.pexels.com/photos/1239298/pexels-photo-1239298.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260'
  },
]

export const GROUPS = [
  {
    id: 1,
    name: 'Engenharia UEM',
    description: 'Grupo para estudantes de engenharia da UEM. Partilha de apontamentos, dúvidas e oportunidades.',
    university: 'UEM — Universidade Eduardo Mondlane',
    adminIds: [1, 2],
    moderatorIds: [6],
    memberCount: 312,
    reported: false,
  },
  {
    id: 2,
    name: 'Medicina UniLúrio',
    description: 'Comunidade dos estudantes de medicina da UniLúrio. Casos clínicos, estágios e muito mais.',
    university: 'UniLúrio — Universidade Lúrio',
    adminIds: [5],
    moderatorIds: [],
    memberCount: 178,
    reported: false,
  },
  {
    id: 3,
    name: 'Empreendedores ISCTEM',
    description: 'Estudantes empreendedores do ISCTEM. Ideias, projectos e networking.',
    university: 'ISCTEM — Instituto Superior de Ciências e Tecnologia de Moçambique',
    adminIds: [3],
    moderatorIds: [7],
    memberCount: 245,
    reported: false,
  },
  {
    id: 4,
    name: 'Hackathon Moçambique',
    description: 'Grupo aberto para todos os estudantes interessados em hackathons e competições de inovação.',
    university: null,
    adminIds: [4],
    moderatorIds: [1, 10],
    memberCount: 534,
    reported: false,
  },
  {
    id: 5,
    name: 'Direito UCM',
    description: 'Estudantes de Direito da UCM. Discussão de casos, legislação moçambicana e oportunidades.',
    university: 'UCM — Universidade Católica de Moçambique',
    adminIds: [9],
    moderatorIds: [],
    memberCount: 89,
    reported: false,
  },
  {
    id: 6,
    name: 'Relações Internacionais ISRI',
    description: 'Comunidade dos estudantes do ISRI. Política internacional, diplomacia e oportunidades globais.',
    university: 'ISRI — Instituto Superior de Relações Internacionais',
    adminIds: [10],
    moderatorIds: [],
    memberCount: 134,
    reported: false,
  },
]

export const PORTFOLIO = [
  {
    id: 1, userId: 1,
    title: 'Sistema de Gestão de Biblioteca',
    description: 'Aplicação web para gestão de empréstimos e devoluções de livros. Desenvolvida com React e Node.js.',
    type: 'projecto',
    links: [{ label: 'GitHub', url: 'https://github.com' }],
    year: '2024',
  },
  {
    id: 2, userId: 1,
    title: 'Artigo: IA na Educação em Moçambique',
    description: 'Trabalho publicado na revista académica da UEM sobre o impacto da inteligência artificial no ensino superior.',
    type: 'publicação',
    links: [],
    year: '2024',
  },
  {
    id: 3, userId: 1,
    title: 'Portfólio de Design',
    description: 'Colecção de projectos de UI/UX desenvolvidos durante o curso.',
    type: 'projecto',
    links: [{ label: 'Behance', url: 'https://behance.net' }],
    year: '2023',
  },
]

export const ACHIEVEMENTS = [
  { id: 1, userId: 1, type: 'prémio',       icon: '🏆', title: '1º Lugar — Hackathon UEM 2024',         date: 'Nov 2024' },
  { id: 2, userId: 1, type: 'certificado',  icon: '📜', title: 'Certificado Google — Data Analytics',   date: 'Set 2024' },
  { id: 3, userId: 1, type: 'certificado',  icon: '📜', title: 'AWS Cloud Practitioner',                date: 'Jul 2024' },
  { id: 4, userId: 1, type: 'reconhecimento', icon: '🎖️', title: 'Melhor Estudante do Semestre — UEM', date: 'Jun 2024' },
]

export const SUBJECTS = [
  { semester: '1º Semestre', subjects: [
    { name: 'Cálculo I', grade: 16 },
    { name: 'Álgebra Linear', grade: 14 },
    { name: 'Programação I', grade: 18 },
    { name: 'Inglês Técnico', grade: 17 },
  ]},
  { semester: '2º Semestre', subjects: [
    { name: 'Cálculo II', grade: 15 },
    { name: 'Estruturas de Dados', grade: 17 },
    { name: 'Programação II', grade: 19 },
    { name: 'Física I', grade: 13 },
  ]},
  { semester: '3º Semestre', subjects: [
    { name: 'Bases de Dados', grade: 18 },
    { name: 'Redes de Computadores', grade: 16 },
    { name: 'Sistemas Operativos', grade: 15 },
    { name: 'Estatística', grade: 14 },
  ]},
  { semester: '4º Semestre', subjects: [
    { name: 'Engenharia de Software', grade: 19 },
    { name: 'Inteligência Artificial', grade: 17 },
    { name: 'Segurança Informática', grade: 16 },
    { name: 'Projecto I', grade: null },
  ]},
]

export const RECOMMENDATIONS = [
  {
    id: 1, userId: 1,
    from: { name: 'Prof. António Machava', role: 'Professor de Engenharia de Software — UEM', avatar: null },
    text: 'A Ana é uma estudante excepcionalmente dedicada. A sua capacidade de resolver problemas complexos e trabalhar em equipa é notável. Recomendo-a sem reservas.',
    date: 'Março 2026',
    type: 'professor',
  },
  {
    id: 2, userId: 1,
    from: { name: 'Carlos Nhantumbo', role: 'Colega — Eng. Civil, UEM', avatar: null },
    from_user: ALL_USERS[1],
    text: 'Trabalhámos juntos no hackathon de 2024. A Ana trouxe ideias inovadoras e liderou a equipa com muita competência. Uma parceira de trabalho incrível.',
    date: 'Dezembro 2024',
    type: 'colega',
  },
  {
    id: 3, userId: 1,
    from: { name: 'Eng. Sara Bila', role: 'Supervisora de Estágio — Vodacom Moçambique', avatar: null },
    text: 'Durante o estágio, a Ana demonstrou profissionalismo e capacidade técnica acima da média. Adaptou-se rapidamente ao ambiente corporativo.',
    date: 'Agosto 2024',
    type: 'supervisor',
  },
]

export const HASHTAGS = [
  { tag: '#UEM2026', count: 234 },
  { tag: '#Hackathon', count: 189 },
  { tag: '#Bolsas', count: 156 },
  { tag: '#Estágios', count: 143 },
  { tag: '#Medicina', count: 128 },
  { tag: '#TI', count: 112 },
  { tag: '#Exames', count: 98 },
  { tag: '#Direito', count: 87 },
]

export const CONNECTION_TYPES = {
  colega:       { label: 'Colega',       icon: '🔗', desc: 'Mesmo curso' },
  universitario:{ label: 'Universitário',icon: '🏛️', desc: 'Mesma universidade' },
  academico:    { label: 'Académico',    icon: '🌍', desc: 'Qualquer universidade' },
  mentor:       { label: 'Mentor',       icon: '👨‍🏫', desc: 'Relação de mentoria' },
}

export const DOC_TYPES = ['Todos', 'Apontamentos', 'Exames', 'Trabalhos', 'Livros', 'Slides']

export const LIBRARY_DOCS = [
  {
    id: 1, title: 'Apontamentos de Cálculo I', type: 'Apontamentos', format: 'PDF',
    course: 'Engenharia Informática', university: 'UEM — Universidade Eduardo Mondlane',
    author: ALL_USERS[0], year: '2024', pages: 45, downloads: 234, rating: 4.7,
    ratingCount: 38, saved: false, description: 'Resumo completo de Cálculo I com exercícios resolvidos.',
  },
  {
    id: 2, title: 'Exame Final de Álgebra Linear 2023', type: 'Exames', format: 'PDF',
    course: 'Engenharia Informática', university: 'UEM — Universidade Eduardo Mondlane',
    author: ALL_USERS[7], year: '2023', pages: 8, downloads: 412, rating: 4.9,
    ratingCount: 67, saved: true, description: 'Exame final com resolução detalhada.',
  },
  {
    id: 3, title: 'Slides de Anatomia — 2º Ano', type: 'Slides', format: 'PPT',
    course: 'Medicina', university: 'UniLúrio — Universidade Lúrio',
    author: ALL_USERS[4], year: '2024', pages: 120, downloads: 189, rating: 4.5,
    ratingCount: 29, saved: false, description: 'Slides completos de Anatomia Humana do 2º ano.',
  },
  {
    id: 4, title: 'Trabalho de Gestão Estratégica', type: 'Trabalhos', format: 'DOC',
    course: 'Gestão de Empresas', university: 'ISCTEM — Instituto Superior de Ciências e Tecnologia de Moçambique',
    author: ALL_USERS[2], year: '2024', pages: 32, downloads: 98, rating: 4.2,
    ratingCount: 15, saved: false, description: 'Trabalho de grupo sobre gestão estratégica em PMEs moçambicanas.',
  },
  {
    id: 5, title: 'Apontamentos de Direito Constitucional', type: 'Apontamentos', format: 'PDF',
    course: 'Direito', university: 'UCM — Universidade Católica de Moçambique',
    author: ALL_USERS[8], year: '2024', pages: 67, downloads: 145, rating: 4.6,
    ratingCount: 22, saved: false, description: 'Resumo da Constituição da República de Moçambique e jurisprudência.',
  },
  {
    id: 6, title: 'Introdução às Redes de Computadores', type: 'Livros', format: 'PDF',
    course: 'Engenharia Informática', university: 'UEM — Universidade Eduardo Mondlane',
    author: ALL_USERS[5], year: '2023', pages: 210, downloads: 567, rating: 4.8,
    ratingCount: 89, saved: true, description: 'Livro de referência para a cadeira de Redes de Computadores.',
  },
]
