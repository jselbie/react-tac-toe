import logo from './logo.svg';
import './App.css';
import BoardModel from './BoardModel.js';
import React, {useEffect, useState} from 'react';

function clamp(val, min, max) {
  if (val < min) return min;
  if (val > max) return max;
  return val;
}

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

    //console.log("onMouseEnter", event.clientX, event.clientY);

    let divRect = document.getElementById("div_img_board").getBoundingClientRect();
    let imgRect = document.getElementById("img_board").getBoundingClientRect();

    let normalizedY = clamp(Math.floor(event.clientY - imgRect.top), 0, 600);
    let row = clamp(Math.floor(normalizedY / 200), 0, 2);

    let normalizedX = clamp(Math.floor(event.clientX - imgRect.left), 0, 600);
    let col = clamp(Math.floor(normalizedX / 200), 0, 2);
    
    //console.log("setting hover index to:", row*3);

    setHoverIndex(row*3+col);
  }


  const onMouseLeave = (cellNum) => {
      setHoverIndex(-1);
  };

  const GenerateAreaSquare = (cellNum) => {
    let left = (cellNum%3)*200;
    let top = Math.floor(cellNum/3)*200;
    let right = left + 200;
    let bottom = top + 200
    return <AreaSquare left={left} top={top} right={right} bottom={bottom} callback={()=>cellCallback(cellNum)} ></AreaSquare>
  }


  return(
    <div id="div_img_board" style={styles} onMouseMove={onMouseEnter} onMouseOut={onMouseLeave}>
      <img id="img_board" src="board.png" useMap="#boardmap"  />

      {cellIndices.map(index=>  <CellImage cellIndex={index} cellValue={boardState[index]} /> )}

      {cellIndices.map(index=>  (index===hoverIndex && !boardState[index])?<CellImage cellIndex={index} cellValue={props.playerIsX?1:2} hover={true} />:<></> )};

      <map id="boardmap" name="boardmap" style={{position:"absolute"}} >
        {cellIndices.map(cellNum => GenerateAreaSquare(cellNum))}
      </map>

    </div>
  );
};

const Controls = (props) => {

  const [playerIsX, setPlayerIsX] = useState(true);

  const onChangeHandler = (event) => {
    //console.log("onChangeHandler: ", event.target.value);
    var playerIsXUpdated = event.target.value==="first"
    setPlayerIsX(playerIsXUpdated);
  };

  const onSubmit = () => {
    //console.log("onSubmit", playerIsX);
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

  let [boardModel, setBoardModel] = useState( () => {
    return new BoardModel();  // lazy state initialization
  });

  var styles = {
    backgroundColor:"Silver",
    margin:"0 auto",
    width:"800px",
    position:"relative",
    border:"thin solid black"
  };

  const cellCallback = (cellNum) => {
    //console.log("click on cell: ", cellNum);
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
  //console.log("RENDERING APP");
  return (
   <BoardDiv/>
  );
};

export default App;
