export class Lexile {
  private static readonly ALL = new Map<number, Lexile>(
    [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1100, 1200].map(
      (level) => [level, Lexile.of(level)],
    ),
  );

  private constructor(private readonly _level: number) {}

  level(): number {
    return this._level;
  }

  public static ofLevel(level: number): Lexile {
    if (!Lexile.ALL.has(level)) {
      throw new Error(`Lexile level ${level} not found`);
    }
    return Lexile.ALL.get(level)!;
  }

  private static of(level: number): Lexile {
    return new Lexile(level);
  }
}
