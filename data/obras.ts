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
  },
];
