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

import { QRErrorCorrectLevel } from './constants'
import { getAndroid, isSupportCanvas, getTypeNumber } from './utils'

import QRCodeModel from './qrCodeModel'
import svgDrawer from './svgDrawer'
import canvasDrawer from './canvasDrawer'
import tableDrawer from './tableDrawer'

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
  _android = getAndroid()
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
      : isSupportCanvas()
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
    this._oQRCode = new QRCodeModel(getTypeNumber(sText, this.correctLevel), this.correctLevel)
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

export default QRCode
