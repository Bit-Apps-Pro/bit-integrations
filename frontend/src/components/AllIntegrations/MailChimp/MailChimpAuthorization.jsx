import { useEffect, useState } from 'react'
import BackIcn from '../../../Icons/BackIcn'
import { __ } from '../../../Utils/i18nwrap'
import { listConnections } from '../../../Utils/connectionApi'
import LoaderSm from '../../Loaders/LoaderSm'
import CopyText from '../../Utilities/CopyText'
import {
  applyConnectionToConf,
  handleMailChimpAuthorize,
  refreshModules
} from './MailChimpCommonFunc'
import tutorialLinks from '../../../Utils/StaticData/tutorialLinks'
import TutorialLink from '../../Utilities/TutorialLink'
import ConnectionAccountSelect from '../../Connections/ConnectionAccountSelect'

const APP_SLUG = 'MailChimp'

export default function MailChimpAuthorization({
  formID,
  mailChimpConf,
  setMailChimpConf,
  step,
  setstep,
  isLoading,
  setIsLoading,
  setSnackbar,
  redirectLocation,
  isInfo
}) {
  const [isAuthorized, setisAuthorized] = useState(false)
  const [connections, setConnections] = useState([])
  const [showNewForm, setShowNewForm] = useState(false)
  const [error, setError] = useState({ connectionName: '', clientId: '', clientSecret: '' })

  useEffect(() => {
    setIsLoading(true)
    listConnections(APP_SLUG)
      .then(res => {
        if (res?.success && Array.isArray(res.data?.data)) {
          setConnections(res.data.data)
          if (mailChimpConf.connection_id) {
            const match = res.data.data.find(c => c.id === mailChimpConf.connection_id)
            if (match) setisAuthorized(true)
          } else if (res.data.data.length === 0) {
            setShowNewForm(true)
          }
        } else {
          setShowNewForm(true)
        }
      })
      .finally(() => setIsLoading(false))
  }, [])

  const nextPage = () => {
    setTimeout(() => {
      document.getElementById('btcd-settings-wrp').scrollTop = 0
    }, 300)
    setstep(2)
    refreshModules(setMailChimpConf, setIsLoading, setSnackbar)
  }

  const handleInput = e => {
    const newConf = { ...mailChimpConf }
    const rmError = { ...error }
    rmError[e.target.name] = ''
    newConf[e.target.name] = e.target.value
    setError(rmError)
    setMailChimpConf(newConf)
  }

  const handleSelectConnection = conn => {
    if (!conn) {
      setMailChimpConf(prev => ({
        ...prev,
        connection_id: null,
        tokenDetails: null,
        clientId: '',
        clientSecret: '',
        connectionName: ''
      }))
      setisAuthorized(false)
      setShowNewForm(false)
      return
    }

    applyConnectionToConf(conn, setMailChimpConf)
    setisAuthorized(true)
    setShowNewForm(false)
  }

  const enterNewForm = () => {
    setShowNewForm(true)
    setisAuthorized(false)
    setMailChimpConf(prev => ({
      ...prev,
      connection_id: null,
      clientId: '',
      clientSecret: '',
      tokenDetails: null,
      connectionName: ''
    }))
  }

  const handleReauthorize = conn => {
    setShowNewForm(true)
    setMailChimpConf(prev => ({
      ...prev,
      connection_id: conn.id,
      connectionName: conn.connection_name || '',
      clientId: conn.auth_details?.client_id || '',
      clientSecret: conn.auth_details?.client_secret || ''
    }))
    setisAuthorized(false)
  }

  const onAuthorizeClick = () => {
    if (!mailChimpConf.connectionName?.trim()) {
      setError({ ...error, connectionName: __("Connection name can't be empty", 'bit-integrations') })
      return
    }
    handleMailChimpAuthorize(
      'mailChimp',
      'mChimp',
      mailChimpConf,
      setMailChimpConf,
      setError,
      setisAuthorized,
      setIsLoading,
      setSnackbar,
      setConnections
    )
  }

  return (
    <div
      className="btcd-stp-page"
      style={{ ...{ width: step === 1 && 900 }, ...{ height: step === 1 && 'auto' } }}>
      <TutorialLink title="Mail chimp" links={tutorialLinks?.mailchimp || {}} />

      <div className="mt-3">
        <b>{__('Integration Name:', 'bit-integrations')}</b>
      </div>
      <input
        className="btcd-paper-inp w-6 mt-1"
        onChange={handleInput}
        name="name"
        value={mailChimpConf.name}
        type="text"
        placeholder={__('Integration Name...', 'bit-integrations')}
        disabled={isInfo}
      />

      {!isInfo && (
        <ConnectionAccountSelect
          connections={connections}
          setConnections={setConnections}
          selectedId={mailChimpConf.connection_id || null}
          onSelect={handleSelectConnection}
          onAddNew={enterNewForm}
          onReauthorize={handleReauthorize}
          setIsLoading={setIsLoading}
          setSnackbar={setSnackbar}
          isInfo={isInfo}
          label={__('MailChimp account:', 'bit-integrations')}
        />
      )}

      {showNewForm && !isInfo && (
        <>
          <div className="mt-3">
            <b>{__('Connection Name:', 'bit-integrations')}</b>
          </div>
          <input
            className="btcd-paper-inp w-6 mt-1"
            onChange={handleInput}
            name="connectionName"
            value={mailChimpConf.connectionName || ''}
            type="text"
            placeholder={__('My MailChimp account', 'bit-integrations')}
          />
          <div style={{ color: 'red', fontSize: '15px' }}>{error.connectionName}</div>

          <div className="mt-3">
            <b>{__('Homepage URL:', 'bit-integrations')}</b>
          </div>
          <CopyText
            value={`${window.location.origin}`}
            className="field-key-cpy w-6 ml-0"
            setSnackbar={setSnackbar}
          />

          <div className="mt-3">
            <b>{__('Authorized Redirect URIs:', 'bit-integrations')}</b>
          </div>
          <CopyText
            value={redirectLocation || `${window.location.href}`}
            className="field-key-cpy w-6 ml-0"
            setSnackbar={setSnackbar}
          />

          <small className="d-blk mt-5">
            {__('To get Client ID and SECRET , Please Visit', 'bit-integrations')}{' '}
            <a
              className="btcd-link"
              href="https://us7.admin.mailchimp.com/account/oauth2/"
              target="_blank"
              rel="noreferrer">
              {__('Mail Chimp API Console', 'bit-integrations')}
            </a>
          </small>

          <div className="mt-3">
            <b>{__('Client id:', 'bit-integrations')}</b>
          </div>
          <input
            className="btcd-paper-inp w-6 mt-1"
            onChange={handleInput}
            name="clientId"
            value={mailChimpConf.clientId}
            type="text"
            placeholder={__('client ID...', 'bit-integrations')}
          />
          <div style={{ color: 'red', fontSize: '15px' }}>{error.clientId}</div>

          <div className="mt-3">
            <b>{__('Client secret:', 'bit-integrations')}</b>
          </div>
          <input
            className="btcd-paper-inp w-6 mt-1"
            onChange={handleInput}
            name="clientSecret"
            value={mailChimpConf.clientSecret}
            type="text"
            placeholder={__('client Secret...', 'bit-integrations')}
          />
          <div style={{ color: 'red', fontSize: '15px' }}>{error.clientSecret}</div>

          <button
            onClick={onAuthorizeClick}
            className="btn btcd-btn-lg purple sh-sm flx"
            type="button"
            disabled={isAuthorized || isLoading}>
            {isAuthorized ? __('Authorized ✔', 'bit-integrations') : __('Authorize', 'bit-integrations')}
            {isLoading && <LoaderSm size={20} clr="#022217" className="ml-2" />}
          </button>
          <br />
        </>
      )}

      {!isInfo && (
        <button
          onClick={nextPage}
          className="btn f-right btcd-btn-lg purple sh-sm flx"
          type="button"
          disabled={!isAuthorized}>
          {__('Next', 'bit-integrations')}
          <BackIcn className="ml-1 rev-icn" />
        </button>
      )}
    </div>
  )
}
