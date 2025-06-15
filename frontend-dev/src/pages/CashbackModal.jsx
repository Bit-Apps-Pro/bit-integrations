import { useState } from 'react'
import surprise from '../resource/img/surprise.svg'
import ExternalLinkIcn from '../Icons/ExternalLinkIcn'
import { __, sprintf } from '../Utils/i18nwrap'
import { $btcbi } from '../GlobalStates'
import '../resource/css/cashback-modal.css'
import Modal from '../components/Utilities/Modal'

const PRODUCT_NAME = 'Bit Integrations'
const REVIEW_URL = 'https://wordpress.org/support/plugin/bit-integrations/reviews/#new-post'

export default function CashbackModal() {
  const [show, setShow] = useState(false)

  if (!btcbi.isPro) return

  return (
    <div className="cashback-modal">
      <button
        title={__('Get $10 Cashback', 'bit-integrations')}
        type="button"
        className="cashback-btn"
        onClick={() => setShow(true)}>
        <img src={surprise} style={{ marginRight: '8px', width: '25px' }} />

        <span>{__('$10 Cashback', 'bit-integrations')}</span>
      </button>
      <Modal sm show={show} setModal={() => setShow(false)} noPadding={true} closeIcon={true}>
        <div>
          <div id="title-wrapper">
            <h3 className="title">{__('Get $10 Cashback', 'bit-integrations')}</h3>
            <b>{sprintf(__('Thank you for using %s', 'bit-integrations'), PRODUCT_NAME)}</b>
          </div>
          <div className="details-wrapper">
            <p
              className="details"
              dangerouslySetInnerHTML={{
                __html: sprintf(
                  __(
                    'Give us a review on WordPress by clicking the <a href={REVIEW_URL} target="_blank" rel="noreferrer">%s</a> button and send an email with the review link to <a href="mailto:support@bitapps.pro" target="_blank" rel="noreferrer">%s</a>. We will honour you with <strong>%s</strong> for your time & effort.',
                    'bit-integrations'
                  ),
                  __('Review us', 'bit-integrations'),
                  'support@bitapps.pro',
                  __('$10 Cashback', 'bit-integrations')
                )
              }}></p>
            <p>
              <b>{__('Suggestions on how you may write the review:', 'bit-integrations')}</b>
            </p>
            <p>
              {__('1. What features do you like most in Bit Integrations?', 'bit-integrations')}
              <br />
              {__(
                '2. Which software did you previously used for these features?',
                'bit-integrations'
              )}
            </p>
          </div>
        </div>
        <div className="footer-wrapper">
          <a className="footer-btn purple" href={REVIEW_URL} target="_blank" rel="noreferrer">
            {__('Review us', 'bit-integrations')}
            <ExternalLinkIcn size={16} className="" />
          </a>
        </div>
      </Modal>
    </div>
  )
}
