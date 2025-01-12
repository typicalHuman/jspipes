import { Board } from "./Board";
import { Piece, Side } from "./Piece";
import { generateRandomNumberMurmurHash3 } from "./utils/randomGenerator";

export class Generator {
  static generateBoard(
    sizeX: number,
    sizeY: number,
    salt: string,
    maxAttempts = 10_000
  ) {
    const initial_salt = salt;
    let i = 0;
    let board = null;
    while (i < maxAttempts) {
      salt = `${initial_salt}_${i}`;
      const pieces = Generator.iterate(sizeX, sizeY, salt, i);
      if (pieces != null) {
        console.log(i);
        board = new Board(pieces, salt);
        if (board.checkSolved()) {
          board.shuffle();
          return board;
        }
      }
      i++;
    }
    return null;
  }

  static iterate(
    sizeX: number,
    sizeY: number,
    salt: string,
    currentIteration: number
  ) {
    const maxEmptySpaces = sizeX;
    let emptySpaces = 0;
    const pieces = Array.from({ length: sizeY }, () => Array(sizeX).fill(null));

    for (let y = 0; y < sizeY; y++) {
      for (let x = 0; x < sizeX; x++) {
        const requiredStates = [];
        const excludeStates = [];
        if (y > 0) {
          let sides = pieces[y - 1][x].getActiveSides();
          if (sides.includes(Side.Bottom)) requiredStates.push(Side.Top);
          else if (sides.length > 0) excludeStates.push(Side.Top);
          else excludeStates.push(Side.Top);
        }
        if (x > 0) {
          let sides = pieces[y][x - 1].getActiveSides();
          if (sides.includes(Side.Right)) requiredStates.push(Side.Left);
          else if (sides.length > 0) excludeStates.push(Side.Left);
          else excludeStates.push(Side.Left);
        }
        let minSidesValue =
          (emptySpaces >= maxEmptySpaces && requiredStates.length == 0
            ? 1
            : 0) + requiredStates.length;
        let maxSidesValue =
          Generator.getMaxSidesValue(x, y, sizeX, sizeY) - excludeStates.length;
        if (maxSidesValue < minSidesValue) {
          return null;
        }
        let randomSide = generateRandomNumberMurmurHash3(
          `${salt}_${x}_${y}_side`,
          minSidesValue,
          maxSidesValue + 1
        );
        if (randomSide == 2 && maxSidesValue > 2) {
          if ((currentIteration + x + y) % 2 == 0) {
            randomSide = 2.5;
          }
        }
        const tempPiece = new Piece(
          0,
          randomSide,
          { x, y },
          { x: sizeX, y: sizeY }
        );

        const validStates = tempPiece.getValidStates(
          requiredStates,
          excludeStates
        );
        if (validStates.length == 0 && randomSide != 0) {
          return null;
        }
        let randomState =
          validStates[
            generateRandomNumberMurmurHash3(
              `${salt}_${x}_${y}_state`,
              0,
              validStates.length
            )
          ];
        if (isNaN(randomState)) {
          randomState = 0;
        }
        tempPiece.state = randomState;
        pieces[y][x] = tempPiece;
        if (randomSide == 0) {
          emptySpaces++;
        }
      }
    }
    return pieces;
  }

  static getMaxSidesValue(x: number, y: number, sizeX: number, sizeY: number) {
    if (
      (x == 0 && y == 0) ||
      (x == 0 && y == sizeY - 1) ||
      (x == sizeX - 1 && y == 0) ||
      (x == sizeX - 1 && y == sizeY - 1)
    )
      return 2;
    if (x == 0 || y == 0 || x == sizeX - 1 || y == sizeY - 1) return 3;
    return 4;
  }
}
