import { Board } from "./Board";
import { Piece, Side } from "./Piece";

export class Generator {
  static async generateBoard(
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
      const pieces = await Generator.iterate(sizeX, sizeY, salt, i);
      if (pieces != null) {
        console.log(i);
        board = new Board(pieces);
        if (board.checkSolved()) {
          console.log("GENERATED");
          return board;
        }
      }
      i++;
    }
    return board;
  }

  static async iterate(
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
        let randomSide = await Generator.generateRandomNumberMurmurHash3(
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
            await Generator.generateRandomNumberMurmurHash3(
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

  static async generateRandomNumberSHA256(
    salt: string,
    min: number,
    max: number
  ) {
    const encoder = new TextEncoder();
    const saltBytes = encoder.encode(salt);
    const digest = await window.crypto.subtle.digest("SHA-256", saltBytes);

    const hashArray = new Uint8Array(digest);
    const randomValue = hashArray.reduce((acc, byte) => acc * 256 + byte, 0);
    const range = max - min;
    const randomInRange = (randomValue % range) + min;
    return randomInRange;
  }
  private static async generateRandomNumberMurmurHash3(
    salt: string,
    min: number,
    max: number
  ) {
    const hash = Generator.murmurHash3(salt);
    return (hash % (max - min)) + min;
  }
  private static murmurHash3(str: string) {
    var h1 = 0;
    var len = str.length;
    var k1 = 0;
    var i = 0;

    while (len >= 4) {
      k1 =
        (str.charCodeAt(i) & 0xff) |
        ((str.charCodeAt(i + 1) & 0xff) << 8) |
        ((str.charCodeAt(i + 2) & 0xff) << 16) |
        ((str.charCodeAt(i + 3) & 0xff) << 24);

      k1 = k1 * 0xcc9e2d51;
      k1 = (k1 << 15) | (k1 >>> 17);
      k1 = k1 * 0x1b873593;

      h1 = h1 ^ k1;
      h1 = (h1 << 13) | (h1 >>> 19);
      h1 = h1 * 5 + 0xe6546b64;

      i += 4;
      len -= 4;
    }

    k1 = 0;
    switch (len) {
      case 3:
        k1 ^= (str.charCodeAt(i + 2) & 0xff) << 16;
        break;
      case 2:
        k1 ^= (str.charCodeAt(i + 1) & 0xff) << 8;
        break;
      case 1:
        k1 ^= str.charCodeAt(i) & 0xff;
        break;
    }

    k1 = k1 * 0xcc9e2d51;
    k1 = (k1 << 15) | (k1 >>> 17);
    k1 = k1 * 0x1b873593;

    h1 = h1 ^ k1;
    h1 = h1 ^ str.length;
    h1 = h1 ^ (h1 >>> 16);
    h1 = h1 * 0x85ebca6b;
    h1 = h1 ^ (h1 >>> 13);
    h1 = h1 * 0xc2b2ae35;
    h1 = h1 ^ (h1 >>> 16);

    return h1 >>> 0; // Ensure it's a positive integer
  }
}
