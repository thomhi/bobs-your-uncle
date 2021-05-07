db.createCollection("answerCards");
db.createCollection("questionCards");
db.createCollection("users");

let aCards =  [
  { "content": "A lifetime of sadness"},
  { "content": "Your mouth"},
  { "content": "Having no legs, just toes"},
  { "content": "Changing a person's mind with logix and facts"},
  { "content": "A possible Muslim"},
  { "content": "Reindeer crap"},
  { "content": "Putting too much sauce on a pizza"},
  { "content": "Reddit in a nutshell"},
  { "content": "Super, super serious terminal cancer"},
  { "content": "Arnold Schwarzenegger"},
  { "content": "The ice cream truck!"},
  { "content": "That girl from the Hungry Games"},
  { "content": "Knowng the legal age of consent in 50 different countries"},
  { "content": "Zombie duck"},
  { "content": "72 Virgins"},
  { "content": "Dead parents"},
  { "content": "Naked granny"},
  { "content": "Hemorrhoids"},
  { "content": "Greece"},
  { "content": "Micropenis"},
  { "content": "Immeasurable stupidity"},
  { "content": "America"},
  { "content": "Genocide"},
  { "content": "Bobby Shmurda"},
  { "content": "Gaylord Silly - The Seychellois long-distance runner"},
  { "content": "The communist manifesto"},
  { "content": "Mitch Gaylord - The American gymnast"},
  { "content": "Nazis"},
  { "content": "Rectal prolapse"},
];

aCards.forEach((card)=>{
  db.answerCards.insertOne(card);
});

let qCards = [
  {
    "content": "Art isn't just a painting in a stuffy museum. Art is alive. Art is __________.",
    "numberOfFields": 1
  },
  {
    "content": "Houston we have __________.",
    "numberOfFields": 1
  },
  {
    "content": "Hunting defenseless animals doesn't make you a badass. You want to be a real badass? Try __________.",
    "numberOfFields": 1
  },
  {
    "content": "I'm not like the rest of you. I'm too rich and busy for __________ .",
    "numberOfFields": 1
  },
  {
    "content": "In his farewell address, George Washington famously warned Americans about the dangers of __________.",
    "numberOfFields": 1
  },
  {
    "content": "Whoever says __________ must also say __________.",
    "numberOfFields": 2
  },
  {
    "content": "Today on The New York Times: The 7 funniest pictures from __________ with __________.",
    "numberOfFields": 2
  },
  {
    "content": "Before the spring break, many __________ have been exposed this year.",
    "numberOfFields": 1
  },
  {
    "content": "Introducing the next K-Pop sensation __________ and __________",
    "numberOfFields": 2
  },
  {
    "content": "The theater club made a magnificent performance about __________",
    "numberOfFields": 1
  },
  {
    "content": "Vegeta, what does the scouter say about his power? It's over __________!",
    "numberOfFields": 1
  },
  {
    "content": "The furry community remorsefully admits to being __________",
    "numberOfFields": 1
  },
  {
    "content": "Bongo cat was yesterday here comes __________ cat",
    "numberOfFields": 1
  },
  {
    "content": "E-girls are destroying __________",
    "numberOfFields": 1
  }
];

qCards.forEach((card)=>{
  db.questionCards.insertOne(card);
});