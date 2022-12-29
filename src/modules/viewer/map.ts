export const Map = {
  name: "map",
  create: function(){
    const ele = document.createElement('div');
    ele.id = this.name;
    return ele;
  },
  mount: function(mapEl: HTMLDivElement){
    const ele = document.getElementById(this.name);
    if(ele) {
      ele.remove();
    }
    const mainScreen = document.getElementById('main-screen');
    mainScreen?.appendChild(mapEl);
  }
} as const;