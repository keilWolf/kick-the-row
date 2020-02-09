import Game from '../src/game'

describe("Game", () => {

  test("should be instanceable", () => {
    let game = new Game()
    expect(game).toBeInstanceOf(Game)
    expect(game.numOfTotalElements()).toBe(27)
  })

  test("should do next round move", () => {
    let game = new Game()
    game.nextRound()
    expect(game.numOfTotalElements()).toBe(54)
  })

  test("should do next round move", () => {
    let game = new Game()
    game.elements[0][1] = 0
    game.elements[0][2] = 0
    game.nextRound()
    expect(game.numOfTotalElements()).toBe(52)
    expect(game.numOfLeftElements()).toBe(50)
  })

  test("remove single line", () => {
    let game = new Game()
    game.elements[0] = [0,0,0,0,0,0,0,0,0]
    game.removeCompletedLines()
    expect(game.elements).toHaveLength(2)
  })

  test("remove multiple lines", () => {
    let game = new Game()
    game.elements[0] = [0,0,0,0,0,0,0,0,0]
    game.elements[2] = [0,0,0,0,0,0,0,0,0]
    game.removeCompletedLines()
    expect(game.elements).toHaveLength(1)
  })

  test("dont remove eliminated but not full line", () => {
    let game = new Game()
    game.elements.concat([0,0,0,0,0,0,0])
    game.removeCompletedLines()
    expect(game.elements).toHaveLength(3)
  })
})

/*
describe("LoadEmptyGame", () => {
  it("should load nothing", () => {
    // TODO
    //expect(JSON.parse(window.localStorage.getItem('state'))).toBe(undefined)
    throw new Error('TODO')
  })
})

describe("LoadGame", () => {
  it("should load a game state", () => {
    // TODO
    //expect(JSON.parse(window.localStorage.getItem('state'))).toBe(undefined)
    throw new Error('TODO')
  })
})

describe("SaveGame", () => {
  it("should save a game state", () => {
    throw new Error('TODO')
  })
})

describe("Selection", () => {

  test("one or both are invalid", () => {
    throw new Error('TODO')
  }),

  test("is matching", () => {
    throw new Error('TODO')
  })

  test("is not matching", () => {
    throw new Error('TODO')
  })

  test("direct Neighbours X", () => {
    throw new Error('TODO')
  })

  test("direct Neighbours Y", () => {
    throw new Error('TODO')
  })

  test("UNdirect Neighbours X", () => {
    throw new Error('TODO')
  })

  test("UNdirect Neighbours Y", () => {
    throw new Error('TODO')
  })

  test("correct count", () => {
    throw new Error('TODO')
  })

  test("incorrect count", () => {
    throw new Error('TODO')
  })

})
*/