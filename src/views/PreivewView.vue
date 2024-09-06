<script setup lang="ts">
import { type UploadInstance, type UploadFile, type UploadFiles, ElMessage } from 'element-plus'
import SVGA from 'svgaplayerweb'
import Vap from 'video-animation-player'
import type { VapVideo } from '@/types/vap.d.ts'
import { usePreviewStore } from '@/stores/preview'
import { getVapJsonInfo, blobToUrl, warnCount } from './vap'

const elUploadInstance = ref<UploadInstance>()
const svgaInstance = ref<HTMLDivElement>()

// 上传文件
const onChangeFile = (file: UploadFile, files: UploadFiles) => {
  elUploadInstance.value?.clearFiles()
  console.log(file)
  if (file.raw) {
    isPlaySvga.value = file.name.includes('svga')
    if (isPlaySvga.value) {
      playSvga(file.raw)
    } else {
      playVap(file.raw)
    }
  }
}

// 当前是否为播放svga
const isPlaySvga = ref(true)

// 预览store，有是否开启精确模式状态
const previewStore = usePreviewStore()

// 播放svga
const playSvga = (file: File) => {
  svgaParser.load(file, (videoItem: SVGA.VideoEntity) => {
    console.log(videoItem)
    svgaPlayer.setVideoItem(videoItem)
    svgaPlayer.startAnimation()
  })
}

// vap 实例
const vap: VapVideo = new Vap()
// vap 容器实例
const vapInstance = ref<HTMLDivElement>()
// 融合信息，TODO: 待写一个表格实现动态添加
const vapExtend = ref<Record<string, string>>({})
// 播放vap
const playVap = async (file: File) => {
  if (!vapInstance.value) return
  // 获取json信息
  let json = {}
  let blob: Blob | null = null
  // 方法一 => json配置信息从vap/MP4中获取
  // 请求类型为blob(该方法播放只请求一遍MP4,但iOS不兼容)
  ;[blob, json] = await getVapJsonInfo(file)

  // 获取vap/MP4的url
  const src = await blobToUrl(blob)
  // const src = options.vapUrl;
  console.log(src, previewStore.isAccurate)

  // 播放
  vap.play({
    // 容器
    container: vapInstance.value,
    // vap文件URL
    src,
    // 是否循环
    loop: true,
    // 起始播放时间点
    beginPoint: 0,
    // 精准模式
    accurate: previewStore.isAccurate,
    // 组件基于type字段做了实例化缓存，不同的VAP实例应该使用不同的type值（如0、1、2等），这里使用vapUrl作为type值
    type: src,
    // vap对应的json文件
    config: json as object,
    // vap融合信息
    ...(vapExtend.value || {}),
    // 加载失败回调
    onLoadError() {
      ElMessage.error('vap加载失败')
    }
  })

  // vap事件监听
  // vap.once('playing', onPlaying)
  // vap.once('ended', onEnded)
}

let svgaPlayer: SVGA.Player
let svgaParser: SVGA.Parser
onMounted(() => {
  if (svgaInstance.value) {
    // 初始化svga
    svgaPlayer = new SVGA.Player(svgaInstance.value)
    svgaParser = new SVGA.Parser()
  }
})
</script>

<template>
  <main class="container">
    <el-switch
      :model-value="previewStore.isAccurate"
      class="switch"
      size="large"
      active-text="开启vap精确模式"
      inactive-text="关闭vap精确模式"
      @change="previewStore.switchAccurate"
    />
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
        <div v-show="isPlaySvga" ref="svgaInstance" class="svga"></div>
        <div v-show="!isPlaySvga" ref="vapInstance" class="vap"></div>
        <div class="el-upload__text">Drop file here or <em>click to upload</em></div>
      </div>
    </el-upload>
    <div class="tips">当前vap遍历json信息次数超出 {{ warnCount }} 时警告</div>
  </main>
</template>

<style scoped lang="scss">
.container {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;

  .switch {
    position: absolute;
    top: 20px;
    right: 20px;
    z-index: 10;

    --el-text-color-primary: #ffffffb0;
  }

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

  .svga,
  .vap {
    width: 960px;
    height: 500px;
  }

  .vap {
    :deep(canvas) {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
  }

  .tips {
    position: absolute;
    bottom: 20px;
    // right: 20px;
    left: 0;
    text-align: center;
    width: 100%;
    font-size: 14px;
    z-index: 10;
    color: #ffffffb0;
  }
}
</style>
