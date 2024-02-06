
import { useState } from 'react'
import { useRecoilValue } from 'recoil'
import { $btcbi } from '../GlobalStates'
import ChangelogIcn from '../Icons/ChangeLogIcn'
import ExternalLinkIcn from '../Icons/ExternalLinkIcn'
import { __ } from '../Utils/i18nwrap'
import Modal from '../components/Utilities/Modal'

export default function ChangelogToggle() {
    const btcbi = useRecoilValue($btcbi)
    const [show, setShow] = useState(btcbi.changelogVersion !== btcbi.version)
    const version = btcbi.isPro ? '1.4.3' : '1.6.0'
    return (
        <div className="changelog-toggle">
            <button
                title={('What\'s New')}
                type="button"
                className="changelog-btn"
                onClick={() => setShow(true)}
            >
                {/* <QuestionIcn size={25} /> */}
                <ChangelogIcn size={25} />
            </button>
            <Modal sm show={show} setModal={setShow} >
                <div className='changelog'>
                    {/* <h4 className='changelog-notif'> From 1.4.1 update,To use pro plugin free version is required. </h4> */}
                    <div className="flx flx-col flx-center whats-new">
                        <h3>What's New in {version}?</h3>
                        <small className='date'> <b>5th February 2023</b></small>
                    </div>
                    <div className='changelog-content'>
                        {/* <h4>New Integration</h4> */}
                        {/* <p>New Integration</p> */}
                        <span className='new-integration' style={{ background: "cornflowerblue" }}><b>New Triggers</b></span>

                        <div className='integration-list'>
                            <ul>
                                <li>Spectra</li>
                                <li>Essential Blocks</li>
                            </ul>
                        </div>

                        {/* <span className='new-integration'><b>New Actions</b></span>

                        <div className='integration-list'>
                            <ul>
                                <li>Zagomail</li>
                            </ul>
                        </div> */}

                        <span className='new-feature'><b>New Features</b></span>

                        <div className='feature-list'>
                            <ul>
                                <li>Mail Mint: Custom Field</li>
                                <li>Active Campaign: Account feature</li>
                                <li>WebHook: General Smart Codes Fields & Custom JSON Schema Editor (Raw)</li>
                                <li>Custom Api: General Smart Codes Fields & Custom JSON Schema Editor (Raw)</li>
                            </ul>
                        </div>

                        <span className='fixes'><b>Fixed</b></span>

                        <div className='fixes-list'>
                            <ul>
                                <li>ZohoCRM: Fixed DateTime </li>
                                <li>Custom Api: Fixed HTTP method</li>
                                <li>Mail Mint: FIxed update contact status</li>
                                <li>Post: Create a new post : Fixed multiple data sending issue</li>
                                <li>ConvertKit: Fixed authorization</li>
                                <li>Zoho Bigin: integration update validation</li>
                                <li>WooCommerce: custom field mapping</li>
                            </ul>
                        </div>
                    </div>
                    <div>
                        <span className='footer'>{__('For more details,')}</span>
                        <a href="https://bitapps.pro/docs/bit-integrations/free-changelogs/" target="_blank" rel="noreferrer">
                            {__('Click here ')}
                            <ExternalLinkIcn size="14" />
                        </a>
                    </div>
                </div>
            </Modal >
        </div >
    )
}