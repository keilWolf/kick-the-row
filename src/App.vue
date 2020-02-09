<template>
  <div id="app">
    <div class='titleBlock'>
      <h1>kick<span>the</span>row</h1>
    </div>
    <button class='centeredGameStateButton' @click='reset()'>
      <img src="https://img.icons8.com/ios/50/000000/recurring-appointment.png">
    </button>
    <div class='playground'>
    <table id='board' align="center">
        <tr v-for="(row, idY) in game.elements" :key="idY">
          <td v-for='(box, idX) in row' :key="idX">
            <div 
              class='square' 
              @click="router(idX, idY, num)" 
              :class='{"square selected ": isSelection(idX, idY), "square eliminated ": game.isEliminated(idX, idY)}'>
              {{box.val}}
            </div>
          </td>
        </tr>
      </table>
    </div>
    <button class='centeredGameStateButton' @click='nextRound()'>
      <img src="https://img.icons8.com/ios/50/000000/low-priority.png"/>
    </button>
  
  <button style="display: none">Undo</button> <!-- TODO -->
  <button style="display: none">Redo</button> <!-- TODO -->

  </div>
</template>

<script>

import Game from './game'


export default {
  name: 'app',
  data () {
    return {
          game = new Game("Numberama")
    }
  },

  created () {
    // after vue compontent is created
  },

  computed: {
    // will be done when data changes
  },
  
  methods : {

      router(idX, idY){
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

      isSelection(x, y){
        return (this.selection1.matches(x, y) || this.selection2.matches(x, y))
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

      nextRound(){
        this.resetSelection()
        //game.nextRound()
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

  .centeredGameStateButton {
    margin: auto; 
    display: block;
    background: transparent;
    border: none;
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
    color: black;
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
