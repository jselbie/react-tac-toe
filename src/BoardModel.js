
class BoardModel
{
    constructor(playerIsX) {

        this.UNSPECIFIED = 0;
        this.X = 1;
        this.O = 2;
        this.TIE = 3;

        this.boardState = [0,0,0,  0,0,0,  0,0,0];
        this.winner = this.UNSPECIFIED; // 0 is no winer, 1 is X, 2 is O, 3 is TIE
        this.localPlayerValue = (playerIsX ? this.X : this.O);

        if (!playerIsX) {
            this._computerMakeMove();
        }
    }

    getBoardState() {
        return [...this.boardState];
    }

    clone() {
        // https://stackoverflow.com/questions/41474986/how-to-clone-a-javascript-es6-class-instance
        return Object.assign(Object.create(Object.getPrototypeOf(this)), this);
    }

    playerMakeMove(cellIndex) {

        if (this.winner !== this.UNSPECIFIED) {
            console.log("the game is over")
            return;
        }

        if (this.boardState[cellIndex] !== this.UNSPECIFIED) {
            console.assert(false, "cell is already taken");
            return;
        }

        this._applyMove(cellIndex, this.localPlayerValue);
        if (this.winner === this.UNSPECIFIED) {
            this._computerMakeMove();
        }
    }

    _computerMakeMove() {
        
        var madeMove = false;
        var computerValue = (this.localPlayerValue === this.X) ? this.O : this.X;

        let i = 0;

        // look for a winning move
        for (i = 0; i < 9; i++) {
            let tmpState = [...this.boardState];
            if (tmpState[i] === this.UNSPECIFIED) {
                tmpState[i] = computerValue;
                if (this._checkForWin(tmpState, computerValue)) {
                    this._applyMove(i, computerValue);
                    madeMove = true;
                    break;
                }
            }
        }

        // look for a blocking mode
        if (!madeMove) {
            for (i = 0; i < 9; i++) {
                let tmpState = [...this.boardState];
                if (tmpState[i] === this.UNSPECIFIED) {
                    tmpState[i] = this.localPlayerValue;
                    if (this._checkForWin(tmpState, this.localPlayerValue)) {
                        this._applyMove(i, computerValue);
                        madeMove = true;
                        break;
                    }
                }
            }
        }

        // look for center
        if (!madeMove) {
            if (this.boardState[4] === this.UNSPECIFIED) {
                this._applyMove(4, computerValue);
                madeMove = true;
            }
        }

        // pick a random cell
        if (!madeMove) {
            var available = [];
            for (i = 0; i < 9; i++) {
                if (this.boardState[i] === this.UNSPECIFIED) {
                    available.push(i);
                }
            }
            if (available.length > 0) {
                var pick = available[Math.floor(Math.random() * available.length)];
                this._applyMove(pick, computerValue);
                madeMove = true;
            }
        }

        return madeMove;
    }

    _applyMove(cellIndex, playerValue) {

        console.log("_applyMove", cellIndex, playerValue);

        console.assert(this.boardState[cellIndex] === this.UNSPECIFIED);

        this.boardState[cellIndex] = playerValue;

        if (this._checkForWin(this.boardState, playerValue)) {
            this.winner = playerValue;
        } else if (this._checkForTie()) {
            this.winner = 3;
        }

    }

    _checkForWin(cells, player) {

        var wincombo0 = [0,1,2];
        var wincombo1 = [3,4,5];
        var wincombo2 = [6,7,8];
        var wincombo3 = [0,3,6];
        var wincombo4 = [1,4,7];
        var wincombo5 = [2,5,8];
        var wincombo6 = [0,4,8];
        var wincombo7 = [2,4,6];
        var combos = [wincombo0, wincombo1, wincombo2, wincombo3, wincombo4, wincombo5, wincombo6, wincombo7];

        for (var i = 0; i < combos.length; i++) {
            var wincombo = combos[i];
            if (cells[wincombo[0]]===player && cells[wincombo[1]]===player && cells[wincombo[2]]===player) {
                return true;
            }
        }
        return false;
    };

    _checkForTie() {
        for (var i = 0; i < 9; i++) {
            if (this.boardState[i] === 0) {
                return false;
            }
        }
        return true;
    }
}

export default BoardModel;