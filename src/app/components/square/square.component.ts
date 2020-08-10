import { Component, Input, OnInit } from '@angular/core';
import { Square } from '../../interfaces/minesweeper.interface';
import { MinesweeperService } from '../../services/minesweeper.service';

@Component({
  selector: 'app-square',
  templateUrl: './square.component.html',
  styleUrls: ['./square.component.css'],
})
export class SquareComponent implements OnInit {
  @Input() position: number;
  square: Square;
  placeholder: string;
  marked = false;
  exploded = false;

  constructor(private minesweeperService: MinesweeperService) {}

  ngOnInit(): void {
    this.square = this.minesweeperService.getSquare(this.position);
    this.placeholder = this.setPlaceholder(this.square);
  }

  getSquareColor(content: string) {
    switch (content) {
      case '@':
        return 'colorBomb';
      case '':
        return 'colorZero';
      case '1':
        return 'colorOne';
      case '2':
        return 'colorTwo';
      case '3':
        return 'colorThree';
      case '4':
        return 'colorFour';
      case '5':
        return 'colorFive';
      case '6':
        return 'colorSix';
      case '7':
        return 'colorSeven';
      case '8':
        return 'colorEight';
      default:
        break;
    }
  }

  setPlaceholder(square: Square): string {
    if (square.content === 99) {
      return '@';
    } else if (square.content === 0) {
      return '';
    } else {
      return square.content + '';
    }
  }

  handleLeftBtnClick(): void {
    if (!this.marked && !this.minesweeperService.getBoardStatus()) {
      if (this.square.content === 99) {
        this.exploded = true;
      }
      this.minesweeperService.handleSquareLeftClick(this.square.position, this.square.content);
    }
  }

  handleRightBtnClick() {
    this.marked = !this.marked;
    this.minesweeperService.markSquare(this.square.position, this.marked);
  }
}
