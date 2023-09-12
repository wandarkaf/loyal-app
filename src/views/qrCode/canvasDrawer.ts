import type { IOptions } from './types'
import { getAndroid } from './utils'

export default class canvasDrawer {
  _el: HTMLBodyElement
  _htOption: IOptions

  _elCanvas = document.createElement('canvas')
  _oContext = this._elCanvas.getContext('2d')
  _elImage = document.createElement('img')
  _android = getAndroid()
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
}
