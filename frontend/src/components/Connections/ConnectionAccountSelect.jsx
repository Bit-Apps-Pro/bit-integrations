import { useEffect, useRef, useState } from 'react'
import TrashIcn from '../../Icons/TrashIcn'
import { __ } from '../../Utils/i18nwrap'
import { deleteConnection } from '../../Utils/connectionApi'

const NEW_VALUE = '__new__'

export default function ConnectionAccountSelect({
  connections,
  setConnections,
  selectedId,
  onSelect,
  onAddNew,
  onReauthorize,
  setIsLoading,
  setSnackbar,
  isInfo,
  label = __('Account:', 'bit-integrations'),
  newOptionLabel = __('+ Add new connection', 'bit-integrations')
}) {
  const [confirmOpen, setConfirmOpen] = useState(false)
  const popoverRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = event => {
      if (popoverRef.current && !popoverRef.current.contains(event.target)) {
        setConfirmOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleChange = e => {
    const value = e.target.value

    if (value === NEW_VALUE) {
      if (onAddNew) onAddNew()
      return
    }

    if (!value) {
      onSelect(null)
      return
    }

    const id = Number(value)
    const conn = connections.find(c => c.id === id)
    if (conn) onSelect(conn)
  }

  const handleDelete = () => {
    if (!selectedId) return
    if (setIsLoading) setIsLoading(true)
    deleteConnection(selectedId)
      .then(res => {
        if (res?.success) {
          setConnections(prev => prev.filter(c => c.id !== selectedId))
          onSelect(null)
        } else if (setSnackbar) {
          setSnackbar({ show: true, msg: __('Failed to delete account', 'bit-integrations') })
        }
      })
      .finally(() => {
        if (setIsLoading) setIsLoading(false)
        setConfirmOpen(false)
      })
  }

  const dropdownValue = selectedId ? String(selectedId) : ''

  return (
    <div className="connection-select-wrap">
      <div className="mt-3">
        <b>{label}</b>
      </div>
      <div className="flx mt-1" style={{ gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
        <select
          className="btcd-paper-inp w-6"
          value={dropdownValue}
          onChange={handleChange}
          disabled={isInfo}>
          <option value="">{__('Select an account...', 'bit-integrations')}</option>
          {connections.map(conn => {
            const accountName = conn.account_name || conn.connection_name
            const label =
              conn.connection_name && conn.account_name && conn.connection_name !== conn.account_name
                ? `${conn.connection_name} (${accountName})`
                : conn.connection_name || accountName
            return (
              <option key={conn.id} value={conn.id}>
                {label}
              </option>
            )
          })}
          <option value={NEW_VALUE}>{newOptionLabel}</option>
        </select>

        {selectedId && !isInfo && (
          <>
            {onReauthorize && (
              <button
                type="button"
                className="btn btcd-btn-sm sh-sm"
                onClick={() => {
                  const conn = connections.find(c => c.id === selectedId)
                  if (conn) onReauthorize(conn)
                }}>
                {__('Reauthorize', 'bit-integrations')}
              </button>
            )}

            <div style={{ position: 'relative' }}>
              {confirmOpen ? (
                <div className="confirmation-popover" ref={popoverRef}>
                  <p>{__('Delete this account?', 'bit-integrations')}</p>
                  <button type="button" className="confirm-button" onClick={handleDelete}>
                    {__('Yes', 'bit-integrations')}
                  </button>
                  <button
                    type="button"
                    className="cancel-button"
                    onClick={() => setConfirmOpen(false)}>
                    {__('No', 'bit-integrations')}
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  className="delete-button"
                  title={__('Delete account', 'bit-integrations')}
                  onClick={() => setConfirmOpen(true)}>
                  <TrashIcn />
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
