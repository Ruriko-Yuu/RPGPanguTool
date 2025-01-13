import MainPage from "../src/pages";
import Layout from "../layout";
const environment = process.env.NODE_ENV || "prod";
const ctx = (require as any).context("./config/", false, /.ts$/);
const map: { [key: string]: { [key: string]: string } } = {};
const mapKey: Array<string> = [];
for (const key of ctx.keys()) {
  const fileKey = key.replace(/\.\/|\.ts/g, "");
  map[fileKey] = ctx(key).default;
  mapKey.push(fileKey)
}
const config = [
  { path: '/', element: MainPage, layout: Layout },
  ...mapKey.map(ele => map[ele]),
]
console.log("🍃路由配置", config)
export default config