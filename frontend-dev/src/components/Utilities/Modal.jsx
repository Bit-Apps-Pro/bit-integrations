import { CSSTransition } from 'react-transition-group'
import CloseIcn from '../../Icons/CloseIcn'

export default function Modal({ show, setModal, sm, lg, style, cssTransStyle, className, title, warning, hdrActn, children, subTitle, noPadding }) {
  const handleClickOutside = e => {
    if (e.target.classList.contains('btcd-modal-wrp')) {
      setModal(false)
    }
  }

  return (
    <CSSTransition
      in={show}
      timeout={500}
      classNames="btc-mdl-trn"
      unmountOnExit
      style={cssTransStyle}
    >
      <div
        role="button"
        tabIndex={0}
        onKeyPress={handleClickOutside}
        onClick={handleClickOutside}
        className="btcd-modal-wrp flx"
      >
        <div
          className={`btcd-modal ${sm ? 'btcd-m-sm' : ''} ${lg ? 'btcd-m-lg' : ''} ${className}`}
          style={style}
        >
          <div className={`btcd-modal-content ${noPadding ? 'no-padding' : ''}  `}>
            {hdrActn}
            <button onClick={() => setModal(false)} className="icn-btn btcd-mdl-close" aria-label="modal-close" type="button"><CloseIcn size={16} stroke={3} /></button>
            {title ? <h2 className="btcd-mdl-title flx" style={{ color: warning ? 'red' : '' }}>{title}</h2> : ''}
            <small className="btcd-mdl-subtitle">{subTitle}</small>
            {!sm && <div className="btcd-mdl-div" />}
            {children}
          </div>
        </div>
      </div>
    </CSSTransition>
  )
}
