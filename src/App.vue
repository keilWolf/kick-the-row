<template>
  <div id="app">
    <div class='titleBlock'>
      <h1>kick<span>the</span>row</h1>
    </div>
    <div class="infobox" align="center">
      [
      <span v-for="(elem, id) in getOpenElements()" 
        :key="id" 
        :class='{
          "masteredNumber": elem.mastered,
          "nonMasteredNumber": !elem.mastered
          }'>
        {{elem.val}}
      </span>]
      {{getLeft()}}/{{getTotal()}}
      <span class='dot' :class='{ "hide": !hintAvailable() }'></span>
    </div>
    <button class='centeredGameStateButton' @click='reset()'>
      <img src="https://img.icons8.com/ios/50/000000/recurring-appointment.png">
    </button>
    <div class='playground'>
      <div v-if=won() class='titleBlock'>
        <h1>YOU<span>WON</span>!!!</h1>
      </div>
      <table v-if=!won() id='board' align="center">
          <tr v-for="(row, idY) in game.elements" :key="idY">
            <td v-for='(element, idX) in row' :key="idX">
              <div 
                class='square noselect' 
                @click="router(idX, idY)" 
                :class='{
                  "square selected ": isSelection(idX, idY), 
                  "square eliminated ": element.eliminated
                  }'>
                {{element.val}}
              </div>
            </td>
          </tr>
      </table>
    </div>
    <div class="wrapper">
      <div>
        <button 
          class='btn-row'
          @click='undo()'>
          <img src="https://img.icons8.com/ios/50/000000/undo.png">
        </button>
        <button 
          class='btn-row'
          @click='nextRound()'>
          <img src="https://img.icons8.com/ios/50/000000/low-priority.png"/>
        </button>
        <button 
          class='btn-row'
          @click='redo()'>
          <img src="https://img.icons8.com/ios/50/000000/redo.png">
        </button>
      </div> 
    </div>

  </div>
</template>

<script>

import {Game} from './game'

let g = new Game()
g.loadState()

export default {
  name: 'app',
  data () {
    return {
      game : g
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
        this.game.select(idX, idY)
        setTimeout(() => {
          this.game.validate()
          }, 300)
        },

      nextRound(){
        this.game.nextRound()
        this.game.saveGame()
      },

      reset(){
        this.game = new Game()
        this.game.saveGame()
      },

      isSelection(x, y){
        return this.game.isSelection(x, y) 
      },

      getTotal(){
        return this.game.numOfTotalElements()
      },

      getLeft(){
        return this.game.numOfLeftElements()
      },

      getOpenElements(){
        let entries = []
        let openNumbers = this.game.getOpenNumbers()
        for(let i=1; i<10; i++){
          let mastered = true
          if (openNumbers.has(i)){
            mastered = false
          }
          entries.push({val: i, mastered: mastered})
        } 
        
        return entries
      },

      hintAvailable(){
        let np = this.game.nextPossibleMove()
        return np != undefined
      },

      undo(){
       this.game.undo()
      },

      redo(){
        this.game.redo()
      },

      won(){
        return this.game.numOfLeftElements() == 0
      }

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

.noselect {
  -webkit-touch-callout: none; /* iOS Safari */
    -webkit-user-select: none; /* Safari */
     -khtml-user-select: none; /* Konqueror HTML */
       -moz-user-select: none; /* Old versions of Firefox */
        -ms-user-select: none; /* Internet Explorer/Edge */
            user-select: none; /* Non-prefixed version, currently
                                  supported by Chrome, Opera and Firefox */
  }

  .masteredNumber {
    text-decoration: line-through;
    color: red;
    margin-right: 10px;
  }

  .nonMasteredNumber {
    color: #00B16A;
    margin-right: 10px;
  }

  .footer {
    margin-top: 50px;
    color: white;
  }

  .infobox {
    font-size: 20px
  }

  .btn-row {
    background: transparent;
    border: none;
  }

  .wrapper {
    text-align: center;
  }

  .dot {
    height: 10px;
    width: 10px;
    background-color: rgba(255, 68, 68, 0.644);
    border-radius: 50%;
    display: inline-block;
  }

  .hide {
    background: transparent
  }


</style>
