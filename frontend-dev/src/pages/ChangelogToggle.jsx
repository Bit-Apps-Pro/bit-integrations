import { Fragment, useEffect, useState } from 'react'
import { useRecoilState } from 'recoil'
import Loader from '../components/Loaders/Loader'
import Modal from '../components/Utilities/Modal'
import { $btcbi } from '../GlobalStates'
import ChangelogIcn from '../Icons/ChangeLogIcn'
import ExternalLinkIcn from '../Icons/ExternalLinkIcn'
import promo from '../resource/img/bit-social-promo.webp'
import bitsFetch from '../Utils/bitsFetch'
import { __, sprintf } from '../Utils/i18nwrap'

export default function ChangelogToggle() {
  const [btcbi, setBtcbi] = useRecoilState($btcbi)
  const [show, setShow] = useState(btcbi.changelogVersion !== btcbi.version)
  const [showAnalyticsOptin, setShowAnalyticsOptin] = useState([])
  const [loading, setLoading] = useState('')
  const [step, setStep] = useState(1)

  const source = !btcbi.isPro ? 'bit-integrations' : 'bit-integrations-pro'
  const Early_Bird_URL = `https://bit-social.com/?utm_source=${source}&utm_medium=inside-plugin&utm_campaign=early-bird-offer`

  const changeLog = [
    {
      label: __('Note', 'bit-integrations'),
      headClass: 'new-integration',
      itemClass: 'integration-list',
      items: []
    },
    {
      label: __('New Actions', 'bit-integrations'),
      headClass: 'new-integration',
      itemClass: 'integration-list',
      items: []
    },
    {
      label: __('New Triggers', 'bit-integrations'),
      headClass: 'new-integration',
      itemClass: 'integration-list',
      items: ['The Events Calendar (Pro)']
    },
    {
      label: __('New Features', 'bit-integrations'),
      headClass: 'new-feature',
      itemClass: 'feature-list',
      items: ['Trello: Added support for Custom Fields. (Pro)']
    },
    {
      label: __('New Improvements', 'bit-integrations'),
      headClass: 'new-integration',
      itemClass: 'integration-list',
      items: []
    }
  ]

  const setChangeLogVersion = (val) => {
    setShow(val)
    if (!val) {
      bitsFetch(
        {
          version: btcbi.version
        },
        'changelog_version'
      ).then(() => {
        setBtcbi((prevBtcbi) => ({ ...prevBtcbi, changelogVersion: prevBtcbi.version }))
      })
    }
  }

  const handleSubmit = () => {
    bitsFetch({ isChecked: true }, 'analytics/optIn')
    setShow(false)
  }

  const closeModal = () => {
    setShow(false)
    setChangeLogVersion()
  }

  useEffect(() => {
    if (show) {
      setLoading(true)
      bitsFetch({}, 'analytics/check', '', 'GET').then((res) => {
        setShowAnalyticsOptin(res.data)
        setLoading(false)
      })
    }
  }, [show])

  return (
    <div className="changelog-toggle">
      <button
        title={__("What's New", 'bit-integrations')}
        type="button"
        className="changelog-btn"
        onClick={() => {
          setStep(1)
          setShow(true)
        }}>
        <ChangelogIcn size={25} />
      </button>
      <Modal
        md={step === 1}
        sm={step !== 1}
        show={show}
        setModal={closeModal}
        closeIcon={showAnalyticsOptin}
        style={{
          height: 'auto',
          width: '550px'
        }}>
        {(step === 1 && show === true && (
          <>
            <div>
              <a href={Early_Bird_URL} target="_blank" rel="noreferrer">
                <img src={promo} style={{ width: '100%', marginTop: '-10px' }} alt="" />
              </a>
            </div>
            <div className="txt-right" style={{ marginTop: '-20px' }}>
              <button
                type="button"
                className="btn round btcd-btn-lg purple purple-sh"
                onClick={() => setStep(2)}>
                {__('Next', 'bit-integrations')}
              </button>
            </div>
          </>
        )) ||
          (step === 2 && (
            <div className="changelog content">
              <div className="flx flx-col flx-center whats-new">
                <h3>{sprintf(__("What's New in %s", 'bit-integrations'), btcbi.version)}?</h3>
                <small className="date">
                  {__('Updated at:', 'bit-integrations')} <b>16th October 2024</b>
                </small>
              </div>
              <div className="changelog-content">
                {changeLog.map((log, index) => (
                  <Fragment key={index}>
                    {log.items.length > 0 && (
                      <>
                        <span className={log.headClass}>
                          <b>{log.label}</b>
                        </span>

                        <div className={log.itemClass}>
                          <ul>
                            {log.items.map((item, index) => (
                              <li key={index}> {item} </li>
                            ))}
                          </ul>
                        </div>
                      </>
                    )}
                  </Fragment>
                ))}
                <div>
                  <span className="footer">{__('For more details,')}</span>
                  <a
                    href="https://bitapps.pro/docs/bit-integrations/free-changelogs/"
                    target="_blank"
                    rel="noreferrer">
                    {__('Click here')}&nbsp;
                    <ExternalLinkIcn size="14" />
                  </a>
                </div>
              </div>
              {loading ? (
                <div className="flx flx-center" style={{ height: '150px' }}>
                  <Loader
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      height: 45,
                      transform: 'scale(0.5)'
                    }}
                  />
                </div>
              ) : (
                !showAnalyticsOptin && (
                  <div>
                    <div className="btcd-hr mt-2"></div>
                    <div className="flx flx-col flx-center">
                      <h4 className="mt-2 mb-0">
                        {__('Opt-In For Plugin Improvement', 'bit-integrations')}
                      </h4>
                    </div>
                    <div className="m-2 txt-sm">
                      {__(
                        'Accept and continue to share usage data to help us improve the plugin, the plugin will still function if you skip.',
                        'bit-integrations'
                      )}
                      <br />
                      <a
                        className="app-link-active"
                        target="blank"
                        href="https://bitapps.pro/terms-of-service/">
                        {__('Click here to see terms', 'bit-integrations')}
                      </a>
                    </div>
                    <div className="flx flx-between">
                      <button
                        type="button"
                        className="btn round btn-md gray gray-sh"
                        onClick={() => closeModal()}>
                        Skip
                      </button>
                      <button
                        type="button"
                        className="btn round btcd-btn-lg purple purple-sh"
                        onClick={() => handleSubmit()}>
                        {__('Accept and continue', 'bit-integrations')}
                      </button>
                    </div>
                  </div>
                )
              )}
            </div>
          ))}
      </Modal>
    </div>
  )
}
