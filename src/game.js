const State = {
    none : 0,
    eliminated : 1,
    selected : 2,
}

class Field {

    constructor(number){
        this.number = number
        this.state = State.none
    }
}

export default class Game {

    constructor() {
        this.gamefield = this.getInitial()//.map(num => new Field(num))
    }

    getInitial(){
        return [1,2,3,4,5,6,7,8,9,1,1,1,2,1,3,1,4,1,5,1,6,1,7,1,8,1,9]
    }

    next() {

        //this.arr.concat([1,1])
    }
}