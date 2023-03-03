export default class CallQueue<T, C extends (...args: T[]) => void> {
  public queue: T[][];
  private call: C;

  public constructor(call: C) {
    this.queue = [];
    this.call = call;
  }

  public push(item: T[]): void {
    if (this.queue.includes(item)) return;
    this.queue.push(item);
  }

  public async emptyQueue(): Promise<void> {
    if (this.queue.length === 0) return;
    const promises = this.queue.map((i) => this.call(...i));
    return void (await Promise.all(promises));
  }
}
