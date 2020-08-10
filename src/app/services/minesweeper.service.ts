import { Injectable } from '@angular/core';
import { Board, Size, Square } from '../interfaces/minesweeper.interface';
import { getRandomIntInclusive } from '../util/helpers';

@Injectable({
  providedIn: 'root',
})
export class MinesweeperService {
  private board: Board;
  private displayedMessage: string;

  constructor() {}

  /*
   ** AUXILIARY FUNCTIONS
   */

  getBoard(): Board {
    return this.board;
  }

  getBoardSquares(): Square[] {
    return this.board.squareList;
  }

  getBoardSize(): Size {
    return this.board.size;
  }

  getBoardStatus(): boolean {
    return this.board.disabled;
  }

  getBoardMineAmount(): number {
    return this.board.mineAmount;
  }

  getSquare(position: number): Square {
    return this.getBoardSquares()[position];
  }

  getSquareVisibility(position: number): boolean {
    return this.getSquare(position).visible;
  }

  getDisplayedMessage(): string {
    return this.displayedMessage;
  }

  getMarkedSquaresAmount(): number {
    return this.getBoardSquares().filter((square: Square) => square.marked).length;
  }

  setDisplayedMessage(num: number): void {
    this.displayedMessage = this.getMessages(num);
  }

  setSquareVisibility(position: number, value: boolean): void {
    this.getSquare(position).visible = value;
  }

  setAllSquaresVisible(): void {
    this.getBoardSquares().forEach((square: Square) => {
      this.setSquareVisibility(square.position, true);
    });
  }

  setSquareMark(position: number, value: boolean): void {
    this.getSquare(position).marked = value;
  }

  setBoardStatus(value: boolean): void {
    this.getBoard().disabled = value;
  }

  isFirstRowSquare(position: number, size: Size): boolean {
    return position % size.x === 0;
  }

  isLastRowSquare(position: number, size: Size): boolean {
    return (position + 1) % size.x === 0;
  }

  /*
   ** BOARD GENERATION FUNCTIONS
   */

  initializeBoard(level: string): boolean {
    const { mineAmount, size } = this.getLevelConfig(level);

    this.board = {
      mineAmount,
      size,
      squareList: this.generateSquareList(size, mineAmount),
      disabled: false,
      level: 'easy',
    };
    this.setDisplayedMessage(1);

    return false;
  }

  generateSquareList(size: Size, mineAmount: number): Square[] {
    let squares: Square[] = [];
    const squareAmount = size.x * size.y;
    const bombPositions = this.generateBombSquares(squareAmount, mineAmount);

    for (let i = 0; i < squareAmount; i++) {
      let content = 0;
      if (bombPositions.find((position) => position === i) !== undefined) {
        content = 99;
      }
      squares.push({
        position: i,
        content,
        visible: false,
        marked: false,
      });
    }

    squares = this.generateNumberSquares(squares, size);

    return squares;
  }

  generateBombSquares(squareAmount: number, mineAmount: number): number[] {
    return getRandomIntInclusive(0, squareAmount - 1, mineAmount);
  }

  generateNumberSquares(squares: Square[], size: Size): Square[] {
    return squares.map((square: Square) => {
      if (square.content === 99) {
        return square;
      } else {
        const isFirstRowSquare = this.isFirstRowSquare(square.position, size);
        const isLastRowSquare = this.isLastRowSquare(square.position, size);

        return {
          ...square,
          content:
            (squares[square.position - size.x]?.content === 99 ? 1 : 0) +
            (squares[square.position + size.x]?.content === 99 ? 1 : 0) +
            (isFirstRowSquare
              ? 0
              : (squares[square.position - 1]?.content === 99 ? 1 : 0) +
                (squares[square.position - size.x - 1]?.content === 99 ? 1 : 0) +
                (squares[square.position + size.x - 1]?.content === 99 ? 1 : 0)) +
            (isLastRowSquare
              ? 0
              : (squares[square.position - size.x + 1]?.content === 99 ? 1 : 0) +
                (squares[square.position + 1]?.content === 99 ? 1 : 0) +
                (squares[square.position + size.x + 1]?.content === 99 ? 1 : 0)),
        };
      }
    });
  }

  /*
   ** BOARD ACTIONS FUNCTIONS
   */

  handleSquareLeftClick(position: number, content: number): void {
    this.setSquareVisibility(position, true);
    this.setSquareMark(position, false);

    if (!this.getBoardStatus()) {
      switch (content) {
        case 99: {
          this.handleGameEnd(false);
          break;
        }
        case 0: {
          this.setConnectedSquaresVisibility(position);
          this.checkVictory();
          break;
        }
        default:
          this.checkVictory();
          break;
      }
    }
  }

  handleGameEnd(hasWon: boolean): void {
    const messageNumber = hasWon ? 2 : 3;
    this.setDisplayedMessage(messageNumber);
    this.setAllSquaresVisible();
    this.setBoardStatus(true);
  }

  setConnectedSquaresVisibility(position: number): void {
    const squares: Square[] = this.getBoardSquares();
    const size: Size = this.getBoardSize();

    const connectedSquarePositions: Square[] = [squares[position - size.x], squares[position + size.x]];

    if (!this.isFirstRowSquare(position, size)) {
      connectedSquarePositions.push(
        squares[position - 1],
        squares[position - size.x - 1],
        squares[position + size.x - 1]
      );
    }
    if (!this.isLastRowSquare(position, size)) {
      connectedSquarePositions.push(
        squares[position - size.x + 1],
        squares[position + 1],
        squares[position + size.x + 1]
      );
    }

    connectedSquarePositions
      .filter((square: Square) => square?.position !== undefined && square.visible !== true)
      .forEach((square: Square) => {
        this.setSquareVisibility(square.position, true);
        this.setSquareMark(position, false);
        if (square.content === 0) {
          this.setConnectedSquaresVisibility(square.position);
        }
      });
  }

  checkVictory(): void {
    if (
      Boolean(
        !this.getBoardSquares().find((square: Square) => {
          return square.content !== 99 && square.visible === false;
        })
      )
    ) {
      this.handleGameEnd(true);
    }
  }

  markSquare(position: number, value: boolean): void {
    if (!this.getSquareVisibility(position)) {
      this.setSquareMark(position, value);
    }
  }

  /*
   ** OPTION HANDLER FUNCTIONS
   */

  getMessages(num: number): string {
    switch (num) {
      case 1: {
        return 'MINE FOOKING SWEEPER';
      }
      case 2: {
        return 'YOU WIN :D';
      }
      case 3: {
        return 'YOU LOSE :(';
      }
      default:
        break;
    }
  }

  getLevelConfig(level: string): { mineAmount: number; size: Size } {
    switch (level) {
      case 'easy':
        return {
          mineAmount: 10,
          size: {
            x: 9,
            y: 9,
          },
        };
      case 'normal':
        return {
          mineAmount: 40,
          size: {
            x: 16,
            y: 16,
          },
        };
      case 'hard':
        return {
          mineAmount: 99,
          size: {
            x: 30,
            y: 16,
          },
        };
      case 'expert':
        return {
          mineAmount: 140,
          size: {
            x: 30,
            y: 16,
          },
        };
      default:
        break;
    }
  }
}
