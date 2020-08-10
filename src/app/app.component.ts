import { Component, HostListener, OnInit } from '@angular/core';
import { MinesweeperService } from './services/minesweeper.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  loading = true;
  timer = 0;
  interval: number;
  currentLevel = 'easy';

  constructor(public minesweeperService: MinesweeperService) {}

  ngOnInit(): void {
    this.loading = this.startGame();
  }

  startGame(): boolean {
    this.startTimer();
    return this.minesweeperService.initializeBoard(this.currentLevel);
  }

  startTimer(): void {
    clearInterval(this.interval);
    this.timer = 0;
    this.interval = setInterval(() => {
      if (this.minesweeperService.getBoardStatus()) {
        clearInterval(this.interval);
      }
      if (this.timer >= 300) {
        clearInterval(this.interval);
      }
      this.timer++;
    }, 1000);
  }

  setCurrentLevel(level: string): void {
    this.currentLevel = level;
    this.startGame();
  }

  @HostListener('document:keypress', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent): void {
    if (event.key === '1') {
      this.startGame();
    }
    if (event.key === '2') {
      this.setCurrentLevel('easy');
    }
    if (event.key === '3') {
      this.setCurrentLevel('normal');
    }
    if (event.key === '4') {
      this.setCurrentLevel('hard');
    }
    if (event.key === '5') {
      this.setCurrentLevel('expert');
    }
  }

  disableContextMenu(event: MouseEvent): void {
    event.preventDefault();
  }
}
