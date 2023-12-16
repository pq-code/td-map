<script setup lang="ts">
import { ref, onMounted } from "vue";
import { buildUUID } from "../../../utils/index";
import useTMapLoader from "./hooks/useTMapLoader";
import { Map, View, Feature, Overlay } from "ol";

import { Tile as TileLayer, Vector as VectorLayer } from "ol/layer";
import { XYZ, Vector as VectorSource } from "ol/source";
import * as olProj from "ol/proj";
import { LineString, Point } from "ol/geom";
import { Style, Fill, Stroke, Circle, Icon } from "ol/style";

import { lhJson } from "./hooks/json";
let map: any = {};
const {
  tdOLoad,
  setMarker,
  setMap,
  setPolygon,
  setInfoWindow,
  setAdministrativeArea,
} = useTMapLoader();
const mapId = ref(buildUUID());

let popupRef = ref();
let shopPopupShow = ref();
let windowPoint = "";
let routeFeature = "";
onMounted(() => {
  tdOLoad({
    key: "6177ed85f51008870c8e12d50c4e35a2",
    target: `${mapId.value}_content`,
    plugins: ["vec", "cva"],
    center: [121.131229, 28.845441],
    zoom: 10,
  }).then((Omap: any) => {
    map = new Map(Omap);
    setMap(map);
    // 添加点
    batchSetMarker([
      [121.131229, 28.845441],
      [121.0319, 28.84541],
      [121.1309, 28.83541],
      [121.1209, 28.83541],
      [121.1359, 28.88541],
      [121.1459, 29.08541],
    ]);
    // 添加多边形状
    batchSetPolygon([
      [120.153, 30.26],
      [120.162, 30.26],
      [120.163, 30.27],
      [120.164, 30.27],
      [120.162, 30.24],
    ]);
    // 点击弹出框
    addWindos();

    map.on("singleclick", (e) => {
      // 判断是否点击在点上
      let feature = map.forEachFeatureAtPixel(e.pixel, (feature) => feature);
      if (feature && feature.getProperties().type !== "polygon") {
        // 设置弹窗位置
        console.log("--------", feature.get("features")?.length);
        if (feature.get("features")?.length > 1) {
          map.getView().animate({
            center: feature.getGeometry().getCoordinates(),
            zoom: 13,
          });
        } else {
          let coordinates = feature.getGeometry().getCoordinates();
          console.log("popupRef.value", popupRef.value, coordinates, map);
          windowPoint.setPosition(coordinates);
        }
      } else {
        windowPoint.setPosition(void 0);
      }

      var pixel = map.getEventPixel(e.originalEvent);
      console.log("pixel", pixel);
      console.log("feature", feature);
    });
    // 鼠标变手
    map.on("pointermove", (e) => {
      if (map.hasFeatureAtPixel(e.pixel)) {
        map.getViewport().style.cursor = "pointer";
      } else {
        map.getViewport().style.cursor = "inherit";
      }
    });
    drawAdministrativeArea(lhJson);
  });
});

// 添加mark
const batchSetMarker = (drop: Array<Array<number>> | Array<object>) => {
  let a = [];
  for (let item of drop) {
    console.log("new Point", item);
    a.push({
      position: new Point(item),
      content: new Icon({
        // src: "https://a.amap.com/lbs/static/img/doc/doc_1678970777168_d2b5c.png",
        src: "https://wzpm-platform.oss-cn-hangzhou.aliyuncs.com/collaboration-platform-pc/prod/largeScreen-202311101540/static/img/0-3.a37ee087.png",
        scale: 0.4,
      }),
    });
  }
  setMarker(a);
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

// 添加信息窗体
const addWindos = () => {
  // 信息窗体的内容
  var content = [
    "<div><img src='' http:='webapi.amap.com' images='' autonavi.png=''> " +
      "<div style='' padding:'0px 0p 4px'><b>高德软件有限公司</b>" +
      "电话 : 010-84107000   邮编 : 100102" +
      "地址 : 北京市望京阜通东大街方恒国际中心A座16层" +
      "</div></div>",
  ];
  windowPoint = new Overlay({
    element: popupRef.value, //绑定 Overlay 对象和 DOM 对象的
    autoPan: true, // 定义弹出窗口在边缘点击时候可能不完整 设置自动平移效果
    positioning: "bottom-center",
    stopEvent: false,
    offset: [-140, -390],
  });

  map.addOverlay(windowPoint);
};

// 绘制行政区域
const drawAdministrativeArea = (lhJson: object) => {
  console.log("lhJson---------", lhJson);
  setAdministrativeArea(lhJson?.features[0]);
};
const button = () => {
  console.log("点击按钮");
};
</script>
<template>
  <div ref="popupRef" class="popup">
    <div
      style="
        background-image: url(&quot;https://wzpm-platform.oss-cn-hangzhou.aliyuncs.com/collaboration-platform-pc/prod/largeScreen-202311101540/static/img/map-dialog-bg.02e07273.png&quot;);
        background-size: 100% 100%;
        width: 264px;
        padding: 24px 30px 24px 16px;
        box-sizing: border-box;
      "
    >
      <div style="cursor: pointer">
        <div
          style="
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
          "
        >
          <span
            style="
              display: -webkit-box;
              max-width: 150px;
              color: rgb(240, 214, 151);
              margin-right: 8px;
              text-overflow: ellipsis;
              overflow: hidden;
              -webkit-line-clamp: 2;
              -webkit-box-orient: vertical;
              line-height: 18px;
            "
            >灵江中学（高中部）迁建工程</span
          ><span
            style="
              display: inline-block;
              height: 18px;
              min-width: 80px;
              line-height: 18px;
              padding: 2px 8px;
              color: rgb(255, 255, 255);
              background: rgb(245, 63, 63);
              font-size: 0.8rem;
            "
            >在建-延期</span
          >
        </div>
        <img
          src="https://linhaishefa.eos-shanghai-2.cmecloud.cn/design/u%3D404610317%2C2166368205%26fm%3D193%26f%3DGIF.jpg"
          style="
            width: 100%;
            height: 148px;
            text-align: center;
            margin: 8px 0px;
            display: block;
          "
        />
        <div>
          <span style="line-height: 20px"
            ><span style="font-size: 14px">进度主节点</span
            ><span
              style="
                color: rgba(240, 214, 151, 0.9);
                margin-left: 8px;
                font-size: 14px;
              "
              >控制性详细规划编制</span
            ></span
          >
        </div>
        <div>
          <span style="line-height: 20px"
            ><span style="font-size: 14px">项目负责人</span
            ><span
              style="
                color: rgba(240, 214, 151, 0.9);
                margin-left: 8px;
                font-size: 14px;
              "
              >谢海波</span
            ></span
          >
        </div>
      </div>
      <div
        style="
          display: flex;
          flex-direction: column;
          justify-content: start;
          align-items: center;
        "
      >
        <img
          src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAR4AAAAECAYAAABY81CfAAAAAXNSR0IArs4c6QAABK1JREFUWEftlUFuXDcMhvlT0nsez0wQpHDRAgFadOksc4Fcor1OfZ9cojfoKll10QJBvUiTuh57xu9J4l+Q7yW5QVb2wJBE/aQ0JPUN5PHvMQOPGXjMwFfOAMgrlddvIPJa5KeXKpsTZPgB8u6E6/1ev5e/5f1hrxci8nFz0md5j5vDP0DeQadRJXUgdYjcCeZBj8mwTWcQNTzUohs5iegIzB0PuSvmAePZg0wtK5QYtWA+dpVxkrlnHT0BKWmtxKDEDIuxNmJARjVTl8BHZAgIUaI1oighSGhmiu5z369hgy2j+Cf2EkCP4XOBx+ymsc5uM0GscxNUVUkiQqpA0a0j++hrWbRxJ1UV83hLTKNqki4iru0Al/hR4/DV0MGITsEiEA+hcScQ8Nj+ofspLPwsToP4ji57Zh5p8XIN/U6+10OjYi5b4q5aPyc8/Gzfl5x13BXk3YC8GWTYj1p2Bel8wLDay3aQshu0uGb75b9sC4b9+MnGfqqsd5X1fpZ6N1m9n9liXaXe+7qy3s4+SjvOVg8z23HmfFfZ7mbWu9nasbJNzW+opF/Qb0rSTKAUAYVGAGbdYk/923nG6RtCMZio0Pc1fD3GGsvnGgUx66TrVODufoZnkEKvAMgeFXKP9XyEXoilIEZbKu2JdJ13R2bqZl6N3mzVCylmiTnWdC388mbSUzR2UmEzMCWhrP7scS8RA4luUa4E0sAcHdSsikhuanQ/1yWwtGY+RietNtb6OVYZ1R5MOMzVJPv3BLmO0vyFTMYCnj0k4wCyuu1kHJVy2Mn2abGb+cB2e7Cn59/w/emGz3bf8vr4gRdPnnO6/mDtWeZ/4x/28voV5fKC8strA6+uVH69Evntlb59f6GXL0Tkr9/x5+Y5fhwnXH+YkXd7vSgVH28bUBqQ90BuARw4fOQgmEdF2iBANB1w1DNsk+E0GTZbw9SKymw4OxOZevb6AtWhYXAAiRag9y8P0+0969zMHyQcRoOIVIeGfgLLCpfuvUe0pOpQyUEBLw/V581Uc4k1pAukaIzu02nqTAltgGnVBZqI/hlS3pPLXnJoxXzVCL01NcDmEFmB4T3tTyQlootDyDs80OAt5wAKKHjbLKBawKAOK/MXgOhp55FnyeHhfg40JxS7n7kAKljswfyZ+MLPpiwg8/ck8ez8lBVIy5kOKdcHlLQkJAfOtqS8KzrsR6bzQct2QNkPKNsi+dznowaIzgfJuyG5fdEs4Cnbwnpq7Pezg4fzYQWMAyVsAaReb2c4bNrdbHMAqbIfZ5tuJ7fF2ubm1wuYWFDGGIkLU4DAQeJAUaoTxZPr8AnI+Dx0SAGpqAiXefh6CrwqCupqVdB6xPsCKa7+YmaqiZ0BsoChz9MCqRVsFveM35yInagrYBrBZItP+Ae8VlCsIGPvlvyemtnYQx+Q8RKzkVYo1pigJklYrQVocioBpUgCuhUTzgZKB0uOEht7peSBPsbawAGzTZ6kfsZhU80mNWkTWTYcdbLTSYRlyzOd7K4eeT7uAz5WQc7gDtl4rvxXRJ7kYv3jjdmTxH6vfJ7fmXx3ybdvRS7lrb1+I/z5hf9aP/49ZuAxA48Z+MoZ+B92PrGz4mIdXgAAAABJRU5ErkJggg=="
          style="width: 120px; margin: 8px 0px"
        />
        <div style="cursor: pointer; display: block">查看红线图</div>
      </div>
    </div>
  </div>
  <div :id="`${mapId}_content`" class="content"></div>
</template>

<style lang="less" scoped>
.content {
  height: 100vh;
  width: 100vw;
  ::v-deep .blueLayer {
    filter: grayscale(100%) sepia(30%) invert(100%) saturate(350%);
  }
}
.popup {
  position: absolute;

  background-size: 100% 100%;
  width: 264px;
  padding: 24px 30px 24px 16px;
  box-sizing: border-box;
  .info {
    padding: 10px;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    flex-wrap: nowrap;
    .title {
      display: -webkit-box;
      max-width: 150px;
      color: rgb(240, 214, 151);
      margin-right: 8px;
      text-overflow: ellipsis;
      overflow: hidden;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      line-height: 18px;
    }
  }
}
</style>
