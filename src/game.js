const COLS = 9
const ELIMINATED = 0
const LS_STATE_KEY = "state"

const State = {
    NONE : "none",
    ELIMINATED : "eliminated",
    SELECTED : "selected"
}

class Selection {

  constructor(x, y, val){
    this.x = x
    this.y = y
    this.val = val
  }

}

export default class Game {

    constructor() {
        this.elements = this.getInitial()
        this.selection1 = null
        this.selection2 = null
    }

    getInitial(){
        return this.arr2matrix([1,2,3,4,5,6,7,8,9, 1,1,1,2,1,3,1,4,1, 5,1,6,1,7,1,8,1,9])
    }

    arr2matrix(arr){
        let tmp = arr.flat()
        var i,j,temparray,chunk = COLS
        let total = []
        for (i=0,j=tmp.length; i<j; i+=chunk) {
            temparray = tmp.slice(i,i+chunk)
            total.push(temparray)
        }
        return total
    }

    saveGame() {
        window.localStorage.setItem(LS_STATE_KEY, JSON.stringify(this.elements))
    }

    loadState() {
        let state = JSON.parse(window.localStorage.getItem(LS_STATE_KEY))
        if (state != undefined) {
            console.log("Saved game loaded")
            this.elements = state
        }else{
            console.log("No state available. Set to initial")
            this.elements = this.getInitial()
        }
    }

    reset() {
        this.elements = this.getInitial()
        saveState()
    }

    nextRound() {
        let toConcatElements = this.elements
            .flat()
            .filter(num => num != ELIMINATED)
        this.elements = this.arr2matrix(this.elements.flat().concat(toConcatElements))
    }

    select() {

    }

    isSelected() {

    }

    isEliminated(x, y) {
        return this.elements[y][x] == ELIMINATED
    }

    numOfTotalElements() {
        return this.elements.flat().length
    }

    numOfLeftElements() {
        return this.elements.flat().filter(num => num != ELIMINATED).length
    }

    validate() {
        this.match()
        this.removeCompletedLines()
    }

    removeCompletedLines(){
        let removeCandidates = []
        this.elements.forEach(row => {
            if (row.length == COLS && row.every(num => num == ELIMINATED)){
                removeCandidates.push(row)
            }
        })
        removeCandidates.forEach(cand => this.elements.pop(cand))
    }

    match(){
        return this.correctCount() &&  (this.directNeighboursX() || this.directNeighboursY() || this.undirectNeigboursX() || this.undirectNeigboursY())
    }

    directNeighboursY() {
        return (
            (this.selection1.x == this.selection2.x) && (Math.abs(this.selection1.y - this.selection2.y) == 1)
        )
    }

    directNeighboursX() {
        return (
            (this.selection1.y == this.selection2.y) && (Math.abs(this.selection1.x - this.selection2.x) == 1)
        )
    }

    undirectNeigboursX() {
        let elem1Idx = (this.selection1.y * 9) + this.selection1.x
        let elem2Idx = (this.selection2.y * 9) + this.selection2.x
        let aheadIdx = Math.min(elem1Idx, elem2Idx)
        let inBetweenCount = Math.abs(elem1Idx - elem2Idx) - 1
        if (inBetweenCount == 0) {
            return true
        } else {
            let inBetweenSart = aheadIdx + 1
            let inBetweenEnd = inBetweenSart + inBetweenCount
            let elementsInBetween = this.elements.slice(inBetweenSart, inBetweenEnd)
            if (elementsInBetween.every(item => item.bg == "eliminated")) {
                return true
            }
        }

        return false
    }

    undirectNeigboursY() {
        if (this.selection1.x == this.selection2.x) {
            let elem1Idx = this.selection1.y
            let elem2Idx = this.selection2.y
            let aheadIdx = Math.min(elem1Idx, elem2Idx)
            let inBetweenCount = Math.abs(elem1Idx - elem2Idx) - 1
            if (inBetweenCount == 0) {
                return true
            } else {
                let tmp = []
                for (var i = aheadIdx + 1; i < aheadIdx + 1 + inBetweenCount; i++) {
                    tmp.push(this.elements[(i * 9) + this.selection1.x])
                    if (tmp.every(item => item.bg == "eliminated")) {
                        return true
                    }
                }
            }

        }
        return false
    }

    correctCount() {
        return (
            ((this.selection1.box.val + this.selection2.box.val) == 10) ||
            ((this.selection1.box.val == this.selection2.box.val))
        )
    }
}