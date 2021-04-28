export class APIService {

  getHandCards() {
    return [
      "A lifetime of sadness",
      "Your mouth",
      "Having no legs, just toes",
      "Changing a person's mind with logix and facts",
      "Such a simple request…",
      "A possible Muslim",
      "Knowng the legal age of consent in 50 different countries",
      "Dead parents",
    ];
  }

  getPlayCard() {
    return {
      text:
        "Hunting defenseless animals does not make you a badass. You want to be a real badass? Try __________.",
    };
  }

  getPlayers() {
    return [
      { player: "Abinas", points: 5 },
      { player: "Joel", points: 4 },
      { player: "Jonas", points: -4 },
      { player: "Thomas", points: 2 },
      { player: "Cedi", points: 1 },
      { player: "Peter", points: 0 },
      { player: "Hans", points: 0 },
    ];
  }
}

export const apiService = new APIService();
