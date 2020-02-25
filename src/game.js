const COLS = 9
const LS_STATE_KEY = "state"

export class Selection {

    constructor(element, neighbours) {
        this.element = element
        this.neighbours = neighbours
    }

    matches(otherSelection){
        return (this.matchCount(otherSelection) && this.neighbours.includes(otherSelection.element))
    }

    matchCount(otherSelection) {
        return (
            ((this.element.val + otherSelection.element.val) == 10) ||
            ((this.element.val == otherSelection.element.val))
        )
    }

}
 

export class Element {

    constructor(val) {
        this.val = val
        this.eliminated = false
    }

}

export class Game {

    constructor() {
        this.elements = this.getInitial()
        this.selection1 = undefined
        this.selection2 = undefined
    }

    getInitial(){
        let base = [1,2,3,4,5,6,7,8,9, 1,1,1,2,1,3,1,4,1, 5,1,6,1,7,1,8,1,9]
        let matrix = this.arr2matrix(base)
        matrix.forEach((row, row_id) => {
            row.forEach( (elem, col_id) => {
                matrix[row_id][col_id] = new Element(elem)
            })
        })
        return matrix
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

    getElement(x, y){
        return this.elements[y][x]
    }

    saveGame() {
        window.localStorage.setItem(LS_STATE_KEY, JSON.stringify(this.elements))
    }

    loadState() {
        let state = JSON.parse(window.localStorage.getItem(LS_STATE_KEY))
        if (state != undefined) {
            let arr = state.flat().map(json => Object.assign(new Element, json))
            this.elements = this.arr2matrix(arr)
        }else{
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
            .filter(elem => !elem.eliminated)
            .map(elem => new Element(elem.val))
        this.elements = this.arr2matrix(this.elements.flat().concat(toConcatElements))
        this.resetSelection()
    }

    select(x, y) {
        let currentElement = this.getElement(x, y)
        let neighbours = this.getNearestNeigbours(x, y)
        let selection = new Selection(currentElement, neighbours)
        if (this.selection1 == undefined){
            this.selection1 = selection
        }else{
            if(this.selection1.element == selection.element){
                this.resetSelection()
            }else{
                if(this.selection2 == undefined){
                    this.selection2 = selection
                }
            }
        }
    }

    numOfTotalElements() {
        return this.elements.flat().length
    }

    numOfLeftElements() {
        return this.elements.flat().filter(elem => !elem.eliminated).length
    }

    validate() {
        if (this.selection1 != undefined && this.selection2 != undefined){
            if (this.selection1.matches(this.selection2)){
                this.selection1.element.eliminated = true
                this.selection2.element.eliminated = true
            }
            this.resetSelection()
            this.removeCompletedLines()
        }
        this.saveGame()
    }

    removeCompletedLines(){
        let removeCandidates = []
        this.elements.forEach((row, idx) => {
            if (row.length == COLS && row.every(elem => elem.eliminated)){
                removeCandidates.push(idx)
            }
        })
        removeCandidates.reverse().forEach(rowId => this.elements.splice(rowId, 1))
    }

    getNearestNeigbours(x, y){
        let xNeigbours = this.findNeigboursInX(x, y)
        let yNeigbours = this.findNeigboursInY(x, y)
        
        return Array.from(new Set(xNeigbours.concat(yNeigbours).filter(elem => elem != undefined)))
    }
    
    findNeigboursInX(x, y){
        let globalX = x + y*COLS
        let tmpFlat = this.elements.flat()
        return this.findNeigboursInArr(tmpFlat, globalX)
    }

    findNeigboursInY(x, y){
        let col = this.elements.map(row => row[x]).filter(elem => elem != undefined)
        return this.findNeigboursInArr(col, y)
    }

    findNeigboursInArr(arr, currentPos){
        let before = arr.splice(0, currentPos)
        let after = arr.splice(1, arr.length)
        let xBefore = before.reverse().find(elem => !elem.eliminated)
        let xAfter = after.find(elem => !elem.eliminated)
        return [xBefore, xAfter]
    }


    resetSelection(){
        this.selection1 = undefined
        this.selection2 = undefined
    }

    isSelection(x, y){
        if((this.selection1 != undefined) && (this.selection1.element == this.getElement(x, y))){
            return true
        }
        if((this.selection2 != undefined) && (this.selection2.element == this.getElement(x, y))){
            return true
        }
        return false
    }

    getOpenNumbers(){
        return new Set(this.elements.flat().filter(elem => !elem.eliminated).map(elem => elem.val))
    }

}

export default {Game, Element, Selection}