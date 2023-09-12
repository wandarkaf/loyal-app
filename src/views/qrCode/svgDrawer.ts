import type QRCodeModel from './qrCodeModel'
import type { IOptions } from './types'

export default class svgDrawer {
  _el: HTMLBodyElement
  _htOption: IOptions

  constructor(el: HTMLBodyElement, htOption: IOptions) {
    this._el = el
    this._htOption = htOption
  }

  draw(oQRCode: QRCodeModel): void {
    const nCount = oQRCode.getModuleCount()
    const nWidth = this._htOption.width ? `${this._htOption.width}px` : '100%'
    const nHeight = this._htOption.height ? `${this._htOption.height}px` : '100%'

    this.clear()

    function makeSVG(tag: string, attrs: string[]) {
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
