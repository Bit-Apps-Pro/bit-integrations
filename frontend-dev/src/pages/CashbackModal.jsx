import { useState } from 'react'
import ExternalLinkIcn from '../Icons/ExternalLinkIcn'
import { __ } from '../Utils/i18nwrap'
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
                title={__('Get $10 Cashback')}
                type="button"
                className="cashback-btn"
                onClick={() => setShow(true)}
            >
                Get $10 Cashback
            </button>
            <Modal sm show={show} setModal={() => setShow(false)} noPadding={true}>
                <div>
                    <div id='title-wrapper'>
                        <h3 className="title">
                            Get $10 Cashback
                        </h3>
                        <b>
                            Thank you for using
                            &nbsp;
                            {PRODUCT_NAME}
                        </b>
                    </div>
                    <div className="details-wrapper">
                        <p className="details">
                            Give us a review on WordPress by clicking the
                            &nbsp;
                            <a href={REVIEW_URL} target="_blank" rel="noreferrer">Review us</a>
                            &nbsp;
                            button and send an email with the review link to
                            &nbsp;
                            <a href="mailto:support@bitapps.pro" target="_blank" rel="noreferrer">support@bitapps.pro</a>
                            . We will honour you with
                            &nbsp;
                            <strong>$10 cashback</strong>
                            &nbsp;
                            for your time & effort.
                        </p>
                        <p><b>Suggestions on how you may write the review:</b>
                        </p>
                        <p>1. What features do you like most in Bit Integrations? <br />
                            2. Which software did you previously used for these features?
                        </p>
                    </div>
                </div>
                <div className="footer-wrapper">
                    <a className="footer-btn blue" href={REVIEW_URL} target="_blank" rel="noreferrer">
                        {__('Review us')}
                        <ExternalLinkIcn size={16} className="" />
                    </a>
                </div>
            </Modal>
        </div>
    )
}