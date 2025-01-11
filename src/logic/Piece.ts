// if we would be getting a lot of 1 sided pieces - a good idea would be to generate fixed amount of them so others would be filled,
// the same can be applied to empty pieces

// Piece.ts
const MAX_STATE = 3;
const MAX_SIDE = 4;

export enum Side {
  Top = 0,
  Right = 1,
  Bottom = 2,
  Left = 3,
}

interface Coordinates {
  x: number;
  y: number;
}

export class Piece {
  private readonly activeStates: Record<number, (piece: Piece) => number[]> = {
    [4]: Piece.getActiveSides4,
    [3]: Piece.getActiveSides3,
    [2]: Piece.getActiveSides2,
    [2.5]: Piece.getActiveSides25,
    [1]: Piece.getActiveSides1,
    [0]: () => [],
  };
  private readonly activeStatesByState: Record<
    number,
    (state: number) => number[]
  > = {
    [4]: Piece.getActiveSides4ByState,
    [3]: Piece.getActiveSides3ByState,
    [2]: Piece.getActiveSides2ByState,
    [2.5]: Piece.getActiveSides25ByState,
    [1]: Piece.getActiveSides1ByState,
    [0]: () => [],
  };

  public readonly getActiveSides: () => number[];
  public readonly getActiveSidesByState: (state: number) => number[];
  constructor(
    public state: Side,
    public readonly sides: number,
    public coordinates: Coordinates,
    public boardSizes: Coordinates
  ) {
    if (sides > MAX_SIDE || sides < 0) {
      throw new Error("Sides should be from 1 to 4");
    }
    if (coordinates.x < 0 || coordinates.y < 0) {
      throw new Error("Invalid coordinates");
    }
    this.getActiveSides = () => this.activeStates[sides](this);
    this.getActiveSidesByState = (_state: number) =>
      this.activeStatesByState[sides](_state);
  }

  rotate() {
    if (this.state + 1 > MAX_STATE) {
      this.state = 0;
    } else {
      this.state++;
    }
  }

  getValidStates(requiredStates: number[] = [], excludeStates: number[] = []) {
    if (this.sides == 0) {
      return [];
    }
    let invalidActiveSides: any = [...excludeStates];
    if (this.coordinates.x == 0) {
      invalidActiveSides.push(Side.Left);
    }
    if (this.coordinates.x == this.boardSizes.x - 1) {
      invalidActiveSides.push(Side.Right);
    }
    if (this.coordinates.y == 0) {
      invalidActiveSides.push(Side.Top);
    }
    if (this.coordinates.y == this.boardSizes.y - 1) {
      invalidActiveSides.push(Side.Bottom);
    }
    invalidActiveSides = Array.from(new Set(invalidActiveSides));
    const validSides = [];
    for (let i = 0; i < 4; i++) {
      const stateSides = this.getActiveSidesByState(i);
      const result = intersect(invalidActiveSides, stateSides);
      if (
        !result &&
        (requiredStates.length == 0 ||
          Array.from(new Set([...stateSides, ...requiredStates])).length ==
            stateSides.length)
      ) {
        validSides.push(i);
      }
    }
    return validSides;
  }

  static getActiveSides4(_piece: Piece): number[] {
    return Piece.getActiveSides4ByState(_piece.state);
  }

  static getActiveSides4ByState(_state: number): number[] {
    return [Side.Top, Side.Right, Side.Bottom, Side.Left];
  }
  static getActiveSides3(piece: Piece): Side[] {
    return Piece.getActiveSides3ByState(piece.state);
  }
  static getActiveSides3ByState(state: number) {
    switch (state) {
      case 0:
        return [Side.Top, Side.Right, Side.Left];
      case 1:
        return [Side.Top, Side.Right, Side.Bottom];
      case 2:
        return [Side.Right, Side.Bottom, Side.Left];
      case 3:
        return [Side.Top, Side.Bottom, Side.Left];
      default:
        throw new Error();
    }
  }

  static getActiveSides2(piece: Piece): number[] {
    return Piece.getActiveSides2ByState(piece.state);
  }
  static getActiveSides2ByState(state: number) {
    switch (state) {
      case 0:
        return [Side.Top, Side.Right];
      case 1:
        return [Side.Right, Side.Bottom];
      case 2:
        return [Side.Bottom, Side.Left];
      case 3:
        return [Side.Top, Side.Left];
      default:
        throw new Error();
    }
  }
  static getActiveSides25(piece: Piece): number[] {
    return Piece.getActiveSides25ByState(piece.state);
  }
  static getActiveSides25ByState(state: number) {
    switch (state) {
      case 0:
        return [Side.Top, Side.Bottom];
      case 1:
        return [Side.Right, Side.Left];
      case 2:
        return [Side.Top, Side.Bottom];
      case 3:
        return [Side.Right, Side.Left];
      default:
        throw new Error();
    }
  }

  static getActiveSides1(piece: Piece): number[] {
    return Piece.getActiveSides1ByState(piece.state);
  }
  static getActiveSides1ByState(state: number): number[] {
    switch (state) {
      case 0:
        return [Side.Top];
      case 1:
        return [Side.Right];
      case 2:
        return [Side.Bottom];
      case 3:
        return [Side.Left];
      default:
        throw new Error();
    }
  }
}

function intersect(a: any[], b: any[]) {
  var setA = new Set(a);
  var setB = new Set(b);
  var intersection = new Set([...setA].filter((x) => setB.has(x)));
  return Array.from(intersection).length > 0;
}
