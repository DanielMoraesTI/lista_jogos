export const GAMER_QUOTES = [
  { text: "It's dangerous to go alone! Take this.", source: "The Legend of Zelda" },
  { text: "The cake is a lie.", source: "Portal" },
  { text: "Would you kindly... continuar rolando a página?", source: "BioShock" },
  { text: "War. War never changes.", source: "Fallout" },
  { text: "Thank you Mario! But our princess is in another castle!", source: "Super Mario Bros." },
  { text: "Do a barrel roll!", source: "Star Fox 64" },
  { text: "Hey! Listen!", source: "Navi, a fada mais insistente de Hyrule" },
  { text: "A man chooses, a slave obeys.", source: "BioShock" },
  { text: "Stay awhile and listen.", source: "Diablo" },
  { text: "You died. (De novo.)", source: "Dark Souls" },
  { text: "Praise the sun! ☀️", source: "Dark Souls" },
  { text: "Nothing is true, everything is permitted.", source: "Assassin's Creed" },
  { text: "Rise and shine, Mr. Freeman.", source: "Half-Life 2" },
  { text: "Snake? Snake?! SNAAAAAKE!", source: "Metal Gear Solid" },
  { text: "Finish him!", source: "Mortal Kombat" },
  { text: "All your base are belong to us.", source: "Zero Wing" },
  { text: "Só mais uma partida... (são 3h da manhã)", source: "Todo gamer, sempre" },
  { text: "Backlog não é pilha de vergonha, é plano de aposentadoria.", source: "Sabedoria popular" },
  { text: "Salve o jogo antes do chefe. Sempre.", source: "Lição aprendida da pior forma" },
  { text: "Soprar o cartucho resolve 90% dos problemas.", source: "Suporte técnico dos anos 90" },
  { text: "I used to be an adventurer like you, then I took an arrow in the knee.", source: "Skyrim" },
  { text: "Grass grows, birds fly, sun shines, and brother, I hurt people.", source: "Team Fortress 2" },
] as const;

export function randomQuote() {
  return GAMER_QUOTES[Math.floor(Math.random() * GAMER_QUOTES.length)];
}
