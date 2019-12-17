<template>
  <div id="app">
    <table id='board'>
        <tr v-for="row in board" :key="row.id">
          <td v-for='box in row' :key="box.id">
            <div class='square' @click="router(box)" :class='{"square active": box.bg}'>
              {{box}}
            </div>
          </td>
        </tr>
      </table>
  <button @click='nextRound()'>Next</button>
  </div>
</template>

<script>
export default {
  name: 'app',
  data () {
    return {
          selection1: null,
          selection2: null,
          board: [
            [1,2,3,4,5,6,7,8,9],
            [1,1,1,2,1,3,1,4,1],
            [5,1,6,1,7,1,8,1,9]
          ]
    }
  },
  methods : {
    router(box){
      alert(box)
    },

    nextRound(){
      let tmp = this.board.flat();
      tmp = tmp.concat(tmp)
      var i,j,temparray,chunk = 9;
      let total = []
      for (i=0,j=tmp.length; i<j; i+=chunk) {
          temparray = tmp.slice(i,i+chunk);
          total.push(temparray)
      }
      this.board = total
    }
  }
}
</script>

<style lang="scss">
body {
    font-family: 'Oswald', sans-serif;
    font-size: 48px;
  }
      
  span {
    color: #00B16A;
  }

  #board {
    border-collapse: separate;
    border-spacing: 2px;
  }

  #main {
    border-collapse: separate;
    border-spacing: 2px;
  }

  td {
    vertical-align: middle;
  }

  .square {
    width: 5vw;
    height: 5vw;
    background: #6C7A89;
    cursor: pointer;
    font-size: 5vw;
    line-height: 5vw;
    text-align: center;
    color: white;
  }

  .square:hover {
      opacity: .8;
  }

  .square:active {
      background: #00B16A;
  }
</style>
