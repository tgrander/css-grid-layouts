export class EventEmitter {
  private listeners: Map<string, Function[]> = new Map();

  public on(event: string, callback: Function) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, [callback]);
    }
  }

  public emit(event: string, ...args: any[]) {
    if (this.listeners.has(event)) {
      this.listeners.get(event)!.forEach((callback) => callback(...args));
    }
  }

  public off(event: string, callback: Function) {
    if (this.listeners.has(event)) {
      this.listeners.set(
        event,
        this.listeners.get(event)!.filter((cb) => cb !== callback)
      );
    }
  }
}
