interface argAnyType {
  [key: string]: any
}
export interface PathType {
  path: Array<{ [key: string]: string | number }>;
}

export type InitPlateConfigType = {
  direction: number;
  boundary: Array<
    {
      relationship?: "near" | "away";
      nearConfig?: "up" | "down";
    } & PathType
  >;
} & PathType;
// 生成plate配置
export interface InitPlateArgType {
  open: boolean;
  number?: number;
  width?: number;
  height?: number;
  plateMaximumProportion?: number;
  config?: Array<InitPlateConfigType>;
}
// 总生成配置
export interface InitArgType {
  plate?: InitPlateArgType;
}
export type MapInfo = {
  plate?: Array<InitPlateConfigType>
} & argAnyType
