<script setup lang="ts">
import { ref, onMounted } from "vue";
import { buildUUID } from "../../../utils/index";
import useTMapLoader from "./hooks/useTMapLoader";
import { Map, View, Feature } from "ol";

import { Tile as TileLayer, Vector as VectorLayer } from "ol/layer";
import { XYZ, Vector as VectorSource } from "ol/source";
import * as olProj from "ol/proj";
import { LineString, Point } from "ol/geom";
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
    zoom: 14,
  }).then((Omap: any) => {
    map.value = new Map(Omap);
    setMap(map.value);
    // 添加点
    batchSetMarker([
      [120.159, 30.26],
      [120.169, 30.26],
      [120.169, 30.27],
      [120.163, 30.27],
      [120.163, 30.24],
    ]);
    // 添加多边形状
    batchSetPolygon([
      [120.153, 30.26],
      [120.162, 30.26],
      [120.163, 30.27],
      [120.164, 30.27],
      [120.162, 30.24],
    ]);
    // 区域描边
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
const batchSetPolygon = (polygon: Array<Array<number>> | Array<object>) => {
  setPolygon({
    path: new LineString(polygon),
    fillColor: "#ccebc5",
    strokeOpacity: 1,
    fillOpacity: 0.5,
    strokeColor: "#2b8cbe", // 线条颜色
    strokeWeight: 3, //线条宽度
    strokeStyle: "dashed", // 线样式
    strokeDasharray: [5, 5], //轮廓的虚线和间隙的样式
  });
};
</script>
<template>
  <div :id="`${mapId}_content`" class="content"></div>
</template>

<style lang="less" scoped>
.content {
  height: 100vh;
  width: 100vw;
  // ::v-deep .blueLayer {
  //   filter: grayscale(100%) sepia(30%) invert(100%) saturate(350%);
  // }
}
</style>
