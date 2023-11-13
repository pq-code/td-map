import { ref } from "vue";
import { buildUUID } from "@/utils/index";

import 'ol/ol.css'
import { Map, View, Feature } from 'ol'
import * as olSource from 'ol/source';
// import TileLayer from 'ol/layer/Tile';

import { Tile as TileLayer, Vector as VectorLayer } from "ol/layer";
import { XYZ, Vector as VectorSource } from "ol/source";
import * as olProj from "ol/proj";
import { Point } from "ol/geom";
import { Style, Fill, Stroke, Circle, Icon } from "ol/style";

const mapId = ref(buildUUID());
interface options {
  key: string; // 申请好的Web端开发者Key，首次调用 load 时必填
  target: string; // 容器id
  version?: string; // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
  plugins?: string[]; //插件列表
  center?: Array<number> // 中心点
  zoom?: number
  projection?: string
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

const typeMapping: object = {
  img: 'http://t{0-7}.tianditu.com/DataServer?T=img_w&x={x}&y={y}&l={z}&tk=',
  cia: 'http://t{0-7}.tianditu.com/DataServer?T=cia_w&x={x}&y={y}&l={z}&tk=',
  vec: 'http://t{0-7}.tianditu.gov.cn/DataServer?T=vec_w&x={x}&y={y}&l={z}&tk=',
  cva: 'http://t{0-7}.tianditu.gov.cn/DataServer?T=cva_w&x={x}&y={y}&l={z}&tk='
}

let Omap: any

export default function useTMapLoader() {

  const tdOLoad = (options: options) => {
    const { key, plugins = ["vec", "cva"], target, center = [120.159, 30.26], zoom = 10, projection = "EPSG:4326" } = options
    // 匹配地图类型
    let layers: any = []

    plugins?.forEach((e: string) => {
      layers.push(
        new TileLayer({
          source: new olSource.XYZ({
            url: `${typeMapping[e]}${key}`,
          })
        })
      )
    })

    return new Promise((res, rej) => {
      res({
        // 指向目标容器
        target,
        // 加载图层
        layers,
        // 设置视图
        view: new View({
          // center: ol.proj.transform([116.2, 39.56], 'EPSG:4326', 'EPSG:3857'),
          center,// 中心点坐标
          zoom, // 缩放等级
          projection // 坐标系
        })
      })
    })
  }

  // 获取map对象
  const setMap = (map: any) => {
    Omap = map
    //创建矢量层用来装后续添加的图形

  }

  // 添加点
  const setMarker = (drop: object) => {
    const styles = [
      new Style({
        image: drop.content
      }),
    ];
    // 创建矢量对象
    let feature = new Feature({
      geometry: drop.position,
    });
    // 创建矢量源
    let source = new VectorSource({ wrapX: false });
    // 把要素集合添加到源 addFeatures
    source.addFeature(feature);
    // 创建矢量层
    let vector = new VectorLayer({
      source: source,
      style: styles,
      id: `marker${mapId}`,
    });
    // 把源添加到地图
    Omap.addLayer(vector);
    console.log(Omap)
  }

  const setPolygon = () => {

  }

  return {
    tdOLoad,
    setMap,
    setMarker,
    setPolygon
  }
}


