import { useState } from 'react'
import ProBadgeIcn from '../../Icons/ProBadgeIcn'
import { __, sprintf } from '../../Utils/i18nwrap'
import Modal from './Modal'
import ProModal from './ProModal'

export default function ProModalBtn({ title, sub, className, children, warning }) {
  const [show, setShow] = useState(false)

  return (
    <>
      <nav className="top-nav" style={{ marginRight: '15px' }}>
        <button
          type="button"
          onClick={() => setShow(true)}
          className="btn purple btn-md py-2 purple-sh">
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
            <h3>{__('Unlock Premium Features with Our Pro Plugin', 'bit-integrations')}</h3>
            <p>
              {__(
                'Thanks for using our product! You can explore our Pro plugin with a 7-day trial. Please note that your data will be deleted once the trial ends.',
                'bit-integrations'
              )}
            </p>
            {children}
            <div className={`d-flx flx-center ${warning && 'mt-3'}`}>
              <a
                href="https://towp.io"
                target="_blank"
                className="btn btcd-btn-o-gray gray gray-sh w-4 mr-2 br-50 btn-lg "
                rel="noreferrer">
                {__('Try Pro', 'bit-integrations')}
              </a>
              <a
                // href="https://bitapps.pro/bit-integrations/#pricing"
                href="https://bitapps.pro/wordpress-black-friday-discounts/"
                target="_blank"
                className="btn btcd-btn-o-white purple w-4 mr-2 br-50 btn-lg"
                rel="noreferrer">
                {/* {__('Upgrade to Pro', 'bit-integrations')} */}
                {__('Get 50% Off - Limited Time!', 'bit-integrations')}
              </a>
            </div>
          </div>
        </div>
      </Modal>
    </>
  )
}
