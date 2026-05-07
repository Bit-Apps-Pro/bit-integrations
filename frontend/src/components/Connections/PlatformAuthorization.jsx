import { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import useFetch from '../../hooks/useFetch'
import BackIcn from '../../Icons/BackIcn'
import { listConnections } from '../../Utils/connectionApi'
import { __ } from '../../Utils/i18nwrap'
import Note from '../Utilities/Note'
import TutorialLink from '../Utilities/TutorialLink'
import AddNewConnection from './AddNewConnection'
import ConnectionAccountSelect from './ConnectionAccountSelect'

export default function PlatformAuthorization({
  config,
  setConfig,
  step,
  setStep,
  isInfo,
  tutorialTitle,
  tutorialLinks,
  noteDetails = undefined,
  authDetails = {},
  customAuthFields
}) {
  const [showNextButton, setShowNextButton] = useState(false)
  const [errors, setErrors] = useState({ name: '' })
  const [connections, setConnections] = useState([])
  const [showNewConnection, setShowNewConnection] = useState(false)
  const [isLoadingIsLoading] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { integUrlName } = useParams()

  // const { data, mutate } = useFetch({
  //   action: 'connections/list',
  //   method: 'GET',
  //   params: { app_slug: integUrlName },
  // })

  useEffect(() => {
    setIsLoading(true)
    listConnections(config?.app_slug || config?.type)
      .then(res => {
        if (res?.success && Array.isArray(res.data?.data)) {
          const savedConnections = res.data.data
          setConnections(savedConnections)
        } else {
          setShowNewConnection(true)
        }
      })
      .finally(() => setIsLoading(false))
  }, [])

  const handleChange = event => {
    const { name, value } = event.target

    setConfig(prev => ({ ...prev, [name]: value }))
  }

  return (
    <div
      className="btcd-stp-page"
      style={{ ...{ width: step === 1 && 900 }, ...{ height: step === 1 && 'auto' } }}>
      {tutorialTitle && <TutorialLink title={tutorialTitle} links={tutorialLinks || {}} />}

      <div className="mt-3">
        <b>{__('Integration Name:', 'bit-integrations')}</b>
      </div>
      <input
        className="btcd-paper-inp w-6 mt-1"
        onChange={handleChange}
        name="name"
        value={config?.name || ''}
        type="text"
        placeholder={__('Integration Name...', 'bit-integrations')}
        disabled={isInfo}
      />
      <div style={{ color: 'red', fontSize: '15px' }}>{errors?.name}</div>

      <ConnectionAccountSelect
        config={config}
        setConfig={setConfig}
        connections={connections || []}
        setShowNewConnection={setShowNewConnection}
        isInfo={isInfo}
      />

      {showNewConnection && !isInfo && (
        <>


          {/* {showAuthTypeSelector && (
            <>
              <div className="mt-3">
                <b>{__('Authorization Type:', 'bit-integrations')}</b>
              </div>
              <select
                className="btcd-paper-inp w-6 mt-1"
                value={authorizeAuthType}
                onChange={e => onAuthorizeAuthTypeChange && onAuthorizeAuthTypeChange(e.target.value)}>
                {authTypeOptions.map(authType => (
                  <option key={authType} value={authType}>
                    {authTypeLabel(authType)}
                  </option>
                ))}
              </select>
            </>
          )} */}

          {/* {shouldShowDefaultCredentialFields && (
            <>
              <div className="mt-3">
                <b>{__('Homepage URL:', 'bit-integrations')}</b>
              </div>
              <CopyText
                value={homePageUrl}
                className="field-key-cpy w-6 ml-0"
                setSnackbar={setSnackbar}
              />

              <div className="mt-3">
                <b>{__('Authorized Redirect URIs:', 'bit-integrations')}</b>
              </div>
              <CopyText
                value={redirectUri}
                className="field-key-cpy w-6 ml-0"
                setSnackbar={setSnackbar}
              />

              {docsUrl && (
                <small className="d-blk mt-5">
                  {docsPrompt}{' '}
                  <a className="btcd-link" href={docsUrl} target="_blank" rel="noreferrer">
                    {docsText || docsUrl}
                  </a>
                </small>
              )}

              <div className="mt-3">
                <b>{clientIdLabel}</b>
              </div>
              <input
                className="btcd-paper-inp w-6 mt-1"
                onChange={onClientIdChange}
                name="clientId"
                value={clientId}
                type="text"
                placeholder={clientIdPlaceholder}
              />
              <div style={{ color: 'red', fontSize: '15px' }}>{clientIdError}</div>

              <div className="mt-3">
                <b>{clientSecretLabel}</b>
              </div>
              <input
                className="btcd-paper-inp w-6 mt-1"
                onChange={onClientSecretChange}
                name="clientSecret"
                value={clientSecret}
                type="text"
                placeholder={clientSecretPlaceholder}
              />
              <div style={{ color: 'red', fontSize: '15px' }}>{clientSecretError}</div>
            </>
          )} */}

          <AddNewConnection
            authDetails={authDetails}
            config={config}
            setConfig={setConfig}
            errors={errors}
            isInfo={isInfo}
            setShowNextButton={setShowNextButton}
            customAuthFields={customAuthFields}
          />
        </>
      )}

      {showNextButton && (
        <button
          onClick={onNext}
          className="btn f-right btcd-btn-lg purple sh-sm flx"
          type="button"
          disabled={config?.connection_id ? false : true}>
          {__('Next', 'bit-integrations')}
          <BackIcn className="ml-1 rev-icn" />
        </button>
      )}
      <br />
      <br />

      {noteDetails && (
        <Note
          note={noteDetails?.note}
          isInstructional={noteDetails?.isInstructional || false}
          isHeadingNull={noteDetails?.isHeadingNull || false}
          maxWidth={noteDetails?.maxWidth || '450px'}
          children={noteDetails?.children || null}
        />
      )}
    </div>
  )
}
