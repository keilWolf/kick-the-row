import Game from '../src/game'

describe("Game", () => {
  it("should be instanceable", () => {
    expect(new Game()).toBeInstanceOf(Game);
  });
});