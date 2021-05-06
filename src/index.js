//ESTE CÓDIGO ES LA BASE DE LO QUE ESTAMOS CONSTRUYENDO

import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

/*PRIMER(1°) COMPONENTE DE REACT
ESTE RENDERIZA UN SIMPLE "BUTTON" 
ESTE EL COMPONENTE HIJO "SQUARE" QUE RECIBE la propiedad(prop) DE SU COMPONENTE PADRE "BOARD"*/
//COMPONENTE DE CLASE "Square"
/*class Square extends React.Component {
  render() {
    //A LAS PROPIEDADES RECIBIDAS LAS DECLARAMOS COMO "{this.props.value}"
    return (
      <button className="square" onClick={() => this.props.onClick()}>
        {this.props.value}
      </button>
    );
  }
}
*/

//CONVERTIMOS EL ANTERIOR COMPONENTE DE CLASE A COMPONENTE DE FUNCIÓN "Square"
//Componente de función:
function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

/* SEGUNDO(2°) COMPONENTE DE REACT
ESTE RENDERIZA 9 CUADROS 
COMPONENTE PADRE "BOARD" QUE LE PASA UNA "propiedad" AL COMPONENTE HIJO SQUARE */
class Board extends React.Component {
  //Método "renderSquare"
  renderSquare(i) {
    //CADA "Square" AHORA RECIBIRÁ UN prop "value" que será 'X' u 'O' ó "null" para cuadrados vacíos
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

/* TERCER(3°) COMPONENTE DE REACT
 ESTE RENDERIZA UN TABLE CON VALORES DE POSICIÓN POR DEFECTO QUE MODIFICAREMOS LUEGO */
class Game extends React.Component {
  //ESTAMOS ELEVANDO EL ESTADO DE BOARD HACIA EL COMPONENTE "GAME"
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null),
        },
      ],
      stepNumber: 0,
      xIsNext: true,
    };
  }

  //MÉTODO "handleClick" lo pasamos desde el componente "Board" al componente "Game" y le hicimos modificaciones acorde a la estructura de Game
  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    //UTILIZAMOS ".slice()" PARA CREAR UNA COPIA IDENTICA DEL ARRAY "squares"
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? "X" : "O";
    this.setState({
      history: history.concat([
        {
          squares: squares,
        },
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  //Método "jumpTo"
  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: step % 2 === 0,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const desc = move ? "Go to move #" + move : "Go to game start";
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = "Winner: " + winner;
    } else {
      status = "Next player: " + (this.state.xIsNext ? "X" : "O");
    }
    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));

/*
INFO ADICIONAL:

-Los componentes "Squares" ahora son componentes controlados (En terminos de React) el componente "Board" tiene control
 completo sobre ellos.
*/

//DADO UN ARREGLO DE 9 CUADRADOS, ESTA FUNCIÓN COMPROBARÁ SI HAY UN GANADOR Y DEVOLVERÁ 'X' , 'O', o 'null' según corresponda
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
