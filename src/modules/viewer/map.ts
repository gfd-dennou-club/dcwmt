export class Map {
  private element: HTMLDivElement;

  constructor(private readonly name: string) {
    this.element = document.createElement('div');
  }

  create = () => {
    const nameEl = document.getElementById(this.name);
    if (!nameEl) {
      throw new Error(`Failed to get an element that ID is ${this.name}.`);
    }
    nameEl.remove();

    const map_ele = document.createElement('div');
    map_ele.setAttribute('id', this.name);

    const mainScreen = document.getElementById('main-screen');
    if (!mainScreen) {
      throw new Error('Failed to get an element that ID is main screen.');
    }
    mainScreen.appendChild(map_ele);

    this.element = map_ele;
  };

  get mapEl(): HTMLDivElement {
    return this.element;
  }
}
