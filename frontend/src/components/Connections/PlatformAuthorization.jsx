import { useCallback, useEffect, useMemo, useState } from 'react'
import BackIcn from '../../Icons/BackIcn'
import { listConnections } from '../../Utils/connectionApi'
import { __ } from '../../Utils/i18nwrap'
import Note from '../Utilities/Note'
import TutorialLink from '../Utilities/TutorialLink'
import AddNewConnection from './AddNewConnection'
import ConnectionAccountSelect from './ConnectionAccountSelect'

const STEP_ONE_STYLE = { width: 900, height: 'auto' }
const ERROR_TEXT_STYLE = { color: 'red', fontSize: '15px' }

export default function PlatformAuthorization({
  config,
  setConfig,
  step,
  setStep,
  isInfo,
  tutorialTitle,
  tutorialLinks,
  extraFields,
  noteDetails = undefined,
  authDetails = {},
  customAuthFields
}) {
  const [errors, setErrors] = useState({ name: '' })
  const [connections, setConnections] = useState([])
  const [showNewConnection, setShowNewConnection] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const appSlug = config?.app_slug || config?.type

  const refreshConnections = useCallback(async () => {
    if (!appSlug) {
      setConnections([])
      setShowNewConnection(true)
      return []
    }

    setIsLoading(true)

    try {
      const res = await listConnections(appSlug)
      const savedConnections =
        res?.success && Array.isArray(res?.data?.data) ? res.data.data : []

      setConnections(savedConnections)
      setShowNewConnection(savedConnections.length === 0)
      return savedConnections
    } catch {
      return []
    } finally {
      setIsLoading(false)
    }
  }, [appSlug])

  useEffect(() => {
    refreshConnections()
  }, [appSlug])

  const handleNameChange = useCallback(
    event => {
      const { name, value } = event.target
      setConfig(prev => ({ ...prev, [name]: value }))

      if (name === 'name') {
        setErrors(prev => ({ ...prev, name: '' }))
      }
    },
    [setConfig]
  )

  const handleNext = useCallback(() => {
    if (!config?.name?.trim()) {
      setErrors({ name: __('Integration name is required', 'bit-integrations') })
      return
    }

    setStep(2)
  }, [config?.name, setStep])

  const canGoNext = Boolean(config?.connection_id)

  const pageStyle = useMemo(() => (step === 1 ? STEP_ONE_STYLE : undefined), [step])

  const handleConnectionSaved = useCallback(async savedConnection => {
    const refreshedConnections = await refreshConnections()
    const savedConnectionId = savedConnection?.id

    if (savedConnectionId) {
      const matchedConnection = refreshedConnections.find(
        conn => String(conn.id) === String(savedConnectionId)
      )
      const selectedConnectionId = matchedConnection?.id || savedConnectionId
      setConfig(prev => ({ ...prev, connection_id: selectedConnectionId }))
      setShowNewConnection(false)
      return
    }

    if (refreshedConnections.length > 0) {
      setShowNewConnection(false)
    }
  }, [refreshConnections, setConfig])

  return (
    <div className="btcd-stp-page" style={pageStyle}>
      {tutorialTitle && <TutorialLink title={tutorialTitle} links={tutorialLinks || {}} />}

      <div className="mt-3">
        <b>{__('Integration Name:', 'bit-integrations')}</b>
      </div>
      <input
        className="btcd-paper-inp w-6 mt-1"
        onChange={handleNameChange}
        name="name"
        value={config?.name || ''}
        type="text"
        placeholder={__('Integration Name...', 'bit-integrations')}
        disabled={isInfo}
      />
      <div style={ERROR_TEXT_STYLE}>{errors.name || ''}</div>


      <ConnectionAccountSelect
        config={config}
        setConfig={setConfig}
        connections={connections}
        setShowNewConnection={setShowNewConnection}
        isInfo={isInfo || isLoading}
        onRefresh={refreshConnections}
        isRefreshing={isLoading}
      />

      {showNewConnection && !isInfo && (extraFields || null)}

      {showNewConnection && !isInfo && (
        <AddNewConnection
          authDetails={authDetails}
          config={config}
          setConfig={setConfig}
          isInfo={isInfo}
          customAuthFields={customAuthFields}
          onConnectionSaved={handleConnectionSaved}
        />
      )}

      {!isInfo && canGoNext && (
        <button
          onClick={handleNext}
          className="btn f-right btcd-btn-lg purple sh-sm flx"
          type="button">
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
          maxWidth={noteDetails?.maxWidth || '450px'}>
          {noteDetails?.children || null}
        </Note>
      )}
    </div>
  )
}
