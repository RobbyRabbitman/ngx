test.todo('test MockResizeObserver?');

export class MockResizeObserver implements ResizeObserver {
  public static id = -1;

  public static readonly INSTANCES = new Map<number, MockResizeObserver>();

  public static readonly clear = () => {
    MockResizeObserver.id = -1;
    MockResizeObserver.INSTANCES.clear();
  };

  public static readonly latest = () =>
    MockResizeObserver.INSTANCES.get(
      MockResizeObserver.id
    ) as MockResizeObserver;

  private targets = [] as Element[];

  public constructor(private callback: ResizeObserverCallback) {
    MockResizeObserver.INSTANCES.set(++MockResizeObserver.id, this);
  }

  public disconnect = () => (this.targets = []);

  public observe = (target: Element) => this.targets.push(target);

  public unobserve = (target: Element) =>
    this.targets.splice(this.targets.indexOf(target), 1);

  public emit = (...entries: Partial<ResizeObserverEntry>[]) =>
    this.callback(entries as ResizeObserverEntry[], this);
}

export const setupMockResizeObserver = () => {
  let originalResizeObserver: typeof ResizeObserver;

  beforeAll(() => {
    originalResizeObserver = global.ResizeObserver;
    global.ResizeObserver =
      MockResizeObserver as unknown as typeof ResizeObserver;
  });

  afterAll(() => (global.ResizeObserver = originalResizeObserver));

  beforeEach(() => MockResizeObserver.clear());
};
