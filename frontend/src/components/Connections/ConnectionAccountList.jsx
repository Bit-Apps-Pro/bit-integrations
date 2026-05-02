import { useEffect, useRef, useState } from 'react'
import TrashIcn from '../../Icons/TrashIcn'
import { __ } from '../../Utils/i18nwrap'
import { deleteConnection } from '../../Utils/connectionApi'

export default function ConnectionAccountList({
  connections,
  setConnections,
  selectedId,
  onSelect,
  onReauthorize,
  setIsLoading,
  setSnackbar,
  isInfo
}) {
  const [confirmId, setConfirmId] = useState(null)
  const popoverRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = event => {
      if (popoverRef.current && !popoverRef.current.contains(event.target)) {
        setConfirmId(null)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleDelete = id => {
    if (setIsLoading) setIsLoading(true)
    deleteConnection(id)
      .then(res => {
        if (res?.success) {
          setConnections(prev => prev.filter(item => item.id !== id))
          if (selectedId === id) onSelect(null)
        } else if (setSnackbar) {
          setSnackbar({ show: true, msg: __('Failed to delete account', 'bit-integrations') })
        }
      })
      .finally(() => {
        if (setIsLoading) setIsLoading(false)
        setConfirmId(null)
      })
  }

  if (!connections?.length) return null

  return (
    <div className="user-radio-input">
      <div className="auth-list">
        {connections.map(conn => {
          const userInfo = conn.auth_details?.userInfo?.user || conn.auth_details?.userInfo || {}
          const displayName =
            userInfo.displayName || userInfo.name || conn.account_name || conn.connection_name
          const email = userInfo.emailAddress || userInfo.email || conn.account_name
          const photo = userInfo.photoLink || userInfo.picture || ''

          return (
            <div key={conn.id} className={`auth-item ${selectedId === conn.id ? 'active' : ''}`}>
              <label className="auth-label">
                <input
                  type="radio"
                  name="connection"
                  value={conn.id}
                  checked={selectedId === conn.id}
                  onChange={() => onSelect(conn)}
                  disabled={isInfo}
                  className="radio-input"
                />
                <div className="auth-info">
                  {photo && (
                    <img src={photo} alt={displayName} className="user-avatar" />
                  )}
                  <div>
                    <div className="user-name">{displayName}</div>
                    {email && email !== displayName && (
                      <div className="user-email">{email}</div>
                    )}
                  </div>
                </div>
              </label>

              {!isInfo && (
                <div className="delete-section">
                  {onReauthorize && (
                    <button
                      type="button"
                      className="btn btcd-btn-sm sh-sm mr-1"
                      onClick={() => onReauthorize(conn)}>
                      {__('Reauthorize', 'bit-integrations')}
                    </button>
                  )}
                  {confirmId === conn.id ? (
                    <div className="confirmation-popover" ref={popoverRef}>
                      <p>{__('Are you sure?', 'bit-integrations')}</p>
                      <button
                        type="button"
                        className="confirm-button"
                        onClick={() => handleDelete(conn.id)}>
                        {__('Yes', 'bit-integrations')}
                      </button>
                      <button
                        type="button"
                        className="cancel-button"
                        onClick={() => setConfirmId(null)}>
                        {__('No', 'bit-integrations')}
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      className="delete-button"
                      onClick={() => setConfirmId(conn.id)}>
                      <TrashIcn />
                    </button>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
