<script setup lang='ts'>
import { ref } from 'vue';
import { buildUUID } from "../../../utils/index";
import AMapLoader from '@amap/amap-jsapi-loader';

const props = defineProps({
    mapOptions: {
        type: Object,
        default: () => {
            return {
                WebGLParams: {
                    preserveDrawingBuffer: true,// 解决导出pdf白屏

                },
                zoom: 14, // 初始化地图级别
                center: [120.159, 30.26], // 初始化地图中心点位置
            }
        }
    },
})

let map: any
let AMap: any,
    cameraMarkers, // 摄像头marker
    cameraRaduis, // 摄像头范围背景
    trackMarkers, // 轨迹track
    trackLine, // 轨迹线
    cameraInfoWindow // 摄像头信息

let mapStatus = false

const mapId = ref(buildUUID())

window._AMapSecurityConfig = {
    securityJsCode: 'd492d663c078eb911bd60e949bff7a49'
}

AMapLoader.load({
    key: '5bdccbb7c5988b5f2fa84090497a2957',
    version: '2.0',
    plugins: ['AMap.PlaceSearch', 'AMap.AutoComplete'],

}).then((amap: any) => {
    AMap = amap
    map = new AMap.Map(mapId.value + '_content', {
        resizeEnable: true,
        ...props.mapOptions
    })
    map.on('complete', () => {
        mapStatus = true
        console.log('mapStatus')
        cameraMarkers = new AMap.OverlayGroup([]) // 摄像头图层组。统一管理所有摄像头
        cameraRaduis = new AMap.OverlayGroup([]) // 搜索范围图层组。统一管理所有摄像头的搜索范围
        trackMarkers = new AMap.OverlayGroup([]) // 轨迹图层组、
        trackLine = new AMap.Polyline({
            // 轨迹线
            strokeColor: '#EB414D',
            strokeStyle: 'dashed',
            strokeOpacity: 1,
            strokeWeight: 1,
            strokeDasharray: [3, 5]
        })
        // 摄像头信息
        cameraInfoWindow = new AMap.InfoWindow({
            isCustom: true,
            offset: new AMap.Pixel(-0, -40),
            content: '',
            closeWhenClickMap: true
        })

        map.add([cameraMarkers, cameraRaduis, trackMarkers, trackLine])

    })
}).catch((e: any) => {
    console.error('地图加载失败', e);
})

</script>
<template>
    <div class="track-map">
        <div class="track-map_content"
             :id="`${mapId}_content`"></div>
        <!-- <div class="seatch-input"
             :id="`${mapId}_seatch`"></div> -->
    </div>
</template>
<style lang='less' scoped>
.track-map {
    width: 100%;
    height: 100%;

    .track-map_content {
        width: 100%;
        height: 100%;
    }

    .seatch-input {
        width: 100%;
        height: 100%;
    }
}
</style>
