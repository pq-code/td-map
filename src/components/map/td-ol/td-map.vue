<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { buildUUID } from '../../../utils/index'
import { olLoad } from './hooks/useTMapLoader'

import 'ol/ol.css'
import { Map, View } from 'ol'
import * as olSource from 'ol/source'
import TileLayer from 'ol/layer/Tile'
// import WMTS from 'ol/source/WMTS';
// import WMTSTileGrid from 'ol/tilegrid/WMTS';
// import { get as getProjection } from 'ol/proj';
// import { getWidth, getTopLeft } from 'ol/extent';

const MapKey = '6177ed85f51008870c8e12d50c4e35a2'
const mapId = ref(buildUUID())

// 初始化一个空地图
const map = ref()

var TiandiMap_img = new TileLayer({
  name: '天地图影像图层',
  source: new olSource.XYZ({
    url: 'http://t0.tianditu.com/DataServer?T=img_w&x={x}&y={y}&l={z}&tk=' + MapKey + '',
    wrapX: false
  })
})
var TiandiMap_cia = new TileLayer({
  name: '天地图影像注记图层',
  source: new olSource.XYZ({
    url: 'http://t0.tianditu.com/DataServer?T=cia_w&x={x}&y={y}&l={z}&tk=' + MapKey + '',
    wrapX: false
  })
})

var vec_w = new TileLayer({
  name: '矢量底图',
  source: new olSource.XYZ({
    url: 'http://t{0-7}.tianditu.gov.cn/DataServer?T=vec_w&x={x}&y={y}&l={z}&tk=' + MapKey + ''
  })
})

var cva_w = new TileLayer({
  name: '矢量图文字标注',
  source: new olSource.XYZ({
    url: 'http://t{0-7}.tianditu.gov.cn/DataServer?T=cva_w&x={x}&y={y}&l={z}&tk=' + MapKey + ''
  })
})

// 初始化地图函数
function initMap() {
  // 创建一个地图
  map.value = new Map({
    // 指向目标容器
    target: `${mapId.value}_content`,
    // 加载图层
    // layers: [TiandiMap_img,TiandiMap_cia],
    layers: [vec_w, cva_w],
    // 设置视图
    view: new View({
      // center: ol.proj.transform([116.2, 39.56], 'EPSG:4326', 'EPSG:3857'),
      center: [120.159, 30.26], // 中心点坐标
      zoom: 10, // 缩放等级
      projection: 'EPSG:4326' // 坐标系
    })
  })
}
// 组件挂载时初始化地图
onMounted(() => {
  //   initMap();
  const { load } = olLoad
  load({
    key: '6177ed85f51008870c8e12d50c4e35a2',
    target: `${mapId.value}_content`,
    plugins: ['vec', 'cva']
  }).then((Omap) => {})
})
</script>
<template>
  <!-- <div class="openlayers">
        openlayers
    </div> -->
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
