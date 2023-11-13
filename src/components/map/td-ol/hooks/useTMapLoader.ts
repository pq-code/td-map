
import 'ol/ol.css'
import { Map, View} from 'ol'
import * as olSource from 'ol/source';
import TileLayer from 'ol/layer/Tile';


const typeMapping:object = {
    img: 'http://t{0-7}.tianditu.com/DataServer?T=img_w&x={x}&y={y}&l={z}&tk=',
    cia: 'http://t{0-7}.tianditu.com/DataServer?T=cia_w&x={x}&y={y}&l={z}&tk=',
    vec: 'http://t{0-7}.tianditu.gov.cn/DataServer?T=vec_w&x={x}&y={y}&l={z}&tk=',
    cva: 'http://t{0-7}.tianditu.gov.cn/DataServer?T=cva_w&x={x}&y={y}&l={z}&tk='
} 

export function olLoad() {
  let Omap;

  const load = (options:options)=>{
    const { key ,plugins} = options
    // 匹配地图类型
    let layers = []

    plugins?.forEach(e=>{
      layers.push(
        new TileLayer({
          source: new olSource.XYZ({
            url: `${typeMapping[e]}${key}`,
          })
        })
      )
    })

    return new Promise((res,rej)=>{
      // 创建一个地图
      Omap = new Map({
        // 指向目标容器
        // target,
        // 加载图层
        // layers: [TiandiMap_img,TiandiMap_cia],
        layers: [],
        // 设置视图
          view: new View({
              // center: ol.proj.transform([116.2, 39.56], 'EPSG:4326', 'EPSG:3857'),
            center: [120.159, 30.26],// 中心点坐标
            zoom: 10, // 缩放等级
            projection: "EPSG:4326" // 坐标系
          })
        })
      })
    }
  return {
    load
  }
}

interface options  {
  key: string; // 申请好的Web端开发者Key，首次调用 load 时必填
  version: string; // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
  plugins?: string[]; //插件列表
  // 是否加载 AMapUI，缺省不加载
  AMapUI?: {
      version?: string; // AMapUI 缺省 1.1
      plugins?: string[]; // 需要加载的 AMapUI ui插件
  };
  // 是否加载 Loca， 缺省不加载
  Loca?: {
      version?: string; // Loca 版本，缺省 1.3.2
  };
}

