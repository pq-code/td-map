<script setup lang="ts">
import { ref, onMounted } from "vue";
import { buildUUID } from "../../../utils/index";
import useTMapLoader from "./hooks/useTMapLoader";
import { Map, View, Feature } from "ol";

import { Tile as TileLayer, Vector as VectorLayer } from "ol/layer";
import { XYZ, Vector as VectorSource } from "ol/source";
import * as olProj from "ol/proj";
import { Point } from "ol/geom";
import { Style, Fill, Stroke, Circle, Icon } from "ol/style";
let map = ref();
const { tdOLoad, setMarker, setMap, setPolygon } = useTMapLoader();
const mapId = ref(buildUUID());

onMounted(() => {
  tdOLoad({
    key: "6177ed85f51008870c8e12d50c4e35a2",
    target: `${mapId.value}_content`,
    plugins: ["vec", "cva"],
    center: [120.159, 30.26],
    zoom: 15,
  }).then((Omap: any) => {
    map.value = new Map(Omap);
    setMap(map.value);
    // 添加多边形
    batchSetMarker([
      [120.159, 30.26],
      [120.169, 30.26],
      [120.169, 30.27],
      [120.163, 30.27],
    ]);
  });
});

// 添加mark
const batchSetMarker = (drop: Array<Array<number>> | Array<object>) => {
  for (let item of drop) {
    setMarker({
      position: new Point(item),
      content: new Icon({
        src: "https://a.amap.com/lbs/static/img/doc/doc_1678970777168_d2b5c.png",
        scale: 0.8,
      }),
    });
  }
};
// 添加多边形
const pathArr = [
  [
    [
      [121.7789, 31.3102],
      [121.7279, 31.3548],
      [121.5723, 31.4361],
      [121.5093, 31.4898],
      [121.5624, 31.4864],
      [121.5856, 31.4547],
      [121.7694, 31.3907],
      [121.796, 31.3456],
      [121.7789, 31.3102],
    ],
  ],
];
setPolygon();
// const polygon = new AMap.Polygon({
//   path: pathArr,
//   fillColor: "#ccebc5", // 多边形填充颜色
//   strokeOpacity: 1, // 线条透明度
//   fillOpacity: 0.5, //填充透明度
//   strokeColor: "#2b8cbe", // 线条颜色
//   strokeWeight: 1, //线条宽度
//   strokeStyle: "dashed", // 线样式
//   strokeDasharray: [5, 5], //轮廓的虚线和间隙的样式
// });
</script>
<template>
  <div :id="`${mapId}_content`" class="content"></div>
</template>

<style lang="less" scoped>
.openlayers {
  position: absolute;
  z-index: 400;
  width: 100vw;
  height: 40px;
  text-align: center;
  line-height: 40px;
  opacity: 0.5;
  color: #ffffff;
  background-color: #000000;
}

.content {
  height: 100vh;
  width: 100vw;
}
</style>
