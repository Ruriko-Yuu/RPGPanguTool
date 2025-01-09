import { InitArgType, InitPlateArgType, MapInfo } from "./type";
import CPanguMapPlate from "./plate";
export default class CPanguMap {
  info: MapInfo = {};
  plate: CPanguMapPlate;
  constructor(info: MapInfo) {
    this.info = info;
  }
  init(arg: InitArgType) {
    this.plateInit(arg);
  }
  plateInit(arg: InitArgType) {
    if (arg?.plate?.open) {
      if (!this.plate) {
        this.plate = new CPanguMapPlate(this.info);
      }
      this.plate.init(arg.plate);
    } else {
      if (arg?.plate?.config) {
        this.info.plate = arg?.plate?.config;
      }
      // TODO: 🎄next init
    }
  }
}
