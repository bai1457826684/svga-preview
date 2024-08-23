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
      class="upload"
      drag
      multiple
      :auto-upload="false"
      :limit="1"
      :show-file-list="false"
      :on-change="onChangeFile"
    >
      <div class="upload-content">
        <!-- <el-icon class="el-icon--upload"><i-ep-upload-filled /></el-icon> -->
        <div ref="svgaInstance" class="svga"></div>
        <div class="el-upload__text">Drop file here or <em>click to upload</em></div>
      </div>
    </el-upload>
  </main>
</template>

<style scoped lang="scss">
.container {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;

  .upload {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;

    --el-fill-color-blank: #000;

    :deep() {
      .el-upload,
      .el-upload-dragger {
        width: 100%;
        height: 100%;
      }
      .el-upload-dragger {
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }

    &-content {
      border-radius: 10px;
      background-color: #fff;
    }
  }

  .svga {
    width: 960px;
    height: 500px;
  }
}
</style>
