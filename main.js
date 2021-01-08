import React, { useState } from 'react';
import ReactDOM from 'react-dom';

const rowStyle = {
  display: 'flex'
}

const squareStyle = {
  'width':'60px',
  'height':'60px',
  'backgroundColor': '#ddd',
  'margin': '4px',
  'display': 'flex',
  'justifyContent': 'center',
  'alignItems': 'center',
  'fontSize': '20px',
  'color': 'black',
  'cursor': 'pointer'
}

const boardStyle = {
  'backgroundColor': '#eee',
  'width': '208px',
  'alignItems': 'center',
  'justifyContent': 'center',
  'display': 'flex',
  'flexDirection': 'column',
  'border': '3px #eee solid'
}

const containerStyle = {
  'display': 'flex',
  'alignItems': 'center',
  'flexDirection': 'column',
  'fontFamily': 'Arial, Helvetica, sans-serif'
}

const instructionsStyle = {
  'marginTop': '5px',
  'marginBottom': '5px',
  'fontWeight': 'bold',
  'fontSize': '16px',
}

const buttonStyle = {
  'marginTop': '15px',
  'marginBottom': '16px',
  'width': '80px',
  'height': '40px',
  'backgroundColor': '#8acaca',
  'color': 'white',
  'fontSize': '16px',
  'cursor': 'pointer'
}

class Square extends React.Component {
  render() {
    const {value, press} = this.props;
    return (
      <div
        className="square"
        style={squareStyle}
        onClick={press}
        >
        {value}
      </div>
    );
  }
}

class Board extends React.Component {
  render() {
    const {board, nextPlayer, win, tie, squarePress, reset} = this.props;
    return (
      <div style={containerStyle} className="gameBoard">
        {!win && !tie && (
          <div className="status" style={instructionsStyle}>Next player: {nextPlayer}</div>
        )}

        {win && (
          <div className="winner" style={instructionsStyle}>Winner: {nextPlayer}!</div>
        )}

        {tie && (
          <div className="winner" style={instructionsStyle}>It is a tie..</div>
        )}

        <button style={buttonStyle} onClick={reset}>Reset</button>
        <div style={boardStyle}>
        {board.map((row, rowIndex) => (
          <div 
            key={rowIndex} 
            className="board-row" 
            style={rowStyle}
          >
          {row.map((col, colIndex) => (
            <Square key={colIndex} value={col} press={() => squarePress(rowIndex, colIndex)} />
          ))}
          </div>
        ))}
        </div>
      </div>
    );
  }
}

const INITIAL_STATE = {
  nextPlayer: "X",
  win: false,
  tie: false
}

class Game extends React.Component {
  state = {
    ...INITIAL_STATE,
    board: [["","",""],["","",""],["","",""]],
  }

  reset = () => {
    this.setState({
      ...INITIAL_STATE, 
      board: [["","",""],["","",""],["","",""]]
    });
  }

  squarePress = (row, col) => {
    if (this.state.win || this.state.tie)
      return;

    if (this.state.board[row][col] !== "")
      return;

    this.setState(prevState => {
      prevState.board[row][col] = prevState.nextPlayer;
      return prevState;
    }, this.checkResult);
  }

  checkResult = () => {
    let player = this.state.nextPlayer;
    let board = this.state.board;
    
    // Check row
    let rowDone = this.checkRowDone(this.state.board, player);

    // Check cols
    let invertedBoard = [[],[],[]];
    board.forEach(row => {
      invertedBoard[0].push(row[0]);
      invertedBoard[1].push(row[1]);
      invertedBoard[2].push(row[2]);
    });
    let colDone = this.checkRowDone(invertedBoard, player);

    // Check diagonal
    let topLeft = board[0][0] === player;
    let topRight = board[0][2] === player;
    let middle = board[1][1] === player;
    let bottomLeft = board[2][0] === player;
    let bottomRight = board[2][2] === player;
    let diag1Done = topLeft && middle && bottomRight;
    let diag2Done = topRight && middle && bottomLeft;

    // Check win
    if (rowDone || colDone || diag1Done || diag2Done) {
      this.setState({win: true});
      return;
    }

    // Check tie
    let allSquaresComplete = board.every(row => row.every(col => col !== ""));
    if (allSquaresComplete) {
      this.setState({tie: true});
      return;
    }

    // Toggle player
    this.togglePlayer();
  }

  checkRowDone = (board, value) => {
    return board.some(row => {
      return row.every(col => col === value)
    });
  }

  togglePlayer = () => this.setState(prevState => {
      prevState.nextPlayer = (prevState.nextPlayer === "X") ? "O" : "X";
      return prevState;
  })

  render() {
    const {board, nextPlayer, win, tie} = this.state;
    return (
      <div className="game">
        <div className="game-board">
          <Board 
            board={board}
            nextPlayer={nextPlayer} 
            win={win}
            tie={tie}
            squarePress={this.squarePress}
            reset={this.reset}
          />
        </div>
      </div>
    );
  }
}

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);