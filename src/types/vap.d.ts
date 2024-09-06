import type { VapConfig } from 'video-animation-player/dist/type'
import type VapVideoType from 'video-animation-player/dist/video'

export class VapVideo extends VapVideoType {
  play(options: VapConfig): void
}

/**
 * openVap方法的参数
 */
export interface OpenVapOptions {
  /**
   * vap/MP4文件URL
   */
  vapUrl: string
  /**
   * vap/MP4对应json文件配置/jsonURL(json配置信息请求时的参数, 有json配置文件时必传)
   */
  jsonConfig?: object | string
  /**
   * 开始遍历的索引(从vap文件获取json信息时的参数, 可选)
   */
  startIndex?: number
  /**
   * 最大遍历次数(从vap文件获取json信息时的参数, 可选)
   */
  maxLength?: number
  /**
   * 图像铺满方式，对应canvas的object-fit属性，默认 cover
   */
  objectFit?: 'contain' | 'cover'
  /**
   * 是否启用精确模式，默认false，启用后真机上可能会画面卡顿，在动效显示不了时开启
   */
  accurate?: boolean
  /**
   * vap融合信息
   */
  extend?: {
    [key: string]: any
  }
  [key: string]: any
}

/**
 * vap/svga 预览方法参数
 */
export interface PreviewOptions extends OpenVapOptions {
  /**
   * svga文件地址
   */
  svgaUrl?: string
  vapUrl?: string
}
