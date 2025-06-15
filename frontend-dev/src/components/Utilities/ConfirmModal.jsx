import { __ } from '../../Utils/i18nwrap'
import Modal from './Modal'

function ConfirmModal({ close, action, mainMdlCls, style, cssTransStyle, show, btnTxt, body, btn2Txt, btn2Action, btnClass, title, className, children, warning }) {
  return (
    <Modal
      sm
      show={show}
      setModal={close}
      className={mainMdlCls}
      title={title || 'Confirmation'}
      warning={warning || false}
      style={style}
      cssTransStyle={cssTransStyle}
    >
      <div className={`txt-center atn-btns flx flx-center ${className || 'flx-col'}`}>
        <div className={`content ${!className && 'confirm-content'}`}>
          {body}
          {children}
        </div>
        <div className={`txt-center ${warning && 'mt-3'}`}>
          {!btn2Txt && <button onClick={close} className={`btn btcd-btn-o-white purple w-4 mr-2 br-50 ${!className && 'btn-lg'}`} type="button">{__('Cancel', 'bit-integrations')}</button>}
          {btn2Txt && <button onClick={btn2Action} className={`btn purple w-4 mr-2 br-50 ${!className && 'btn-lg'}`} type="button">{btn2Txt}</button>}
          <button onClick={action} className={`btn ${btnClass || 'red'} w-4 br-50 ${!className && 'btn-lg'}`} type="button">{btnTxt}</button>
        </div>
      </div>
    </Modal>

  )
}

export default ConfirmModal
