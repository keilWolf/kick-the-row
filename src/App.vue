<template>
  <div id="app" class="center">
    <div class='titleBlock'>
      <h1>kick<span>the</span>row</h1>
    </div>
    <div class='playground'>
    <table id='board' align="center">
        <tr v-for="(row, idY) in board" :key="idY">
          <td v-for='(box, idX) in row' :key="idX">
            <div 
              class='square' 
              @click="router(idX, idY, box)" 
              :class='{"square selected ": box.bg == "selected", "square eliminated ": box.bg == "eliminated"}'>
              {{box.val}}
            </div>
          </td>
        </tr>
      </table>
    </div>
  <button @click='nextRound()'>Next</button>
  <button @click='reset()'>New</button>
  <button>Undo</button>
  <button>Redo</button>

  </div>
</template>

<script>

const STATE_KEY = "state"
const initialState = [1,2,3,4,5,6,7,8,9,1,1,1,2,1,3,1,4,1,5,1,6,1,7,1,8,1,9].map(num => Object({val: num, bg: ""}))

function copyGameState(state){
  return JSON.parse(JSON.stringify(state))
}

function getInitialState(){
  return copyGameState(initialState)
}

function saveState(state){
  window.localStorage.setItem(STATE_KEY, JSON.stringify(state))
}

function loadState(){
  return JSON.parse(window.localStorage.getItem(STATE_KEY))
}

function restoreOrInit(){
  let state = loadState()
  if (state == undefined){
    return getInitialState()
  }else{
    return state
  }
}

export default {
  name: 'app',
  data () {
    return {
          selection1: null,
          selection2: null,
          elements: restoreOrInit()
    }
  },

  created () {
    // after vue compontent is created
  },

  computed: {
    board: function() {
      return this.chunkArray(this.elements)
    }
  },
  
  methods : {
      reset(){
        this.elements = copyGameState(initialState)
        saveState(this.elements)
      },

      router(idX, idY, box){
        if (box.bg != "eliminated"){
          box.bg = "selected"

          if (this.selection1 == undefined){
            this.selection1 = {box: box, x: idX, y: idY}
          }
          else {
            if (this.selection2 == undefined){
              this.selection2 = {box: box, x: idX, y: idY}

              let isSelectionSame = JSON.stringify(this.selection1) == JSON.stringify(this.selection2)
              // reset selection
              setTimeout(() => {
                if (this.match() && !isSelectionSame) {
                  console.log(this.selection1);
                  console.log(this.selection2);
                  
                  console.log("selections are matchinng")
                  this.selection1.box.bg = "eliminated"
                  this.selection2.box.bg = "eliminated"
                  this.selection1 = undefined
                  this.selection2 = undefined
                  this.removeCompletedLines()

                  saveState(this.elements)
                }else{
                  this.resetSelection()
                }
                }, 300)
              }
          }
        }

      },

      resetSelection(){
        if (this.selection1){
          this.selection1.box.bg = ""
          this.selection1 = undefined
        }

        if (this.selection2){
          this.selection2.box.bg = ""
          this.selection2 = undefined
        }
      },

      match(){
        return this.correctCount() &&  (this.directNeighboursX() || this.directNeighboursY() || this.undirectNeigboursX() || this.undirectNeigboursY())
      },

      directNeighboursY(){
        return (
         (this.selection1.x == this.selection2.x) && (Math.abs(this.selection1.y - this.selection2.y) == 1)
        )
      },

      directNeighboursX(){
        return (
         (this.selection1.y == this.selection2.y) && (Math.abs(this.selection1.x - this.selection2.x) == 1)
        )
      },

      undirectNeigboursX(){
        let elem1Idx = (this.selection1.y * 9) + this.selection1.x
        let elem2Idx = (this.selection2.y * 9) + this.selection2.x
        let aheadIdx = Math.min(elem1Idx, elem2Idx)
        let inBetweenCount = Math.abs(elem1Idx - elem2Idx) - 1
        if (inBetweenCount == 0){
          return true
        }else{
          let inBetweenSart = aheadIdx + 1
          let inBetweenEnd = inBetweenSart + inBetweenCount
          let elementsInBetween = this.elements.slice(inBetweenSart, inBetweenEnd)
          if (elementsInBetween.every(item => item.bg == "eliminated")){
            return true
          }
        }

        return false
      },

      undirectNeigboursY(){
        if (this.selection1.x == this.selection2.x){
          let elem1Idx = this.selection1.y
          let elem2Idx = this.selection2.y
          let aheadIdx = Math.min(elem1Idx, elem2Idx)
          let inBetweenCount = Math.abs(elem1Idx - elem2Idx) - 1
          if (inBetweenCount == 0){
            return true
          }else{
            let tmp = []
            for (var i=aheadIdx+1; i< aheadIdx+1+inBetweenCount; i++) {
              tmp.push(this.elements[(i*9)+this.selection1.x])
              if (tmp.every(item => item.bg == "eliminated")){
                return true
              }
            }
          }
          
        }
        return false
      },

      correctCount(){
        return (
          ((this.selection1.box.val + this.selection2.box.val) == 10) ||
          ((this.selection1.box.val == this.selection2.box.val))
        )
      },

      chunkArray(arr){
        let tmp = arr.flat()
        var i,j,temparray,chunk = 9
        let total = []
        for (i=0,j=tmp.length; i<j; i+=chunk) {
            temparray = tmp.slice(i,i+chunk)
            total.push(temparray)
        }
        return total
      },

      nextRound(){
        this.resetSelection()
        let newElements = this.elements.filter(item => item.bg != "eliminated").map(item => item.val).map(num => Object({val: num, bg: ""}))
        this.elements = this.elements.concat(newElements)
      },

      removeCompletedLines(){
        var arrayLength = this.board.length
        for (var i = arrayLength-1; i >= 0; i--) {
          let row = this.board[i]
          if (row.every(item => item.bg == "eliminated")){
            this.removeLine(i)
          }
        }
      },

      removeLine(lineNum){
        this.elements.splice(lineNum*9, 9)
      },
  },
  
}
</script>

<style>
  
  .center {
    position: absolute;
    top: 50%; left: 50%;
    transform: translate(-50%,-50%);
  }
  

  body {
    font-family: 'Oswald', sans-serif;
    font-size: 48px;
    background: #6C7A89;
  }
      
  span {
    color: #00B16A;
  }

  #board {
    border-collapse: separate;
    border-spacing: 2px;
  }

  td {
    vertical-align: middle;
  }

  .square {
    width: 5vw;
    height: 5vw;
    background: rgb(76, 104, 131);
    cursor: pointer;
    font-size: 4vw;
    line-height: 5vw;
    text-align: center;
    color: white;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  }

  .square:hover {
      opacity: .8;
  }

  .square:active {
      background: #00B16A;
  }

  .selected {
      background: #FFB16A;
  }  

  .eliminated {
      background: #000000;
  }

  .titleBlock {
    color: white;
    text-align: center;
    text-transform: uppercase;
    letter-spacing: 4px;
  }

  .titleBlock.h1 {
      font-size: 80px;
      width: 100%;
  }


</style>
