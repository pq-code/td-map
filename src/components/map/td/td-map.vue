<script setup lang='ts'>
import { ref, onMounted } from 'vue';
import { buildUUID } from "../../../utils/index";

import L from "leaflet";
import "leaflet/dist/leaflet.css";
import 'leaflet.chinatmsproviders';

const MapKey = "6177ed85f51008870c8e12d50c4e35a2";
const mapId = ref(buildUUID())

let plugin = ['TianDiTu.Satellite.Map', 'TianDiTu.Satellite.Annotion']

onMounted(() => {
    let map = L.map(`${mapId.value}_content`, {
        minZoom: 1, //最小缩放值
        maxZoom: 18, //最大缩放值
        center: L.latLng(31.086444, 121.734942), //注意和其他地图经纬度格式区别
        zoom: 17, //初始缩放值
        zoomControl: false, //是否启用地图缩放控件
        attributionControl: false, //是否启用地图属性控件
    });
    //卫星地图
    let satelliteTileLayer = L.layerGroup([
        L.tileLayer.chinaProvider('TianDiTu.Satellite.Map', {
            key: MapKey, //你的地图key
        }),
        L.tileLayer.chinaProvider('TianDiTu.Satellite.Annotion', {
            key: MapKey, //你的地图key
        })
    ]);
    satelliteTileLayer.addTo(map);
})

</script>
<template>
    <div :id="`${mapId}_content`"
         class='content'>121</div>
</template>
<style lang='less' scoped>
.content {
    height: 100vh;
    width: 100vw;
}
</style>
