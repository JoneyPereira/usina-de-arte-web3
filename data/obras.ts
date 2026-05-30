export interface Acessibilidade {
  audiodescricaoCurta: string;
  audiodescricaoLonga: string;
  textoAudiodescricaoCurta: string;
  textoAudiodescricaoLonga: string;
  textoLibras: string;
}

export interface Obra {
  id: string;
  titulo: string;
  artista: string;
  descricao: string;
  posicao: [number, number, number];
  cor: string;
  corEmissiva?: string;
  raioProximidade: number;
  modeloCaminho: string;
  escala?: [number, number, number];
  acessibilidade: Acessibilidade;
}

export const obras: Obra[] = [
  {
    id: "locomotiva",
    titulo: "Locomotiva Histórica",
    artista: "Acervo da Usina Santa Terezinha",
    descricao:
      "Locomotiva original da antiga usina de cana-de-açúcar, símbolo da era industrial da Zona da Mata Sul de Pernambuco. Marco visual de chegada ao parque.",
    posicao: [0, 0, 0],
    cor: "#5a3e2b",
    corEmissiva: "#a0622a",
    raioProximidade: 5,
    modeloCaminho: "/models/locomotiva.glb",
    acessibilidade: {
      audiodescricaoCurta: "/audio/desc-locomotiva-curta.mp3",
      audiodescricaoLonga: "/audio/desc-locomotiva-longa.mp3",
      textoAudiodescricaoCurta:
        "À sua frente, uma locomotiva a vapor do início do século XX. O veículo metálico de cor escura possui caldeira cilíndrica horizontal, chaminé vertical no centro e rodas largas de aço em ambos os lados. Ela repousa sobre trilhos enferrujados, emoldurada pela vegetação tropical do parque.",
      textoAudiodescricaoLonga:
        "A locomotiva que você contempla é uma réplica do veículo histórico que transportou cana-de-açúcar pela Usina Santa Terezinha desde sua fundação em 1929. Com cerca de oito metros de comprimento e três de altura, domina a entrada do parque como marco monumental da memória do trabalho agrícola no interior de Pernambuco. A caldeira escurecida pelo tempo guarda décadas de vapor, fuligem e movimento. As rodas de aço — grandes e imponentes nas extremidades, menores no centro — contam a mecânica de uma era inteira. No exterior pernambucano, sob o sol dourado do entardecer, a locomotiva não é apenas maquinário: é símbolo de uma civilização construída sobre a doçura e o suor da cana.",
      textoLibras:
        "Locomotiva Histórica, acervo da Usina Santa Terezinha. Uma locomotiva a vapor do início do século XX, em metal escuro, com caldeira cilíndrica horizontal, chaminé vertical e rodas de aço, sobre trilhos enferrujados. Símbolo da era industrial canavieira de Pernambuco, transportou cana-de-açúcar na usina desde 1929.",
    },
  },
  {
    id: "diva",
    titulo: "Diva",
    artista: "Juliana Notari",
    descricao:
      "Escultura monumental de 33 metros que se abre em uma colina como uma fenda vermelha na terra. Obra da artista recifense que dialoga com corpo, gênero e natureza.",
    posicao: [30, 2, -40],
    cor: "#c0392b",
    corEmissiva: "#e74c3c",
    raioProximidade: 8,
    modeloCaminho: "/models/diva.glb",
    acessibilidade: {
      audiodescricaoCurta: "/audio/desc-diva-curta.mp3",
      audiodescricaoLonga: "/audio/desc-diva-longa.mp3",
      textoAudiodescricaoCurta:
        "Diante de você, uma grande escultura vermelha encravada na encosta de uma colina. A forma é alongada e vertical, com uma abertura central que se aprofunda como uma fenda na terra. A cor é vermelha intensa, brilhante, contrastando com o verde da vegetação ao redor.",
      textoAudiodescricaoLonga:
        "'Diva' é uma obra monumental da artista recifense Juliana Notari, aqui representada em escala significativa sobre uma colina de terra. A escultura em poliuretano e fibra de vidro apresenta uma superfície lisa e vermelha-viva, com um rasgo vertical que se abre desde o topo até a base — uma ferida ou portal que divide a forma ao meio. A luz do entardecer intensifica o vermelho, criando um efeito quase incandescente. A obra evoca o corpo feminino, a terra, a ferida e o renascimento simultaneamente. Seu título, 'Diva', carrega ironia e grandiosidade ao mesmo tempo. Caminhe ao redor dela para perceber como a fenda muda de aparência conforme o ângulo de visão — às vezes fechada, às vezes escancarada, dependendo de onde você estiver.",
      textoLibras:
        "Diva, da artista Juliana Notari, de Recife. Escultura monumental vermelha na encosta de uma colina. Forma vertical alongada com fenda central que se abre como ferida na terra. Evoca o corpo feminino, a terra e o renascimento. A fenda muda de aparência conforme o ângulo de quem observa.",
    },
  },
  {
    id: "paisagem",
    titulo: "Paisagem",
    artista: "Regina Silveira",
    descricao:
      "Labirinto formado por 59 vidros marcados por tiros. A obra da artista paulista transforma a violência em experiência estética e reflexão sobre a paisagem brasileira.",
    posicao: [60, 0, -20],
    cor: "#85c1e9",
    corEmissiva: "#aed6f1",
    raioProximidade: 6,
    modeloCaminho: "/models/paisagem.glb",
    acessibilidade: {
      audiodescricaoCurta: "/audio/desc-paisagem-curta.mp3",
      audiodescricaoLonga: "/audio/desc-paisagem-longa.mp3",
      textoAudiodescricaoCurta:
        "À sua frente, duas fileiras paralelas de painéis de vidro industrial suspendidos por uma grade metálica. Cada vidro apresenta um padrão de rachaduras irradiando de um ponto central — como se tivesse recebido o impacto de um tiro. A luz atravessa os vidros criando reflexos e sombras no chão.",
      textoAudiodescricaoLonga:
        "'Paisagem' é uma obra da artista paulista Regina Silveira que transforma violência em poética visual. Cinquenta e nove painéis de vidro industrial — dispostos em duas fileiras que formam um corredor de passagem — foram marcados por disparos de espingarda. Cada vidro carrega o registro único de seu impacto: um buraco central cercado de rachaduras que se irradiam como uma teia. Ao atravessar o corredor, você percorre uma história de violência e sobrevivência. A luz que filtra pelos vidros fragmentados projeta sombras geométricas irregulares no chão, transformando o espaço ao longo do dia conforme o ângulo do sol muda. A obra confronta o espectador com a fragilidade do vidro — e com a fragilidade de qualquer paisagem diante da força humana.",
      textoLibras:
        "Paisagem, da artista paulista Regina Silveira. Duas fileiras paralelas de vidros industriais marcados por disparos de espingarda. Cinquenta e nove painéis formam um corredor; cada vidro tem buraco central com rachaduras em teia. A obra transforma violência em poética visual e reflexão sobre a paisagem brasileira.",
    },
  },
  {
    id: "brasil2017",
    titulo: "Brasil 2017",
    artista: "Paulo Bruscky",
    descricao:
      "Instalação do artista recifense Paulo Bruscky que usa a linguagem da arte postal e conceitual para comentar o momento político e social do Brasil.",
    posicao: [90, 0, -60],
    cor: "#27ae60",
    corEmissiva: "#2ecc71",
    raioProximidade: 5,
    modeloCaminho: "/models/brasil2017.glb",
    acessibilidade: {
      audiodescricaoCurta: "/audio/desc-brasil2017-curta.mp3",
      audiodescricaoLonga: "/audio/desc-brasil2017-longa.mp3",
      textoAudiodescricaoCurta:
        "Você se aproxima de uma instalação sobre uma mesa longa coberta de papéis, envelopes e carimbos. As peças são amareladas pelo tempo, com marcas vermelhas de tinta de carimbo. Uma parede ao fundo exibe uma colagem densa de documentos superpostos.",
      textoAudiodescricaoLonga:
        "'Brasil 2017' é uma obra do artista recifense Paulo Bruscky, referência da arte postal e conceitual brasileira desde os anos 1970. A instalação reúne envelopes selados, cartas abertas, carimbos de borracha, mapas e documentos — a linguagem gráfica do Estado e da burocracia — reorganizados como arquivo crítico do momento político. O amarelamento dos papéis evoca o tempo, o acúmulo, a memória. Os carimbos vermelhos — símbolos de aprovação, rejeição, controle — marcam cada superfície como feridas administrativas. Paulo Bruscky usa o sistema postal como meio artístico há décadas: a carta que viaja sem destino certo, o envelope que carrega mensagem impossível, o carimbo que autoriza o que não deveria ser autorizado. 'Brasil 2017' é um arquivo de um país em crise visto pela lente de um artista que nunca parou de enviar mensagens.",
      textoLibras:
        "Brasil 2017, do artista recifense Paulo Bruscky. Instalação com mesa longa coberta de papéis, envelopes, carimbos vermelhos e documentos amarelados pelo tempo. Parede ao fundo exibe colagem densa. Usa a linguagem da arte postal para criticar o momento político brasileiro.",
    },
  },
  {
    id: "hangar-rufino",
    titulo: "Hangar José Rufino",
    artista: "José Rufino",
    descricao:
      "Instalação do artista paraibano dentro do hangar histórico da usina. Reúne facões de corte de cana, documentos e memórias da cultura sucroalcooleira de Pernambuco.",
    posicao: [120, 0, -10],
    cor: "#7f8c8d",
    corEmissiva: "#bdc3c7",
    raioProximidade: 10,
    modeloCaminho: "/models/hangar-rufino.glb",
    acessibilidade: {
      audiodescricaoCurta: "/audio/desc-hangar-curta.mp3",
      audiodescricaoLonga: "/audio/desc-hangar-longa.mp3",
      textoAudiodescricaoCurta:
        "Você entra em um hangar industrial de teto alto, com paredes de concreto e estrutura metálica. Suspensos por fios do teto, dezenas de facões pairam no ar à sua volta. Uma mesa central exibe documentos manuscritos sob luz cônica de spots direcionados.",
      textoAudiodescricaoLonga:
        "A instalação do artista paraibano José Rufino ocupa o hangar histórico da Usina Santa Terezinha — um espaço que em si já é parte da obra. O ambiente industrial de teto alto, colunas metálicas e janelas gradeadas abriga dezenas de facões suspensos por fios invisíveis, pairando no ar como memória suspensa do trabalho na cana. O facão foi por séculos o instrumento de corte da cana-de-açúcar no Nordeste — e também instrumento de violência, de luta, de sobrevivência. José Rufino os recolhe, limpa e suspende: retira o objeto do trabalho e o transforma em monumento. Na mesa central, documentos manuscritos — cartas, registros, inventários — constroem o arquivo afetivo de famílias ligadas à usina por gerações. Os spots de luz direcionada criam sombras longas dos facões no chão de concreto. Caminhe entre eles devagar: a sombra que você projeta se mistura à deles.",
      textoLibras:
        "Hangar José Rufino, do artista paraibano José Rufino. Instalação no hangar histórico da Usina Santa Terezinha. Dezenas de facões de corte de cana suspensos por fios pairam no ar. Mesa central com documentos manuscritos sob luz dirigida. O facão, antes ferramenta de trabalho e violência, é transformado em monumento de memória.",
    },
  },
];
