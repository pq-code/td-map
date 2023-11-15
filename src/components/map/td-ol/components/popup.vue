<script setup lang="ts">
import { ref } from "vue";
let popupRef = ref();
let shopPopupShow = ref();
const props = defineProps({
  windowInfo: {
    type: Object,
    default() {
      return {};
    },
  },
});
</script>

<template>
  <div ref="popupRef" class="popup" v-show="shopPopupShow">
    <div class="info">
      <div>标题</div>
      <div>信息1</div>
      <div>信息2</div>
      <div>信息3</div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.popup {
  width: 200px;
  height: 160px;
  position: absolute;
  z-index: 400;
  text-align: center;
  line-height: 40px;
  opacity: 0.5;
  color: #ffffff;
  background-color: #000000;
  .info {
    padding: 10px;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    flex-wrap: nowrap;
  }
}
</style>
