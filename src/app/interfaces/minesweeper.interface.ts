export interface Board {
  mineAmount: number;
  size: Size;
  squareList: Square[];
  disabled: boolean;
  level: string;
}

export interface Square {
  position: number;
  content: number;
  visible: boolean;
  marked: boolean;
}

export interface Size {
  x: number;
  y: number;
}
