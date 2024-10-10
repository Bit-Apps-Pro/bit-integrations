import { useState } from 'react'
import ProBadgeIcn from '../../Icons/ProBadgeIcn'
import { __, sprintf } from '../../Utils/i18nwrap'
import Modal from './Modal'

export default function ProModal({ show, setShow, title, sub, className, children, warning }) {
  return (
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
            {sprintf(
              __('%s is available in Pro', 'bit-integrations'),
              sub || __('This feature', 'bit-integrations')
            )}
          </h3>
          <p>
            {sprintf(
              __(
                'Thank you for using our product! %s is not available in your plan. Please upgrade to the PRO plan to unlock all these awesome features.',
                'bit-integrations'
              ),
              sub || __('This feature', 'bit-integrations')
            )}
          </p>
          {children}
          <div className={`d-flx flx-center ${warning && 'mt-3'}`}>
            <a
              href="https://towp.io/?demo&plugin=bit-integrations"
              target="_blank"
              className="btn btcd-btn-o-gray gray gray-sh w-4 mr-2 br-50 btn-lg "
              rel="noreferrer">
              {__('Try Demo', 'bit-integrations')}
            </a>
            <a
              href="https://bitapps.pro/bit-integrations/#pricing"
              target="_blank"
              className="btn btcd-btn-o-white purple w-4 mr-2 br-50 btn-lg"
              rel="noreferrer">
              {__('Upgrade to Pro', 'bit-integrations')}
            </a>
          </div>
          <p>
            {__('Check out our', 'bit-integrations')}
            <a
              href="https://towp.io/?demo&plugin=bit-integrations"
              target="_blank"
              rel="noreferrer">
              {__(' Demo ', 'bit-integrations')}
            </a>
            {__('to see what can you do with Pro version.', 'bit-integrations')}
          </p>
        </div>
      </div>
    </Modal>
  )
}
