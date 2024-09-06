import { ElMessage } from 'element-plus'

// 最大遍历次数
export const maxTraversal = Infinity
// 开始警告次数
export const warnCount = 10000

/**
 * 从vap/MP4文件中获取json信息(带MP4文件数据blob)
 */
export const getVapJsonInfo = (file: File): Promise<[Blob, object]> => {
  return new Promise((resolve, reject) => {
    file.text().then((text) => {
      const json = parseJson(text)
      if (json) {
        resolve([file, json])
      } else {
        reject('没有找到json信息')
      }
    })
  })
}

const parseJson = (
  text: string,
  startIndex: number = 0,
  maxLength: number = maxTraversal
): object | null => {
  const targetStr = 'vapc' // 目标字符串，出现该字符串表示有json配置信息
  const targetStrLength = targetStr.length
  let i = 0 // 遍历目标字符串索引
  let jsonStr = '' // json字符串
  const symbolCountMap = { '{': 0, '[': 0 }
  const setSymbolCount = (str: string) => {
    const map: Record<string, undefined | (() => void)> = {
      '{': () => {
        symbolCountMap['{']++
      },
      '}': () => {
        symbolCountMap['{']--
      },
      '[': () => {
        symbolCountMap['[']++
      },
      ']': () => {
        symbolCountMap['[']--
      }
    }
    const action = map[str]
    action && action()
  }
  for (let index = startIndex; index < text.length; index++) {
    // 没有获取到json信息
    if (index > startIndex + maxLength) {
      throw new Error(
        `当前vap遍历的部分没有json信息，可更改当前的配置信息: { startIndex: ${startIndex}, maxLength: ${maxLength} }`
      )
    }
    const str = text[index]
    // 可开始获取json信息
    if (i === targetStrLength) {
      jsonStr += str
      setSymbolCount(str)
      // json信息获取完毕
      if (symbolCountMap['['] === 0 && symbolCountMap['{'] === 0) {
        console.log(
          `获取vap/MP4配置信息成功，当前遍历次数: ${index}/${text.length}; 当前json字符串长度: ${jsonStr.length};
              vap最佳配置信息为 { startIndex: ${index - jsonStr.length - targetStrLength + 1}, maxLength: ${jsonStr.length + targetStrLength - 1} },
              当前配置信息为 { startIndex: ${startIndex}, maxLength: ${maxLength} }`
        )

        // 提示警告
        if (index > startIndex + warnCount) {
          ElMessage.warning({
            message: `当前vap文件遍历次数为${index}/${text.length}, vap最佳配置信息为 { startIndex: ${index - jsonStr.length - targetStrLength + 1}, maxLength: ${jsonStr.length + targetStrLength - 1} }`,
            duration: 0,
            showClose: true
          })
        }
        try {
          const json = JSON.parse(jsonStr)
          // 返回json信息
          return json
        } catch (error) {
          console.log('获取vap/MP4配置信息错误', error)
          return null
        }
      }
      continue
    }
    // 还没遍历到目标字符串
    if (targetStr[i] === str) {
      i++
    } else {
      i = 0
    }
  }
  return null
}

/**
 * blob 转 url
 * @param blob mp4数据
 */
export const blobToUrl = (blob: Blob) => {
  const URL = window.webkitURL || window.URL
  return new Promise<string>((resolve) => {
    if (/iphone|ipad|ipod/i.test(navigator.userAgent)) {
      const fileReader = new FileReader()

      fileReader.onloadend = function () {
        const resultStr = fileReader.result as string
        const raw = atob(resultStr.slice(resultStr.indexOf(',') + 1))
        const buf = Array(raw.length)

        for (let d = 0; d < raw.length; d++) {
          buf[d] = raw.charCodeAt(d)
        }

        const arr = new Uint8Array(buf)
        const blob = new Blob([arr], {
          type: 'video/mp4'
        })
        resolve(URL.createObjectURL(blob))
      }

      fileReader.readAsDataURL(blob)
    } else {
      resolve(URL.createObjectURL(blob))
    }
  })
}
