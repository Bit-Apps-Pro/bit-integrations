import { useState } from 'react'
import ProBadgeIcn from '../../Icons/ProBadgeIcn'
import { __, sprintf } from '../../Utils/i18nwrap'
import Modal from './Modal'
import ProModal, { ProModalBtnGrp } from './ProModal'

export default function ProModalBtn({ title, sub, className, children, warning }) {
  const [show, setShow] = useState(false)

  return (
    <>
      <nav className="top-nav" style={{ marginRight: '15px' }}>
        <button type="button" onClick={() => setShow(true)} className="btn purple btn-md py-2 purple-sh">
          {__('Try Pro', 'bit-integrations')}
        </button>
      </nav>

      <Modal
        sm
        closeIcon
        show={show}
        setModal={() => setShow(false)}
        className={className}
        title={title || 'Upgrade to Pro'}
        warning={warning || false}>
        <div className={`txt-center atn-btns flx flx-center ${className || 'flx-col'}`}>
          <div className={`content p-4 ${!className && 'confirm-content'}`}>
            <ProBadgeIcn size="50" />
            <h3>
              {__('Unlock Premium Features with', 'bit-integrations')}&nbsp;
              <span className="pro-btn">{__('Pro', 'bit-integrations')}</span>
            </h3>
            <p>
              {__(
                'Thanks for using our product! You can explore our Pro plugin with a 7-day trial. Please note that your data will be deleted once the trial ends.',
                'bit-integrations'
              )}
            </p>
            {children}
            <ProModalBtnGrp warning={warning} />
          </div>
        </div>
      </Modal>
    </>
  )
}
