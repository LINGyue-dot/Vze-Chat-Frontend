<template>
  <div class="uf-container">
    <input type="file" ref="fileRef" accept="image/*" @change="handleFileChange">
    <a-button @click="hanleUpload">上传</a-button>
  </div>
</template>
<script lang='ts' setup>
import { ref } from '@vue/runtime-core'
import { uploadHelper, vertifyFile } from '@/api/upload'
import { http } from '@/api/http'
import { message } from 'ant-design-vue'
import { UPLOAD_API } from '@/api/config'
import { generateImageUrl } from '@/utils/handler'

const SIZE = 10 * 1024 * 1024
// 当前文件
const contentFile = ref<File | null>(null)
// 切片数组
const chunkList = ref<{
  chunk: Blob;
  hash: string;
}[]>()
// 计算 hash 的线程
const worker = ref()
// 文件 hash 值
const fileHash = ref()
// 计算 hash 的进度条
const hashPercent = ref(0)

let cb

// input 改变文件，获取该文件
const handleFileChange = (e: Event) => {
  const tempFile = (e.target as HTMLInputElement).files
  if (!tempFile) {
    return
  }
  contentFile.value = tempFile[0]
  // 开始上传文件
  hanleUpload()
}
// 生成文件切片
const createFileChunk = (file: File, size = SIZE) => {
  const fileChunkList = []
  let cur = 0
  while (cur < file.size) {
    fileChunkList.push({ file: file.slice(cur, cur + size) })
    cur += size
  }
  return fileChunkList
}

// 上传切片
const uploadChunks = async () => {
  const requestList = chunkList.value?.map(({
    chunk,
    hash
  }) => {
    const formData = new FormData()
    formData.append('chunk', chunk)
    formData.append('hash', hash)
    formData.append('filename', contentFile.value?.name || 'temp.png')
    formData.append('fileHash', fileHash.value)
    return { formData }
  }).map(({ formData }) => uploadHelper({
    suffix: 'upload',
    formData
  }))
  try {
    await Promise.all(requestList || []) // 并发切片
    await mergeRequest() // 发送合并请求
  } catch (e) {
    message.error('上传失败')
  }
}
// 发送切片完毕，发送合并请求
const mergeRequest = async () => {
  await http('/merge', {
    method: 'POST',
    data: {
      filename: contentFile.value?.name,
      fileHash: fileHash.value,
      size: SIZE
    }
  }, UPLOAD_API).then(res => {
    console.log(res)
    message.success('上传成功')
    // 计算获取当前文件的 hash 值
    if (cb) {
      cb(generateImageUrl(contentFile.value?.name || 'temp.png', fileHash.value))
    }
  })
}

// 点击上传按钮
const hanleUpload = async () => {
  if (!contentFile.value) {
    return
  }
  const fileChunkList = createFileChunk(contentFile.value)
  fileHash.value = await calculateHash(fileChunkList)

  if (await alreadyUpload()) {
    // 计算获取当前文件的 hash 值
    if (cb) {
      cb(generateImageUrl(contentFile.value?.name || 'temp.png', fileHash.value))
    }
    return
  }
  chunkList.value = fileChunkList.map(({ file }, index) => ({
    chunk: file,
    fileHash: fileHash.value,
    hash: contentFile.value?.name + '-' + index,
    percentage: 0,
    size: file.size,
  }))
  await uploadChunks()
}

// 计算当前文件的 hash 值
const calculateHash = (fileChunkList) => {
  return new Promise(resolve => {
    worker.value = new Worker('/hash.js')
    // postMessage 的 message 必须是序列化的即非 proxy
    // https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm
    // 但是 如果是 unref 或者 ref 的类型自带有 proxy 代理所以必须直接传入原生的 chunkListData
    worker.value.postMessage({ fileChunkList })
    worker.value.onmessage = (e: any) => {
      const {
        percentage,
        hash
      } = e.data
      hashPercent.value = percentage
      if (hash) {
        resolve(hash)
      }
    }
  })
}

// 文件秒传
const alreadyUpload = async () => {
  const { code } = await vertifyFile(contentFile.value?.name || 'temp.png', fileHash.value)
  if (code == 204) {
    // 文件已经存在
    message.success('上传成功')
    return true
  } else {
    return false
  }
}

const fileRef = ref<HTMLInputElement>()

const callInputClick = () => {
  fileRef.value?.click()
}

// 供父组件调用传入 url 的回调函数
const overwriteByParent = (callback: (url: string) => {}) => {
  cb = callback
}
defineExpose({
  callInputClick,
  overwriteByParent
})

</script>
<style scoped>
.uf-container {
  display: none;
  overflow: hidden
}
</style>
