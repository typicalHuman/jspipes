import { Side, type Piece } from "./Piece";

const MAX_FIELD_SIZE_X = 30;
const MAX_FIELD_SIZE_Y = 15;

export class Board {
  constructor(public pieces: Piece[][]) {
    const [y, x] = [pieces.length, pieces[0].length];
    if (y == 0 || y > MAX_FIELD_SIZE_Y) {
      throw new Error("Invalid size Y");
    }
    if (x == 0 || x > MAX_FIELD_SIZE_X) {
      throw new Error("Invalid size X");
    }
  }

  checkSolved() {
    for (let i = 0; i < this.pieces.length; i++) {
      for (let j = 0; j < this.pieces[i].length; j++) {
        const result = this.checkPieceConnected(this.pieces[i][j]);
        if (!result) {
          return false;
        }
      }
    }
    return true;
  }

  private checkPieceConnected(piece: Piece): boolean {
    const activeSides = piece.getActiveSides();
    for (let i = 0; i < activeSides.length; i++) {
      const side = activeSides[i];
      let result = false;
      if (side == Side.Top) {
        result = this.isPieceConnected(
          piece.coordinates.x,
          piece.coordinates.y - 1,
          Side.Bottom
        );
      } else if (side == Side.Bottom) {
        result = this.isPieceConnected(
          piece.coordinates.x,
          piece.coordinates.y + 1,
          Side.Top
        );
      } else if (side == Side.Right) {
        result = this.isPieceConnected(
          piece.coordinates.x + 1,
          piece.coordinates.y,
          Side.Left
        );
      } else if (side == Side.Left) {
        result = this.isPieceConnected(
          piece.coordinates.x - 1,
          piece.coordinates.y,
          Side.Right
        );
      }
      if (!result) return false;
    }
    return true;
  }

  private isPieceConnected(x: number, y: number, side: Side) {
    if (!this.isValidCoordinates(x, y)) {
      return false;
    }
    const piece = this.getPieceByCoordinates(x, y);
    return piece.getActiveSides().includes(side);
  }

  private isValidCoordinates(x: number, y: number) {
    if (x < 0 || y < 0) {
      return false;
    }
    if (x >= this.pieces[0].length || y >= this.pieces.length) {
      return false;
    }
    return true;
  }

  private getPieceByCoordinates(x: number, y: number) {
    return this.pieces[y][x];
  }
}
