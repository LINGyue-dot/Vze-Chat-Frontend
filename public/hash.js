// 引入外部 scripts

self.importScripts("./spark-md5.min.js"); // 导入脚本

// 生成文件 hash
self.onmessage = (e) => {
  // 获取文件切片 fileChunkList，利用 FileReader 读取每个切片的 ArrayBuffer
  const { fileChunkList } = e.data;
  const spark = new self.SparkMD5.ArrayBuffer();
  let percentage = 0;
  let count = 0;
  const loadNext = (index) => {
    const reader = new FileReader();
    reader.readAsArrayBuffer(fileChunkList[index].file);
    reader.onload = (e) => {
      count++;
      spark.append(e.target.result);
      if (count === fileChunkList.length) {
        // 计算完毕，回传 hash 值
        self.postMessage({
          percentage: 100,
          hash: spark.end(),
        });
        self.close();
      } else {
        percentage += 100 / fileChunkList.length;
        self.postMessage({
          // 回传百分比
          percentage,
        });
        // 递归计算下一个切片
        loadNext(count);
      }
    };
  };
  loadNext(0);
};

function TypeOf(obj) {
  return typeof obj !== "object"
    ? typeof obj
    : // @ts-ignore
      Object.prototype.toString().call(obj).slice(8, -1).toLowerCase();
}
