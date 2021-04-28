export class GameSettingsService {
    MAXUSERS = 8;
    rounds = 10;
    playTimePerRound = 20;

}

export const gameSettings = new GameSettingsService();