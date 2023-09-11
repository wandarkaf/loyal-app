/**
 * @fileoverview
 * - Using the 'QRCode for Javascript library'
 * - Fixed dataset of 'QRCode for Javascript library' for support full-spec.
 * - this library has no dependencies.
 *
 * @author davidshimjs
 * @see <a href="http://www.d-project.com/" target="_blank">http://www.d-project.com/</a>
 */

//---------------------------------------------------------------------
// QRCode for JavaScript
//
// Copyright (c) 2009 Kazuhiko Arase
//
// URL: http://www.d-project.com/
//
// Licensed under the MIT license:
//   http://www.opensource.org/licenses/mit-license.php
//
// The word "QR Code" is registered trademark of
// DENSO WAVE INCORPORATED
//   http://www.denso-wave.com/qrcode/faqpatent-e.html
//
//---------------------------------------------------------------------
import {
  QRMode,
  QRMaskPattern,
  QRErrorCorrectLevel,
  PATTERN_POSITION_TABLE,
  QRCodeLimitLength,
  RS_BLOCK_TABLE
} from './qrConstants'

function QR8bitByte(data) {
  this.mode = QRMode.MODE_8BIT_BYTE
  this.data = data
  this.parsedData = []

  // Added to support UTF-8 Characters
  for (let i = 0, l = this.data.length; i < l; i++) {
    const byteArray = []
    const code = this.data.charCodeAt(i)

    if (code > 0x10000) {
      byteArray[0] = 0xf0 | ((code & 0x1c0000) >>> 18)
      byteArray[1] = 0x80 | ((code & 0x3f000) >>> 12)
      byteArray[2] = 0x80 | ((code & 0xfc0) >>> 6)
      byteArray[3] = 0x80 | (code & 0x3f)
    } else if (code > 0x800) {
      byteArray[0] = 0xe0 | ((code & 0xf000) >>> 12)
      byteArray[1] = 0x80 | ((code & 0xfc0) >>> 6)
      byteArray[2] = 0x80 | (code & 0x3f)
    } else if (code > 0x80) {
      byteArray[0] = 0xc0 | ((code & 0x7c0) >>> 6)
      byteArray[1] = 0x80 | (code & 0x3f)
    } else {
      byteArray[0] = code
    }

    this.parsedData.push(byteArray)
  }

  this.parsedData = Array.prototype.concat.apply([], this.parsedData)

  if (this.parsedData.length != this.data.length) {
    this.parsedData.unshift(191)
    this.parsedData.unshift(187)
    this.parsedData.unshift(239)
  }
}

QR8bitByte.prototype = {
  getLength: function (buffer) {
    return this.parsedData.length
  },
  write: function (buffer) {
    for (let i = 0, l = this.parsedData.length; i < l; i++) {
      buffer.put(this.parsedData[i], 8)
    }
  }
}

function QRCodeModel(typeNumber, errorCorrectLevel) {
  this.typeNumber = typeNumber
  this.errorCorrectLevel = errorCorrectLevel
  this.modules = null
  this.moduleCount = 0
  this.dataCache = null
  this.dataList = []
}

QRCodeModel.prototype = {
  addData: function (data) {
    let newData = new QR8bitByte(data)
    this.dataList.push(newData)
    this.dataCache = null
  },
  isDark: function (row, col) {
    if (row < 0 || this.moduleCount <= row || col < 0 || this.moduleCount <= col) {
      throw new Error(row + ',' + col)
    }
    return this.modules[row][col]
  },
  getModuleCount: function () {
    return this.moduleCount
  },
  make: function () {
    this.makeImpl(false, this.getBestMaskPattern())
  },
  makeImpl: function (test, maskPattern) {
    this.moduleCount = this.typeNumber * 4 + 17
    this.modules = new Array(this.moduleCount)
    for (let row = 0; row < this.moduleCount; row++) {
      this.modules[row] = new Array(this.moduleCount)
      for (let col = 0; col < this.moduleCount; col++) {
        this.modules[row][col] = null
      }
    }
    this.setupPositionProbePattern(0, 0)
    this.setupPositionProbePattern(this.moduleCount - 7, 0)
    this.setupPositionProbePattern(0, this.moduleCount - 7)
    this.setupPositionAdjustPattern()
    this.setupTimingPattern()
    this.setupTypeInfo(test, maskPattern)
    if (this.typeNumber >= 7) {
      this.setupTypeNumber(test)
    }
    if (this.dataCache == null) {
      this.dataCache = QRCodeModel.createData(
        this.typeNumber,
        this.errorCorrectLevel,
        this.dataList
      )
    }
    this.mapData(this.dataCache, maskPattern)
  },
  setupPositionProbePattern: function (row, col) {
    for (let r = -1; r <= 7; r++) {
      if (row + r <= -1 || this.moduleCount <= row + r) continue
      for (let c = -1; c <= 7; c++) {
        if (col + c <= -1 || this.moduleCount <= col + c) continue
        if (
          (0 <= r && r <= 6 && (c == 0 || c == 6)) ||
          (0 <= c && c <= 6 && (r == 0 || r == 6)) ||
          (2 <= r && r <= 4 && 2 <= c && c <= 4)
        ) {
          this.modules[row + r][col + c] = true
        } else {
          this.modules[row + r][col + c] = false
        }
      }
    }
  },
  getBestMaskPattern: function () {
    let minLostPoint = 0
    let pattern = 0
    for (let i = 0; i < 8; i++) {
      this.makeImpl(true, i)
      const lostPoint = QRUtil.getLostPoint(this)
      if (i == 0 || minLostPoint > lostPoint) {
        minLostPoint = lostPoint
        pattern = i
      }
    }
    return pattern
  },
  createMovieClip: function (target_mc, instance_name, depth) {
    const qr_mc = target_mc.createEmptyMovieClip(instance_name, depth)
    const cs = 1
    this.make()
    for (let row = 0; row < this.modules.length; row++) {
      const y = row * cs
      for (let col = 0; col < this.modules[row].length; col++) {
        const x = col * cs
        const dark = this.modules[row][col]
        if (dark) {
          qr_mc.beginFill(0, 100)
          qr_mc.moveTo(x, y)
          qr_mc.lineTo(x + cs, y)
          qr_mc.lineTo(x + cs, y + cs)
          qr_mc.lineTo(x, y + cs)
          qr_mc.endFill()
        }
      }
    }
    return qr_mc
  },
  setupTimingPattern: function () {
    for (let r = 8; r < this.moduleCount - 8; r++) {
      if (this.modules[r][6] != null) {
        continue
      }
      this.modules[r][6] = r % 2 == 0
    }
    for (let c = 8; c < this.moduleCount - 8; c++) {
      if (this.modules[6][c] != null) {
        continue
      }
      this.modules[6][c] = c % 2 == 0
    }
  },
  setupPositionAdjustPattern: function () {
    const pos = QRUtil.getPatternPosition(this.typeNumber)
    for (let i = 0; i < pos.length; i++) {
      for (let j = 0; j < pos.length; j++) {
        const row = pos[i]
        const col = pos[j]
        if (this.modules[row][col] != null) {
          continue
        }
        for (let r = -2; r <= 2; r++) {
          for (let c = -2; c <= 2; c++) {
            if (r == -2 || r == 2 || c == -2 || c == 2 || (r == 0 && c == 0)) {
              this.modules[row + r][col + c] = true
            } else {
              this.modules[row + r][col + c] = false
            }
          }
        }
      }
    }
  },
  setupTypeNumber: function (test) {
    const bits = QRUtil.getBCHTypeNumber(this.typeNumber)
    for (let i = 0; i < 18; i++) {
      const mod = !test && ((bits >> i) & 1) == 1
      this.modules[Math.floor(i / 3)][(i % 3) + this.moduleCount - 8 - 3] = mod
    }
    for (let i = 0; i < 18; i++) {
      const mod = !test && ((bits >> i) & 1) == 1
      this.modules[(i % 3) + this.moduleCount - 8 - 3][Math.floor(i / 3)] = mod
    }
  },
  setupTypeInfo: function (test, maskPattern) {
    const data = (this.errorCorrectLevel << 3) | maskPattern
    const bits = QRUtil.getBCHTypeInfo(data)
    for (let i = 0; i < 15; i++) {
      const mod = !test && ((bits >> i) & 1) == 1
      if (i < 6) {
        this.modules[i][8] = mod
      } else if (i < 8) {
        this.modules[i + 1][8] = mod
      } else {
        this.modules[this.moduleCount - 15 + i][8] = mod
      }
    }
    for (let i = 0; i < 15; i++) {
      const mod = !test && ((bits >> i) & 1) == 1
      if (i < 8) {
        this.modules[8][this.moduleCount - i - 1] = mod
      } else if (i < 9) {
        this.modules[8][15 - i - 1 + 1] = mod
      } else {
        this.modules[8][15 - i - 1] = mod
      }
    }
    this.modules[this.moduleCount - 8][8] = !test
  },
  mapData: function (data, maskPattern) {
    let inc = -1
    let row = this.moduleCount - 1
    let bitIndex = 7
    let byteIndex = 0
    for (let col = this.moduleCount - 1; col > 0; col -= 2) {
      if (col == 6) col--
      while (true) {
        for (let c = 0; c < 2; c++) {
          if (this.modules[row][col - c] == null) {
            let dark = false
            if (byteIndex < data.length) {
              dark = ((data[byteIndex] >>> bitIndex) & 1) == 1
            }
            const mask = QRUtil.getMask(maskPattern, row, col - c)
            if (mask) {
              dark = !dark
            }
            this.modules[row][col - c] = dark
            bitIndex--
            if (bitIndex == -1) {
              byteIndex++
              bitIndex = 7
            }
          }
        }
        row += inc
        if (row < 0 || this.moduleCount <= row) {
          row -= inc
          inc = -inc
          break
        }
      }
    }
  }
}
QRCodeModel.PAD0 = 0xec
QRCodeModel.PAD1 = 0x11
QRCodeModel.createData = function (typeNumber, errorCorrectLevel, dataList) {
  const rsBlocks = QRRSBlock.getRSBlocks(typeNumber, errorCorrectLevel)
  const buffer = new QRBitBuffer()
  for (let i = 0; i < dataList.length; i++) {
    const data = dataList[i]
    buffer.put(data.mode, 4)
    buffer.put(data.getLength(), QRUtil.getLengthInBits(data.mode, typeNumber))
    data.write(buffer)
  }
  let totalDataCount = 0
  for (let i = 0; i < rsBlocks.length; i++) {
    totalDataCount += rsBlocks[i].dataCount
  }
  if (buffer.getLengthInBits() > totalDataCount * 8) {
    throw new Error(
      'code length overflow. (' + buffer.getLengthInBits() + '>' + totalDataCount * 8 + ')'
    )
  }
  if (buffer.getLengthInBits() + 4 <= totalDataCount * 8) {
    buffer.put(0, 4)
  }
  while (buffer.getLengthInBits() % 8 != 0) {
    buffer.putBit(false)
  }
  while (true) {
    if (buffer.getLengthInBits() >= totalDataCount * 8) {
      break
    }
    buffer.put(QRCodeModel.PAD0, 8)
    if (buffer.getLengthInBits() >= totalDataCount * 8) {
      break
    }
    buffer.put(QRCodeModel.PAD1, 8)
  }
  return QRCodeModel.createBytes(buffer, rsBlocks)
}
QRCodeModel.createBytes = function (buffer, rsBlocks) {
  let offset = 0
  let maxDcCount = 0
  let maxEcCount = 0
  const dcdata = new Array(rsBlocks.length)
  const ecdata = new Array(rsBlocks.length)
  for (let r = 0; r < rsBlocks.length; r++) {
    const dcCount = rsBlocks[r].dataCount
    const ecCount = rsBlocks[r].totalCount - dcCount
    maxDcCount = Math.max(maxDcCount, dcCount)
    maxEcCount = Math.max(maxEcCount, ecCount)
    dcdata[r] = new Array(dcCount)
    for (let i = 0; i < dcdata[r].length; i++) {
      dcdata[r][i] = 0xff & buffer.buffer[i + offset]
    }
    offset += dcCount
    const rsPoly = QRUtil.getErrorCorrectPolynomial(ecCount)
    const rawPoly = new QRPolynomial(dcdata[r], rsPoly.getLength() - 1)
    const modPoly = rawPoly.mod(rsPoly)
    ecdata[r] = new Array(rsPoly.getLength() - 1)
    for (let i = 0; i < ecdata[r].length; i++) {
      const modIndex = i + modPoly.getLength() - ecdata[r].length
      ecdata[r][i] = modIndex >= 0 ? modPoly.get(modIndex) : 0
    }
  }
  let totalCodeCount = 0
  for (let i = 0; i < rsBlocks.length; i++) {
    totalCodeCount += rsBlocks[i].totalCount
  }
  const data = new Array(totalCodeCount)
  let index = 0
  for (let i = 0; i < maxDcCount; i++) {
    for (let r = 0; r < rsBlocks.length; r++) {
      if (i < dcdata[r].length) {
        data[index++] = dcdata[r][i]
      }
    }
  }
  for (let i = 0; i < maxEcCount; i++) {
    for (let r = 0; r < rsBlocks.length; r++) {
      if (i < ecdata[r].length) {
        data[index++] = ecdata[r][i]
      }
    }
  }
  return data
}

const QRUtil = {
  PATTERN_POSITION_TABLE,
  G15: (1 << 10) | (1 << 8) | (1 << 5) | (1 << 4) | (1 << 2) | (1 << 1) | (1 << 0),
  G18: (1 << 12) | (1 << 11) | (1 << 10) | (1 << 9) | (1 << 8) | (1 << 5) | (1 << 2) | (1 << 0),
  G15_MASK: (1 << 14) | (1 << 12) | (1 << 10) | (1 << 4) | (1 << 1),
  getBCHTypeInfo: function (data) {
    let d = data << 10
    while (QRUtil.getBCHDigit(d) - QRUtil.getBCHDigit(QRUtil.G15) >= 0) {
      d ^= QRUtil.G15 << (QRUtil.getBCHDigit(d) - QRUtil.getBCHDigit(QRUtil.G15))
    }
    return ((data << 10) | d) ^ QRUtil.G15_MASK
  },
  getBCHTypeNumber: function (data) {
    let d = data << 12
    while (QRUtil.getBCHDigit(d) - QRUtil.getBCHDigit(QRUtil.G18) >= 0) {
      d ^= QRUtil.G18 << (QRUtil.getBCHDigit(d) - QRUtil.getBCHDigit(QRUtil.G18))
    }
    return (data << 12) | d
  },
  getBCHDigit: function (data) {
    let digit = 0
    while (data != 0) {
      digit++
      data >>>= 1
    }
    return digit
  },
  getPatternPosition: function (typeNumber) {
    return QRUtil.PATTERN_POSITION_TABLE[typeNumber - 1]
  },
  getMask: function (maskPattern, i, j) {
    switch (maskPattern) {
      case QRMaskPattern.PATTERN000:
        return (i + j) % 2 == 0
      case QRMaskPattern.PATTERN001:
        return i % 2 == 0
      case QRMaskPattern.PATTERN010:
        return j % 3 == 0
      case QRMaskPattern.PATTERN011:
        return (i + j) % 3 == 0
      case QRMaskPattern.PATTERN100:
        return (Math.floor(i / 2) + Math.floor(j / 3)) % 2 == 0
      case QRMaskPattern.PATTERN101:
        return ((i * j) % 2) + ((i * j) % 3) == 0
      case QRMaskPattern.PATTERN110:
        return (((i * j) % 2) + ((i * j) % 3)) % 2 == 0
      case QRMaskPattern.PATTERN111:
        return (((i * j) % 3) + ((i + j) % 2)) % 2 == 0
      default:
        throw new Error('bad maskPattern:' + maskPattern)
    }
  },
  getErrorCorrectPolynomial: function (errorCorrectLength) {
    let a = new QRPolynomial([1], 0)
    for (let i = 0; i < errorCorrectLength; i++) {
      a = a.multiply(new QRPolynomial([1, QRMath.gexp(i)], 0))
    }
    return a
  },
  getLengthInBits: function (mode, type) {
    if (1 <= type && type < 10) {
      switch (mode) {
        case QRMode.MODE_NUMBER:
          return 10
        case QRMode.MODE_ALPHA_NUM:
          return 9
        case QRMode.MODE_8BIT_BYTE:
          return 8
        case QRMode.MODE_KANJI:
          return 8
        default:
          throw new Error('mode:' + mode)
      }
    } else if (type < 27) {
      switch (mode) {
        case QRMode.MODE_NUMBER:
          return 12
        case QRMode.MODE_ALPHA_NUM:
          return 11
        case QRMode.MODE_8BIT_BYTE:
          return 16
        case QRMode.MODE_KANJI:
          return 10
        default:
          throw new Error('mode:' + mode)
      }
    } else if (type < 41) {
      switch (mode) {
        case QRMode.MODE_NUMBER:
          return 14
        case QRMode.MODE_ALPHA_NUM:
          return 13
        case QRMode.MODE_8BIT_BYTE:
          return 16
        case QRMode.MODE_KANJI:
          return 12
        default:
          throw new Error('mode:' + mode)
      }
    } else {
      throw new Error('type:' + type)
    }
  },
  getLostPoint: function (qrCode) {
    const moduleCount = qrCode.getModuleCount()
    let lostPoint = 0
    for (let row = 0; row < moduleCount; row++) {
      for (let col = 0; col < moduleCount; col++) {
        let sameCount = 0
        const dark = qrCode.isDark(row, col)
        for (let r = -1; r <= 1; r++) {
          if (row + r < 0 || moduleCount <= row + r) {
            continue
          }
          for (let c = -1; c <= 1; c++) {
            if (col + c < 0 || moduleCount <= col + c) {
              continue
            }
            if (r == 0 && c == 0) {
              continue
            }
            if (dark == qrCode.isDark(row + r, col + c)) {
              sameCount++
            }
          }
        }
        if (sameCount > 5) {
          lostPoint += 3 + sameCount - 5
        }
      }
    }
    for (let row = 0; row < moduleCount - 1; row++) {
      for (let col = 0; col < moduleCount - 1; col++) {
        let count = 0
        if (qrCode.isDark(row, col)) count++
        if (qrCode.isDark(row + 1, col)) count++
        if (qrCode.isDark(row, col + 1)) count++
        if (qrCode.isDark(row + 1, col + 1)) count++
        if (count == 0 || count == 4) {
          lostPoint += 3
        }
      }
    }
    for (let row = 0; row < moduleCount; row++) {
      for (let col = 0; col < moduleCount - 6; col++) {
        if (
          qrCode.isDark(row, col) &&
          !qrCode.isDark(row, col + 1) &&
          qrCode.isDark(row, col + 2) &&
          qrCode.isDark(row, col + 3) &&
          qrCode.isDark(row, col + 4) &&
          !qrCode.isDark(row, col + 5) &&
          qrCode.isDark(row, col + 6)
        ) {
          lostPoint += 40
        }
      }
    }
    for (let col = 0; col < moduleCount; col++) {
      for (let row = 0; row < moduleCount - 6; row++) {
        if (
          qrCode.isDark(row, col) &&
          !qrCode.isDark(row + 1, col) &&
          qrCode.isDark(row + 2, col) &&
          qrCode.isDark(row + 3, col) &&
          qrCode.isDark(row + 4, col) &&
          !qrCode.isDark(row + 5, col) &&
          qrCode.isDark(row + 6, col)
        ) {
          lostPoint += 40
        }
      }
    }
    let darkCount = 0
    for (let col = 0; col < moduleCount; col++) {
      for (let row = 0; row < moduleCount; row++) {
        if (qrCode.isDark(row, col)) {
          darkCount++
        }
      }
    }
    const ratio = Math.abs((100 * darkCount) / moduleCount / moduleCount - 50) / 5
    lostPoint += ratio * 10
    return lostPoint
  }
}
const QRMath = {
  glog: function (n: number) {
    if (n < 1) {
      throw new Error('glog(' + n + ')')
    }
    return QRMath.LOG_TABLE[n]
  },
  gexp: function (n: number) {
    while (n < 0) {
      n += 255
    }
    while (n >= 256) {
      n -= 255
    }
    return QRMath.EXP_TABLE[n]
  },
  EXP_TABLE: new Array(256),
  LOG_TABLE: new Array(256)
}
for (let i = 0; i < 8; i++) {
  QRMath.EXP_TABLE[i] = 1 << i
}
for (let i = 8; i < 256; i++) {
  QRMath.EXP_TABLE[i] =
    QRMath.EXP_TABLE[i - 4] ^
    QRMath.EXP_TABLE[i - 5] ^
    QRMath.EXP_TABLE[i - 6] ^
    QRMath.EXP_TABLE[i - 8]
}
for (let i = 0; i < 255; i++) {
  QRMath.LOG_TABLE[QRMath.EXP_TABLE[i]] = i
}
function QRPolynomial(num, shift) {
  if (num.length == undefined) {
    throw new Error(num.length + '/' + shift)
  }
  let offset = 0
  while (offset < num.length && num[offset] == 0) {
    offset++
  }
  this.num = new Array(num.length - offset + shift)
  for (let i = 0; i < num.length - offset; i++) {
    this.num[i] = num[i + offset]
  }
}
QRPolynomial.prototype = {
  get: function (index) {
    return this.num[index]
  },
  getLength: function () {
    return this.num.length
  },
  multiply: function (e) {
    const num = new Array(this.getLength() + e.getLength() - 1)
    for (let i = 0; i < this.getLength(); i++) {
      for (let j = 0; j < e.getLength(); j++) {
        num[i + j] ^= QRMath.gexp(QRMath.glog(this.get(i)) + QRMath.glog(e.get(j)))
      }
    }
    return new QRPolynomial(num, 0)
  },
  mod: function (e) {
    if (this.getLength() - e.getLength() < 0) {
      return this
    }
    const ratio = QRMath.glog(this.get(0)) - QRMath.glog(e.get(0))
    const num = new Array(this.getLength())
    for (let i = 0; i < this.getLength(); i++) {
      num[i] = this.get(i)
    }
    for (let i = 0; i < e.getLength(); i++) {
      num[i] ^= QRMath.gexp(QRMath.glog(e.get(i)) + ratio)
    }
    return new QRPolynomial(num, 0).mod(e)
  }
}
function QRRSBlock(totalCount, dataCount) {
  this.totalCount = totalCount
  this.dataCount = dataCount
}
QRRSBlock.RS_BLOCK_TABLE = RS_BLOCK_TABLE
QRRSBlock.getRSBlocks = function (typeNumber, errorCorrectLevel) {
  const rsBlock = QRRSBlock.getRsBlockTable(typeNumber, errorCorrectLevel)
  if (rsBlock == undefined) {
    throw new Error(
      'bad rs block @ typeNumber:' + typeNumber + '/errorCorrectLevel:' + errorCorrectLevel
    )
  }
  const length = rsBlock.length / 3
  const list = []
  for (let i = 0; i < length; i++) {
    const count = rsBlock[i * 3 + 0]
    const totalCount = rsBlock[i * 3 + 1]
    const dataCount = rsBlock[i * 3 + 2]
    for (let j = 0; j < count; j++) {
      list.push(new QRRSBlock(totalCount, dataCount))
    }
  }
  return list
}
QRRSBlock.getRsBlockTable = function (typeNumber, errorCorrectLevel) {
  switch (errorCorrectLevel) {
    case QRErrorCorrectLevel.L:
      return QRRSBlock.RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 0]
    case QRErrorCorrectLevel.M:
      return QRRSBlock.RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 1]
    case QRErrorCorrectLevel.Q:
      return QRRSBlock.RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 2]
    case QRErrorCorrectLevel.H:
      return QRRSBlock.RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 3]
    default:
      return undefined
  }
}
function QRBitBuffer() {
  this.buffer = []
  this.length = 0
}
QRBitBuffer.prototype = {
  get: function (index) {
    const bufIndex = Math.floor(index / 8)
    return ((this.buffer[bufIndex] >>> (7 - (index % 8))) & 1) == 1
  },
  put: function (num, length) {
    for (let i = 0; i < length; i++) {
      this.putBit(((num >>> (length - i - 1)) & 1) == 1)
    }
  },
  getLengthInBits: function () {
    return this.length
  },
  putBit: function (bit) {
    const bufIndex = Math.floor(this.length / 8)
    if (this.buffer.length <= bufIndex) {
      this.buffer.push(0)
    }
    if (bit) {
      this.buffer[bufIndex] |= 0x80 >>> this.length % 8
    }
    this.length++
  }
}

function _isSupportCanvas(): boolean {
  return typeof CanvasRenderingContext2D != 'undefined'
}

// android 2.x doesn't support Data-URI spec
function _getAndroid(): number {
  let android = 0
  const sAgent = navigator.userAgent

  if (/android/i.test(sAgent)) {
    // android
    const aMat = sAgent.toString().match(/android ([0-9]\.[0-9])/i)

    if (aMat && aMat[1]) {
      android = parseFloat(aMat[1])
    }
  }

  return android
}

interface IOptions {
  width?: number
  height?: number
  typeNumber?: number
  colorDark?: string
  colorLight?: string
  correctLevel?: number
}

class svgDrawer {
  _el: HTMLBodyElement
  _htOption: IOptions

  constructor(el: HTMLBodyElement, htOption: IOptions) {
    this._el = el
    this._htOption = htOption
  }

  draw(oQRCode): void {
    const nCount = oQRCode.getModuleCount()
    const nWidth = this._htOption.width ? `${this._htOption.width}px` : '100%'
    const nHeight = this._htOption.height ? `${this._htOption.height}px` : '100%'

    this.clear()

    function makeSVG(tag, attrs) {
      const el = document.createElementNS('http://www.w3.org/2000/svg', tag)
      for (const k in attrs) if (attrs.hasOwnProperty(k)) el.setAttribute(k, attrs[k])
      return el
    }

    const svg = makeSVG('svg', {
      viewBox: '0 0 ' + String(nCount) + ' ' + String(nCount),
      width: nWidth,
      height: nHeight,
      fill: this._htOption.colorLight
    })
    svg.setAttributeNS(
      'http://www.w3.org/2000/xmlns/',
      'xmlns:xlink',
      'http://www.w3.org/1999/xlink'
    )
    this._el.appendChild(svg)

    svg.appendChild(
      makeSVG('rect', { fill: this._htOption.colorLight, width: '100%', height: '100%' })
    )
    svg.appendChild(
      makeSVG('rect', { fill: this._htOption.colorDark, width: '1', height: '1', id: 'template' })
    )

    for (let row = 0; row < nCount; row++) {
      for (let col = 0; col < nCount; col++) {
        if (oQRCode.isDark(row, col)) {
          const child = makeSVG('use', { x: String(col), y: String(row) })
          child.setAttributeNS('http://www.w3.org/1999/xlink', 'href', '#template')
          svg.appendChild(child)
        }
      }
    }
  }

  clear(): void {
    while (this._el.hasChildNodes()) this._el.removeChild(this._el.lastChild)
  }
}

class canvasDrawer {
  _el: HTMLBodyElement
  _htOption: IOptions

  _elCanvas = document.createElement('canvas')
  _oContext = this._elCanvas.getContext('2d')
  _elImage = document.createElement('img')
  _android = _getAndroid()
  _bIsPainted = false
  _bSupportDataURI = null

  constructor(el: HTMLBodyElement, htOption: IOptions) {
    this._htOption = htOption
    this._elCanvas.width = htOption.width || 256
    this._elCanvas.height = htOption.height || 256
    el.appendChild(this._elCanvas)
    this._el = el

    this._elImage.alt = 'Scan me!'
    this._elImage.style.display = 'none'
    this._el.appendChild(this._elImage)
  }

  _onMakeImage(): void {
    this._elImage.src = this._elCanvas.toDataURL('image/png')
    this._elImage.style.display = 'block'
    this._elCanvas.style.display = 'none'
  }
  _safeSetDataURI(fSuccess, fFail): void {
    const self = this
    self._fFail = fFail
    self._fSuccess = fSuccess

    // Check it just once
    if (self._bSupportDataURI === null) {
      const el = document.createElement('img')
      const fOnError = function () {
        self._bSupportDataURI = false

        if (self._fFail) {
          self._fFail.call(self)
        }
      }
      let fOnSuccess = function () {
        self._bSupportDataURI = true

        if (self._fSuccess) {
          self._fSuccess.call(self)
        }
      }

      el.onabort = fOnError
      el.onerror = fOnError
      el.onload = fOnSuccess
      el.src =
        'data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==' // the Image contains 1px data.
      return
    } else if (self._bSupportDataURI === true && self._fSuccess) {
      self._fSuccess.call(self)
    } else if (self._bSupportDataURI === false && self._fFail) {
      self._fFail.call(self)
    }
  }

  draw(oQRCode): void {
    const _elImage = this._elImage
    const _oContext = this._oContext
    const _htOption = this._htOption

    const nCount = oQRCode.getModuleCount()
    const nWidth = _htOption.width / nCount
    const nHeight = _htOption.height / nCount
    const nRoundedWidth = Math.round(nWidth)
    const nRoundedHeight = Math.round(nHeight)

    _elImage.style.display = 'none'
    this.clear()

    for (let row = 0; row < nCount; row++) {
      for (let col = 0; col < nCount; col++) {
        const bIsDark = oQRCode.isDark(row, col)
        const nLeft = col * nWidth
        const nTop = row * nHeight
        if (_oContext !== null) {
          _oContext.strokeStyle = bIsDark ? _htOption.colorDark : _htOption.colorLight
          _oContext.lineWidth = 1
          _oContext.fillStyle = bIsDark ? _htOption.colorDark : _htOption.colorLight
          _oContext.fillRect(nLeft, nTop, nWidth, nHeight)

          _oContext.strokeRect(
            Math.floor(nLeft) + 0.5,
            Math.floor(nTop) + 0.5,
            nRoundedWidth,
            nRoundedHeight
          )

          _oContext.strokeRect(
            Math.ceil(nLeft) - 0.5,
            Math.ceil(nTop) - 0.5,
            nRoundedWidth,
            nRoundedHeight
          )
        }
      }
    }

    this._bIsPainted = true
  }

  makeImage(): void {
    if (this._bIsPainted) {
      this._safeSetDataURI.call(this, this._onMakeImage, () => {})
    }
  }

  isPainted(): boolean {
    return this._bIsPainted
  }

  clear(): void {
    if (this._oContext) {
      this._oContext.clearRect(0, 0, this._elCanvas.width, this._elCanvas.height)
      this._bIsPainted = false
    }
  }

  round(nNumber: number): number {
    if (!nNumber) {
      return nNumber
    }

    return Math.floor(nNumber * 1000) / 1000
  }

  // Android 2.1 bug workaround
  // http://code.google.com/p/android/issues/detail?id=5141
  // if (this._android && this._android <= 2.1) {
  // 	let factor = 1 / window.devicePixelRatio;
  //     let drawImage = CanvasRenderingContext2D.prototype.drawImage;
  // 	CanvasRenderingContext2D.prototype.drawImage = function (image, sx, sy, sw, sh, dx, dy, dw, dh) {
  // 		if (("nodeName" in image) && /img/i.test(image.nodeName)) {
  //         	for (let i = arguments.length - 1; i >= 1; i--) {
  //             	arguments[i] = arguments[i] * factor;
  //         	}
  // 		} else if (typeof dw == "undefined") {
  // 			arguments[1] *= factor;
  // 			arguments[2] *= factor;
  // 			arguments[3] *= factor;
  // 			arguments[4] *= factor;
  // 		}

  //     	drawImage.apply(this, arguments);
  // 	};
  // }
}

class tableDrawer {
  _el: HTMLBodyElement
  _htOption: IOptions

  constructor(el: HTMLBodyElement, htOption: IOptions) {
    this._el = el
    this._htOption = htOption
  }

  draw(oQRCode): void {
    const nCount = oQRCode.getModuleCount()
    const nWidth = Math.floor(this._htOption.width / nCount)
    const nHeight = Math.floor(this._htOption.height / nCount)
    const aHTML = ['<table style="border:0;border-collapse:collapse;">']

    for (let row = 0; row < nCount; row++) {
      aHTML.push('<tr>')

      for (let col = 0; col < nCount; col++) {
        aHTML.push(
          '<td style="border:0;border-collapse:collapse;padding:0;margin:0;width:' +
            nWidth +
            'px;height:' +
            nHeight +
            'px;background-color:' +
            (oQRCode.isDark(row, col) ? this._htOption.colorDark : this._htOption.colorLight) +
            ';"></td>'
        )
      }

      aHTML.push('</tr>')
    }

    aHTML.push('</table>')
    this._el.innerHTML = aHTML.join('')

    // Fix the margin values as real size.
    const elTable = this._el.childNodes[0]
    const nLeftMarginTable = (this._htOption.width - elTable.offsetWidth) / 2
    const nTopMarginTable = (this._htOption.height - elTable.offsetHeight) / 2

    if (nLeftMarginTable > 0 && nTopMarginTable > 0) {
      elTable.style.margin = nTopMarginTable + 'px ' + nLeftMarginTable + 'px'
    }
  }

  clear(): void {
    this._el.innerHTML = ''
  }
}

/**
 * Get the type by string length
 *
 * @private
 * @param {String} sText
 * @param {Number} nCorrectLevel
 * @return {Number} type
 */
function _getTypeNumber(sText: string, nCorrectLevel: number): number {
  let nType = 1
  const length = _getUTF8Length(sText)

  for (let i = 0, len = QRCodeLimitLength.length; i <= len; i++) {
    let nLimit = 0

    switch (nCorrectLevel) {
      case QRErrorCorrectLevel.L:
        nLimit = QRCodeLimitLength[i][0]
        break
      case QRErrorCorrectLevel.M:
        nLimit = QRCodeLimitLength[i][1]
        break
      case QRErrorCorrectLevel.Q:
        nLimit = QRCodeLimitLength[i][2]
        break
      case QRErrorCorrectLevel.H:
        nLimit = QRCodeLimitLength[i][3]
        break
    }

    if (length <= nLimit) {
      break
    } else {
      nType++
    }
  }

  if (nType > QRCodeLimitLength.length) {
    throw new Error('Too long data')
  }

  return nType
}

function _getUTF8Length(sText: string) {
  const replacedText = encodeURI(sText)
    .toString()
    .replace(/%[0-9a-fA-F]{2}/g, 'a')
  return replacedText.length + (replacedText.length != sText.length ? 3 : 0)
}

/**
 * @class QRCode
 * @constructor
 * @example
 * new QRCode(document.getElementById("test"), "http://jindo.dev.naver.com/collie");
 *
 * @example
 * let oQRCode = new QRCode("test", {
 *    text : "http://naver.com",
 *    width : 128,
 *    height : 128
 * });
 *
 * oQRCode.clear(); // Clear the QRCode.
 * oQRCode.makeCode("http://map.naver.com"); // Re-create the QRCode.
 *
 * @param {HTMLElement|String} el target element or 'id' attribute of element.
 * @param {Object|String} vOption
 * @param {String} vOption.text QRCode link data
 * @param {Number} [vOption.width=256]
 * @param {Number} [vOption.height=256]
 * @param {String} [vOption.colorDark="#000000"]
 * @param {String} [vOption.colorLight="#ffffff"]
 * @param {QRCode.CorrectLevel} [vOption.correctLevel=QRCode.CorrectLevel.H] [L|M|Q|H]
 */
class QRCode {
  text: string
  width: number
  height: number
  typeNumber: number
  colorDark: string
  colorLight: string
  correctLevel: number
  useSVG: boolean
  _el: HTMLBodyElement
  _oQRCode: any
  _oDrawing: any
  _android = _getAndroid()
  CorrectLevel = QRErrorCorrectLevel

  constructor(
    el: HTMLBodyElement,
    vOption: {
      text: string
      width?: number
      height?: number
      colorDark?: string
      colorLight?: string
      correctLevel?: number
      //   useSVG?: boolean
    }
  ) {
    this.text = vOption.text || ''
    this.width = vOption.width || 256
    this.height = vOption.height || 256
    this.typeNumber = 4
    this.colorDark = vOption.colorDark || '#000000'
    this.colorLight = vOption.colorLight || '#ffffff'
    this.correctLevel = vOption.correctLevel || QRErrorCorrectLevel.H
    this.useSVG = document.documentElement.tagName.toLowerCase() === 'svg'

    this._el = el
    this._oQRCode = null
    this._oDrawing = this.useSVG
      ? new svgDrawer(this._el, {
          width: this.width,
          height: this.height,
          typeNumber: this.typeNumber,
          colorDark: this.colorDark,
          colorLight: this.colorLight,
          correctLevel: this.correctLevel
        })
      : _isSupportCanvas()
      ? new canvasDrawer(this._el, {
          width: this.width,
          height: this.height,
          typeNumber: this.typeNumber,
          colorDark: this.colorDark,
          colorLight: this.colorLight,
          correctLevel: this.correctLevel
        })
      : new tableDrawer(this._el, {
          width: this.width,
          height: this.height,
          typeNumber: this.typeNumber,
          colorDark: this.colorDark,
          colorLight: this.colorLight,
          correctLevel: this.correctLevel
        })

    if (this.text) {
      this.makeCode(this.text)
    }
  }

  makeCode(sText: string): void {
    this._oQRCode = new QRCodeModel(_getTypeNumber(sText, this.correctLevel), this.correctLevel)
    this._oQRCode.addData(sText)
    this._oQRCode.make()
    this._el.title = sText
    this._oDrawing.draw(this._oQRCode)
    this.makeImage()
  }

  makeImage(): void {
    if (typeof this._oDrawing.makeImage == 'function' && (!this._android || this._android >= 3)) {
      this._oDrawing.makeImage()
    }
  }

  clear(): void {
    this._oDrawing.clear()
  }
}

// 	if (typeof vOption === 'string') {
// 		vOption	= {
// 			text : vOption
// 		};
// 	}

// 	if (typeof el == "string") {
// 		el = document.getElementById(el);
// 	}

// };

export default QRCode
