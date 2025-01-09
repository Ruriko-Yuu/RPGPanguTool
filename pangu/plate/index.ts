import { InitPlateArgType, MapInfo } from "../type";
import { createNoise2D } from "simplex-noise";

export default class CPanguMapPlate {
  info: MapInfo = {};
  initArg: InitPlateArgType;
  plateMaxProportion: number = 100;
  plateMinProportion: number = 0;
  constructor(info: MapInfo) {
    this.info = info;
  }
  sum(arr: Array<number>) {
    return arr.reduce(function (prev, curr, idx, arr) {
      return prev + curr;
    });
  }
  getMaximumPercentage(plateMaximumProportion: number, number: number) {
    if (
      plateMaximumProportion === this.initArg?.plateMaximumProportion &&
      number === this.initArg?.number
    ) {
      return;
    }
    this.plateMaxProportion =
      (100 / (number - 1 + plateMaximumProportion)) * plateMaximumProportion;
    this.plateMinProportion = this.plateMaxProportion / plateMaximumProportion;
  }
  createPlateTest1(arg: InitPlateArgType) {
    const blockNumber = arg.width * arg.height;
    let number = arg.number;
    const plateSizeInitList = [...new Array(arg.number)].map((ele) => {
      return (
        Math.random() * (this.plateMaxProportion - this.plateMinProportion) +
        this.plateMinProportion
      );
    });
    const plateSizeSum = this.sum(plateSizeInitList);
    const plateSizeList = plateSizeInitList.map((ele) => {
      return blockNumber * (ele / plateSizeSum);
    });

    const draw = () => {
      const noise2D = createNoise2D();
      let x = 1,
        y = 1;
      let obj: { [key: string]: number } = {};
      let sum = 0;
      const workContainer = document.getElementsByClassName("map-test");
      const workarea = document.createElement("canvas");
      workContainer[0].appendChild(workarea);
      var ctx = workarea.getContext("2d");
      ctx.clearRect(0, 0, 2000, 2000);
      const BS = 20;
      ctx.beginPath();
      while (y < arg.height) {
        while (x < arg.width) {
          const noiseVal = noise2D(x / BS, y / BS);
          const Color = noiseVal > 0 ? "0,0,0" : "255,255,255";
          ctx.fillStyle = `rgba(${Color}, ${Math.abs(noiseVal)})`;
          ctx.fillRect(x - 1, y - 1, 1, 1)
          x++;
        }
        y++;
        x = 0;
      }
      ctx.stroke();
    };
    draw();
  }
  init(arg: InitPlateArgType) {
    const plateMaximumProportion = arg?.plateMaximumProportion || 2;
    this.getMaximumPercentage(plateMaximumProportion, arg.number);
    this.createPlateTest1(arg);
    this.initArg = arg;
  }
}
