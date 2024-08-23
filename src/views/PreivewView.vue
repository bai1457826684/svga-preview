<script setup lang="ts">
import type { UploadInstance, UploadFile, UploadFiles } from 'element-plus'
import SVGA from 'svgaplayerweb'

const elUploadInstance = ref<UploadInstance>()
const svgaInstance = ref<HTMLDivElement>()

const onChangeFile = (file: UploadFile, files: UploadFiles) => {
  elUploadInstance.value?.clearFiles()
  console.log(file)
  if (file.raw) {
    svgaParser.load(file.raw, (videoItem: SVGA.VideoEntity) => {
      console.log(videoItem)
      svgaPlayer.setVideoItem(videoItem)
      svgaPlayer.startAnimation()
    })
  }
}

let svgaPlayer: SVGA.Player
let svgaParser: SVGA.Parser
onMounted(() => {
  if (svgaInstance.value) {
    svgaPlayer = new SVGA.Player(svgaInstance.value)
    svgaParser = new SVGA.Parser()
  }
})
</script>

<template>
  <main class="container">
    <el-upload
      ref="elUploadInstance"
      class="upload-demo"
      drag
      multiple
      :auto-upload="false"
      :limit="1"
      :show-file-list="false"
      :on-change="onChangeFile"
    >
      <!-- <el-icon class="el-icon--upload"><i-ep-upload-filled /></el-icon> -->
      <div ref="svgaInstance" class="svga"></div>
      <div class="el-upload__text">Drop file here or <em>click to upload</em></div>
    </el-upload>
  </main>
</template>

<style scoped lang="scss">
.container {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;

  .svga {
    width: 300px;
    height: 400px;
  }
}
</style>
