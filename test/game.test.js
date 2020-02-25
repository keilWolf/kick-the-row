import {Game, Element, Selection} from '../src/game'

describe("Game", () => {

  test("should be instanceable", () => {
    let game = new Game()
    expect(game).toBeInstanceOf(Game)
    expect(game.numOfTotalElements()).toBe(27)
  })

  test("should do next round move with new independet elements", () => {
    let game = new Game()
    game.nextRound()
    expect(game.numOfTotalElements()).toBe(54)
    let e1 = game.getElement(0,0)
    let e2 = game.getElement(0,3)
    expect(e1).not.toBe(e2)
  })

  test("should do next round move two eliminated", () => {
    let game = new Game()
    game.getElement(1, 0).eliminated = true
    game.getElement(2, 0).eliminated = true
    game.nextRound()
    expect(game.numOfTotalElements()).toBe(52)
    expect(game.numOfLeftElements()).toBe(50)
  })

  test("remove single line", () => {
    let game = new Game()
    game.elements[0].forEach(element => element.eliminated = true)
    game.removeCompletedLines()
    expect(game.elements).toHaveLength(2)
  })

  test("remove multiple lines", () => {
    let game = new Game()
    let e1 = game.getElement(0, 1)
    game.elements[0].forEach(element => element.eliminated = true)
    game.elements[2].forEach(element => element.eliminated = true)
    game.removeCompletedLines()
    expect(game.elements).toHaveLength(1)
    let e2 = game.getElement(0, 0)
    expect(e1).toBe(e2)
  })

  test("dont remove eliminated but not full line", () => {
    let game = new Game()
    game.elements.concat([0,0,0,0,0,0,0])
    game.removeCompletedLines()
    expect(game.elements).toHaveLength(3)
  })
})


describe("Save--Load Game", () => {
  
  test("should load nothing", () => {
    let game = new Game()
    game.loadState()
    expect(game.elements).toHaveLength(3)
    expect(game.numOfTotalElements()).toBe(27)
    expect(game.getElement(0,0)).toBeInstanceOf(Element)
  })

  test("should load a game state", () => {
    let game = new Game()
    expect(game.numOfTotalElements()).toBe(27)
    game.nextRound()
    expect(game.numOfTotalElements()).toBe(54)
    game.saveGame()
    game.loadState()
    game.loadState()
    expect(game.getElement(0,0)).toBeInstanceOf(Element)
  })
})


describe("Game -- Selections", () => {

  test("Test no selections", () => {
    let game = new Game()
    expect(game.selection1).toBeUndefined()
    expect(game.selection2).toBeUndefined()
  })

  test("Test 1 selections", () => {
    let game = new Game()
    game.select(0, 0)
    expect(game.selection1).toBeDefined()
    expect(game.selection2).toBeUndefined()
    expect(game.isSelection(0, 0)).toBe(true)
    expect(game.isSelection(1, 1)).toBe(false)
  })

  test("Test same selections", () => {
    let game = new Game()
    game.select(0, 0)
    game.select(0, 0)
    expect(game.selection1).toBeUndefined()
    expect(game.selection2).toBeUndefined()
  })

  test("Test 2 selections", () => {
    let game = new Game()
    game.select(0, 0)
    game.select(0, 1)
    expect(game.selection1).toBeDefined()
    expect(game.selection2).toBeDefined()
    expect(game.isSelection(0, 0)).toBe(true)
    expect(game.isSelection(0, 1)).toBe(true)
  })

  test("Test 3 selections", () => {
    let game = new Game()
    game.select(0, 0)
    game.select(0, 1)
    game.select(0, 2)
    expect(game.selection1.element).toBe(game.getElement(0, 0))
    expect(game.selection2.element).toBe(game.getElement(0, 1))
  })
})

describe("Game -- Neighbours", () => {

  test("Test find neighbour in array on start", () => {
    let game = new Game()
    let arr = [1,2,3]
    let nb = game.findNeigboursInArr(arr, 0)
    expect(nb).toHaveLength(2)
    expect(nb[0]).toBeUndefined()
    expect(nb[1]).toBe(2)
  })

  test("Test find neighbour in array on end", () => {
    let game = new Game()
    let arr = [1,2,3]
    let nb = game.findNeigboursInArr(arr, 2)
    expect(nb).toHaveLength(2)
    expect(nb[0]).toBe(2)
    expect(nb[1]).toBeUndefined()
  })

  test("Test find neighbour in array in between", () => {
    let game = new Game()
    let arr = [1,2,3]
    let nb = game.findNeigboursInArr(arr, 1)
    expect(nb).toHaveLength(2)
    expect(nb[0]).toBe(1)
    expect(nb[1]).toBe(3)
  })

  test("Test next neighbour in x on start", () => {
    let game = new Game()
    let nb = game.findNeigboursInX(0, 0)
    expect(nb).toHaveLength(2)
    expect(nb[0]).toBeUndefined()
    expect(nb[1]).toBe(game.getElement(1, 0))
  })

  test("Test next neighbour in y on start", () => {
    let game = new Game()
    let nb = game.findNeigboursInY(0, 0)
    expect(nb).toHaveLength(2)
    expect(nb[0]).toBeUndefined()
    expect(nb[1]).toBe(game.getElement(0, 1))
  })

  test("Test next neighbour in x on end", () => {
    let game = new Game()
    let nb = game.findNeigboursInX(8, 2)
    expect(nb).toHaveLength(2)
    expect(nb[0]).toMatchObject(game.getElement(7, 2))
    expect(nb[1]).toBeUndefined()
  })

  test("Test next neighbour in y on end", () => {
    let game = new Game()
    let nb = game.findNeigboursInY(8, 2)
    expect(nb).toHaveLength(2)
    expect(nb[0]).toMatchObject(game.getElement(8, 1))
    expect(nb[1]).toBeUndefined()
  })

  test("Test 2 neighbours on start", () => {
    let game = new Game()
    let nb = game.getNearestNeigbours(0, 0)
    expect(nb).toHaveLength(2)
    expect(nb[0]).toBe(game.getElement(1, 0))
    expect(nb[1]).toBe(game.getElement(0, 1))
  })

  test("Test 2 neighbours on end", () => {
    let game = new Game()
    let nb = game.getNearestNeigbours(8, 2)
    expect(nb).toHaveLength(2)
    expect(nb[0]).toBe(game.getElement(7, 2))
    expect(nb[1]).toBe(game.getElement(8, 1))
  })

  test("Test neighbours in between", () => {
    let game = new Game()
    let nb = game.getNearestNeigbours(5, 1)
    expect(nb).toHaveLength(4)
    expect(nb).toContain(game.getElement(4, 1))
    expect(nb).toContain(game.getElement(6, 1))
    expect(nb).toContain(game.getElement(5, 0))
    expect(nb).toContain(game.getElement(5, 2))
  })

  test("Test neighbours in between with eliminated elements", () => {
    let game = new Game()
    game.getElement(5, 1).eliminated = true
    let nb = game.getNearestNeigbours(5, 0)
    expect(nb).toHaveLength(3)
    expect(nb).toContain(game.getElement(4, 0))
    expect(nb).toContain(game.getElement(6, 0))
    expect(nb).toContain(game.getElement(5, 2))
  })

  test("should find neighbours in y when next row has no elements in y", () => {
    let game = new Game()
    game.findNeigboursInY(7,2)
    game.elements.push([new Element(1)])
    game.findNeigboursInY(7,2)
  })

})

describe("Game -- Selection Matchings", () => {

  test("Test match count to 10", () => {
    let e1 = new Element(1)
    let e2 = new Element(9)
    let s1 = new Selection(e1, [e2])
    let s2 = new Selection(e2, [e1])
    expect(s1.matches(s2)).toBe(true)
  })

  test("Test match count to equal", () => {
    let e1 = new Element(9)
    let e2 = new Element(9)
    let s1 = new Selection(e1, [e2])
    let s2 = new Selection(e2, [e1])
    expect(s1.matches(s2)).toBe(true)
  })

  test("Test NO match", () => {
    let e1 = new Element(2)
    let e2 = new Element(9)
    let s1 = new Selection(e1, Array.from(e2))
    let s2 = new Selection(e2, Array.from(e1))
    expect(s1.matches(s2)).toBe(false)
  })

})

describe("Move", () => {

  test("Test move -- nothing happend", () => {
    let game = new Game()
    game.select(0, 0)
    game.select(1, 0)
    game.validate()
    expect(game.numOfLeftElements()).toBe(27)
  })

  test("Test move with elimination", () => {
    let game = new Game()
    expect(game.numOfLeftElements()).toBe(27)
    game.select(8, 0)
    game.select(0, 1)
    game.validate()
    expect(game.numOfLeftElements()).toBe(25)
    expect(game.selection1).toBeUndefined()
    expect(game.selection2).toBeUndefined()
  })

  test("game should remove line", () => {
    let game = new Game()
    expect(game.elements.length).toBe(3)
    game.select(8, 0)
    game.select(0, 1)
    for (let i = 1; i < 9; i++) {
      game.getElement(i, 1).eliminated = true
    }
    game.validate()
    expect(game.elements.length).toBe(2)
  })

})