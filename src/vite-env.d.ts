/// <reference types="vite/client" />

import SVGA from 'svgaplayerweb'
// import { ComponentOptions } from 'vue'

declare global {
  interface Window {
    JSZipUtils: any
    JSZip: any
  }
}

// declare module '*.vue' {
//   const componentOptions: ComponentOptions
//   export default componentOptions
// }

declare module 'svgaplayerweb' {
  interface Parser extends SVGA.Parser {
    load(
      file: File,
      success: (videoItem: SVGA.VideoEntity) => void,
      failure?: ((err: Error) => void) | undefined
    ): void
  }
}
