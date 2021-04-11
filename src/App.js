import logo from './logo.svg';
import './App.css';
import BoardModel from './BoardModel.js';
import React, {useEffect, useState} from 'react';

const AreaSquare = (props) => {
  var coordinates = props.left.toString() + "," + props.top.toString() + "," + props.right.toString() + "," + props.bottom.toString();
  return <area coords={coordinates} shape="rect" onClick={props.callback} />
};

const CellImage = (props) => {
  const leftOffset = ((props.cellIndex % 3) * 200).toString() + "px";
  const topOffset = (Math.floor((props.cellIndex / 3)) * 200).toString() + "px";
  const src = (props.cellValue === 1) ? "x.png" : "o.png";

  if (props.cellValue === 0) {
    return (<></>);
  }

  var opacity = (props.hover) ? .1 : 1;

  return <img key={props.cellIndex} src={src} style={{position:"absolute", left:leftOffset, top:topOffset, pointerEvents:"none", opacity:opacity}} />
};

const Board = (props) => {

  let boardState = props.boardState;
  const cellIndices = [0,1,2,3,4,5,6,7,8];
  const [hoverIndex, setHoverIndex] = useState(-1);
  
  var styles = {
    margin:"0 auto",
    position:"relative",
    width:"600px"
  };

  const cellCallback = (cellNum) => {
    props.cellCallback(cellNum);
  };

  const onMouseEnter = (event) => {
    
    // https://stackoverflow.com/questions/3234256/find-mouse-position-relative-to-element/42111623#42111623

    console.log("onMouseEnter", event.clientX, event.clientY);
    let boardDiv = document.getElementById("boarddiv");
    let boardImg = document.getElementById("boardimg");

    if (boardDiv && boardImg) {
      var boardRect = boardDiv.getBoundingClientRect();
      var imgRect = boardImg.getBoundingClientRect();

      console.log("boardRect", Math.floor(boardRect.left), Math.floor(boardRect.top), Math.floor(boardRect.right), Math.floor(boardRect.bottom));
      console.log("imgRect", Math.floor(imgRect.left), Math.floor(imgRect.top), Math.floor(imgRect.right), Math.floor(imgRect.bottom));

      var x = event.clientX - imgRect.left;
      var y = event.clientY - imgRect.top;
      console.log("normalized position", x, y);

      x = Math.floor(x / 200);
      y = Math.floor(y / 200);

      if ((x >= 3) || (y >= 3)) {
        setHoverIndex(-1);
      } else {
        console.log("setting hover index to ", y*3+x);
        setHoverIndex(y*x+3);
      }

    }



    //setHoverIndex(cellNum);
  };

  const onMouseLeave = (cellNum) => {
    console.log("onMouseLeave", cellNum);
    //if (hoverIndex === cellNum) {
    //  setHoverIndex(-1);
    //}
  };

  const GenerateAreaSquare = (cellNum) => {
    let left = (cellNum%3)*200;
    let top = Math.floor(cellNum/3)*200;
    let right = left + 200;
    let bottom = top + 200
    return <AreaSquare left={left} top={top} right={right} bottom={bottom} callback={()=>cellCallback(cellNum)} ></AreaSquare>
  }


  return(
    <div id="boarddiv" style={styles} onMouseMove={onMouseEnter} onMouseOut={onMouseLeave}>
      <img id="boardimg" src="board.png" useMap="#boardmap"  />

      {cellIndices.map(index=>  <CellImage cellIndex={index} cellValue={boardState[index]} /> )}

      {cellIndices.map(index=>  (index===hoverIndex)?<CellImage cellIndex={index} cellValue={props.playerIsX?1:2} hover={true} />:<></> )};

      <map id="boardmap" name="boardmap" style={{position:"absolute"}} >
        {cellIndices.map(cellNum => GenerateAreaSquare(cellNum))}
      </map>

    </div>
  );
};

const Controls = (props) => {

  const [playerIsX, setPlayerIsX] = useState(true);

  const onChangeHandler = (event) => {
    console.log("onChangeHandler: ", event.target.value);
    var playerIsXUpdated = event.target.value==="first"
    setPlayerIsX(playerIsXUpdated);
  };

  const onSubmit = () => {
    console.log("onSubmit", playerIsX);
    props.onNewGame(playerIsX);
  }

  return (
  <center>
    <input name="radgroup1" type="radio" value={"first"} checked={playerIsX}  onChange={onChangeHandler}/>Local Player is X &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
    <input name="radgroup1" type="radio" value={"second"} checked={!playerIsX} onChange={onChangeHandler}/>Computer is X 
    <p></p>
    <input type="button" value="Start New Game" onClick={onSubmit}  />
    <p></p>
    <h1>{props.message}</h1>
  </center>
  );

};



const DumpBoard = (cells) => {

  var display = cells.map(val=> {
    if (val === 0) return "_";
    if (val === 1) return "X";
    if (val === 2) return "O";
    return "?"

  });

  console.log("\n\n============================")
  console.log(display[0], display[1], display[2]);
  console.log(display[3], display[4], display[5]);
  console.log(display[6], display[7], display[8]);
  console.log("============================")
}

const BoardDiv = (props) => {

  let [boardModel, setBoardModel] = useState(null);

  if (boardModel === null) {
    boardModel = new BoardModel(true);
    setBoardModel(boardModel);
  }

  var styles = {
    backgroundColor:"Silver",
    margin:"0 auto",
    width:"800px",
    position:"relative",
    border:"thin solid black"
  };

  const cellCallback = (cellNum) => {
    console.log("click on cell: ", cellNum);
    boardModel.playerMakeMove(cellNum);
    setBoardModel(boardModel.clone());
  };
  
  const startNewGame = (playerIsX)  => {
    setBoardModel(new BoardModel(playerIsX));
  }

  var message = "";
  if (boardModel.winner === boardModel.TIE) {
    message = "Tie Game!";
  } else if (boardModel.winner === boardModel.X) {
    message = "X is Winner!";
  } else if (boardModel.winner === boardModel.O) {
    message = "O is Winner!";
  }

  //DumpBoard(boardModel.boardState);
  var playerIsX = (boardModel.localPlayerValue===boardModel.X);

  return (
  <div style={styles}>
    <center><h1>Tic Tac Toe</h1></center>
    <Board cellCallback={cellCallback} boardState={boardModel.boardState} playerIsX={playerIsX} />
    <Controls onNewGame={startNewGame} message={message}/>
  </div>
  );


};

const App = () => {
  console.log("RENDERING APP");
  return (
   <BoardDiv/>
  );
};

export default App;
