/* eslint-disable no-unused-expressions */
import toast from 'react-hot-toast'
import CopyIcn from '../../Icons/CopyIcn'
import { __ } from '../../Utils/i18nwrap'

export default function CopyText({ value, setSnackbar, toastShow, className, readOnly }) {
  const copyText = e => {
    const cpyBtn = e.target
    cpyBtn.setAttribute('style', '--tooltip-txt: "Copied"')
    setSnackbar && setSnackbar({ show: true, msg: __('Copied on Clipboard.', 'bit-integrations') })
    const text = e.target.parentNode.children[0]
    text.select()
    text.setSelectionRange(0, 99999)
    document.execCommand('copy')
    toastShow && toast.success(__('Copied on Clipboard.'))
    setTimeout(() => {
      cpyBtn.setAttribute('style', '--tooltip-txt: "Copy"')
    }, 2000)
  }

  return (
    <div className={className}>
      <label htmlFor={value} className="flx">
        <input id="copy-input-fld" className={`w-10 ${readOnly && 'readonly'}`} value={value} readOnly />
        <button
          onClick={copyText}
          className="tooltip"
          style={{ '--tooltip-txt': '"Copy"' }}
          aria-label="Copy"
          type="button">
          <CopyIcn size="14" />
        </button>
      </label>
    </div>
  )
}
