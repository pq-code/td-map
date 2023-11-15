import { ref, onMounted, onBeforeUnmount } from "vue";
import { buildUUID } from "@/utils/index";

import 'ol/ol.css'
import { Map, View, Feature, Overlay } from 'ol'
import * as olSource from 'ol/source';
// import TileLayer from 'ol/layer/Tile';

import { Polygon, MultiPolygon } from "ol/geom"

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

    // 添加地图层
    plugins?.forEach((e: string) => {
      layers.push(
        new TileLayer({
          title: '天地图矢量图层',
          className: 'blueLayer',//增加className属性
          source: new olSource.XYZ({
            wrapX: false,
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
  }

  // 添加点
  const setMarker = (drop: object) => {
    try {
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
    } catch (err) {
      console.log(err)
    }
  }
  // 添加线
  const setPolygon = (polygon: object) => {
    // 创建矢量对象
    let feature = new Feature({ geometry: polygon.path })
    let source = new VectorSource({ wrapX: false });
    // 把要素集合添加到源 addFeatures
    source.addFeature(feature);
    // 创建矢量层
    let vector = new VectorLayer({
      source: source,
      style: new Style({
        fill: new Fill({
          color: 'rgba(255, 255, 255, 1)',
        }),
        stroke: new Stroke({
          color: polygon.strokeColor,
          width: polygon.strokeWeight,
        }),
        image: new Circle({
          radius: 7,
          fill: new Fill({
            color: '#ffcc33',
          }),
        }),
      }),
      id: `polygon${mapId}`,
    });
    Omap.addLayer(vector);
  }

  // 添加信息窗口
  const setInfoWindow = (el: object) => {
    const popup = new Overlay({
      element: el, //绑定 Overlay 对象和 DOM 对象的
      autoPan: true, // 定义弹出窗口在边缘点击时候可能不完整 设置自动平移效果
      offset: [-110, -180],//偏移量，使得弹出框显示在坐标点正上方
      autoPanAnimation: {
        duration: 250 //自动平移效果的动画时间 9毫秒
      }
    });
    Omap.addOverlay(popup);
  }

  // 绘制行政区域
  const setAdministrativeArea = (polygon) => {
    let feature = new Feature({
      type: 'polygon', geometry: new MultiPolygon(polygon.geometry.coordinates)
    })
    // let source = new VectorSource({ wrapX: false });

    feature.setStyle(new Style({
      stroke: new Stroke({
        width: 2,

        color: [255, 255, 0, 0.8]
      }),
      fill: new Fill({
        color: [248, 172, 166, 0.2]
      })
    }))
    let polygonLayer = new VectorLayer({
      source: new VectorSource({
        features: [feature]
      })
    })
    Omap.addLayer(polygonLayer)
  }

  return {
    tdOLoad,
    setMap,
    setMarker,
    setPolygon,
    setInfoWindow,
    setAdministrativeArea
  }
}

onMounted(() => {
  // Omap.on('singleclick', function (evt) {
  //   console.log(evt)
  // })
})

onBeforeUnmount(() => {

});
