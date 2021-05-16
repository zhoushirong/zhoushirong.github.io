const { Readable } = require('stream');
const fs = require('fs')
class ReadStream extends Readable {
  constructor(path, options = {}) {
    super(options);
    this.bytesRead = 0;
    this.fd = fs.openSync(path, 'r')

    if (this.start !== undefined) {
      this.pos = this.start;
    }
    if (this.end === undefined) {
      this.end = Infinity;
    }
  }
  _read(n) {
    n = this.pos !== undefined ?
      Math.min(this.end - this.pos + 1, n) :
      Math.min(this.end - this.bytesRead + 1, n);

    if (n <= 0) {
      this.push(null);
      return;
    }

    const buf = Buffer.allocUnsafeSlow(n);

    fs.read(this.fd, buf, 0, n, this.pos, (er, bytesRead, buf) => {
      if (bytesRead > 0) {
        if (this.pos !== undefined) {
          this.pos += bytesRead;
        }

        this.bytesRead += bytesRead;

        if (bytesRead !== buf.length) {
          const dst = Buffer.allocUnsafeSlow(bytesRead);
          buf.copy(dst, 0, 0, bytesRead);
          buf = dst;
        }

        this.push(buf);
      } else {
        this.push(null);
      }
    });
  }
}
module.exports = ReadStream