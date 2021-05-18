const { Readable } = require('stream');
const fs = require('fs')
class MyReadStream extends Readable {
  constructor(path, options = {}) {
    super(options);
    this.pos = 0
    this.fd = fs.openSync(path, 'r') // fs.open 创建文件描述符
  }
  _read(n) {
    if (n <= 0) return this.push(null);

    const buffer = Buffer.allocUnsafeSlow(n);
    /**
     * fd 文件描述符
     * buffer 是一个缓冲区，读取的数据将会写入到这里，默认大小Buffer.alloc(16384)
     * offset 是开始向缓冲区 buffer 写入数据时的偏移量
     * length 是整数，指定要读取的字节数
     * position 是整数，指读取的文件起始位置
     * 
     * bytesRead is how many bytes were read from the file
     * buf 指缓冲区
     */
    fs.read(this.fd, buffer, 0, n, this.pos, (err, bytesRead, buf) => {
      if (bytesRead > 0) {
        this.pos += bytesRead;
        if (bytesRead !== buf.length) {
          const dst = Buffer.allocUnsafeSlow(bytesRead);
          // buffer.copy( target, targetStart, sourceStart, sourceEnd )
          // 从buf中提取 0-bytesRead 位置的数据，拷贝至 dst 0-end 的位置
          buf.copy(dst, 0, 0, bytesRead);
          buf = dst;
        }
        this.push(buf);
      } else {
        // 如果等于0，表示读取结束。
        this.push(null);
      }
    });
  }
}
module.exports = MyReadStream