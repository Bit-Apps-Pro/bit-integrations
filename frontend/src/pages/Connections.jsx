import { useEffect, useMemo, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import EditIcn from '../Icons/EditIcn'
import TrashIcn from '../Icons/TrashIcn'
import {
  deleteConnection,
  listConnections,
  updateConnection
} from '../Utils/connectionApi'
import Loader from '../components/Loaders/Loader'
import ConfirmModal from '../components/Utilities/ConfirmModal'
import { __ } from '../Utils/i18nwrap'

const loaderStyle = {
  display: 'flex',
  height: '60vh',
  justifyContent: 'center',
  alignItems: 'center'
}

export default function Connections() {
  const [connections, setConnections] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [filterApp, setFilterApp] = useState('')
  const [search, setSearch] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editValue, setEditValue] = useState('')
  const [deletingId, setDeletingId] = useState(null)
  const [savingId, setSavingId] = useState(null)
  const inputRef = useRef(null)

  const fetchConnections = () => {
    setIsLoading(true)
    listConnections('')
      .then(res => {
        if (res?.success && Array.isArray(res.data?.data)) {
          setConnections(res.data.data)
        } else {
          setConnections([])
        }
      })
      .catch(() => toast.error(__('Failed to load connections', 'bit-integrations')))
      .finally(() => setIsLoading(false))
  }

  useEffect(() => {
    fetchConnections()
  }, [])

  useEffect(() => {
    if (editingId !== null && inputRef.current) inputRef.current.focus()
  }, [editingId])

  const apps = useMemo(() => {
    const set = new Set(connections.map(c => c.app_slug).filter(Boolean))
    return Array.from(set).sort()
  }, [connections])

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase()
    return connections.filter(conn => {
      if (filterApp && conn.app_slug !== filterApp) return false
      if (!term) return true
      return (
        (conn.connection_name || '').toLowerCase().includes(term) ||
        (conn.account_name || '').toLowerCase().includes(term) ||
        (conn.app_slug || '').toLowerCase().includes(term)
      )
    })
  }, [connections, filterApp, search])

  const startEdit = conn => {
    setEditingId(conn.id)
    setEditValue(conn.connection_name || '')
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditValue('')
  }

  const saveRename = id => {
    const next = editValue.trim()
    if (!next) {
      toast.error(__('Connection name cannot be empty', 'bit-integrations'))
      return
    }

    const previous = connections.find(c => c.id === id)
    if (previous && previous.connection_name === next) {
      cancelEdit()
      return
    }

    setSavingId(id)
    const promise = updateConnection({ id, connection_name: next }).then(res => {
      if (!res?.success) throw new Error('rename_failed')
      const row = res.data?.data
      setConnections(prev =>
        prev.map(item => (item.id === id ? { ...item, ...(row || { connection_name: next }) } : item))
      )
      cancelEdit()
      return __('Renamed', 'bit-integrations')
    })

    toast
      .promise(promise, {
        success: msg => msg,
        error: __('Failed to rename', 'bit-integrations'),
        loading: __('Saving...', 'bit-integrations')
      })
      .finally(() => setSavingId(null))
  }

  const handleKeyDown = (e, id) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      saveRename(id)
    } else if (e.key === 'Escape') {
      e.preventDefault()
      cancelEdit()
    }
  }

  const confirmDelete = () => {
    const id = deletingId
    if (!id) return

    const promise = deleteConnection(id).then(res => {
      if (!res?.success) throw new Error('delete_failed')
      setConnections(prev => prev.filter(c => c.id !== id))
      return __('Connection deleted', 'bit-integrations')
    })

    toast.promise(promise, {
      success: msg => msg,
      error: __('Failed to delete', 'bit-integrations'),
      loading: __('Deleting...', 'bit-integrations')
    })

    setDeletingId(null)
  }

  if (isLoading) return <Loader style={loaderStyle} />

  return (
    <div id="connections-page" className="p-4">
      <ConfirmModal
        show={deletingId !== null}
        body={__(
          'Delete this connection? Any flow that uses it will lose authorization.',
          'bit-integrations'
        )}
        action={confirmDelete}
        close={() => setDeletingId(null)}
        btnTxt={__('Delete', 'bit-integrations')}
        btnClass=""
      />

      <div className="af-header flx flx-between mt-3">
        <h2>{__('Connections', 'bit-integrations')}</h2>
      </div>

      <div className="flx mt-3 mb-3" style={{ gap: 12, flexWrap: 'wrap', padding: '0 20px' }}>
        <input
          type="text"
          className="btcd-paper-inp"
          style={{ width: 300 }}
          placeholder={__('Search connections...', 'bit-integrations')}
          value={search}
          onChange={e => setSearch(e.target.value)}
        />

        <select
          className="btcd-paper-inp"
          style={{ width: 200 }}
          value={filterApp}
          onChange={e => setFilterApp(e.target.value)}>
          <option value="">{__('All apps', 'bit-integrations')}</option>
          {apps.map(app => (
            <option key={app} value={app}>
              {app}
            </option>
          ))}
        </select>

        <button
          type="button"
          className="btn btcd-btn-md sh-sm"
          onClick={fetchConnections}
          title={__('Refresh', 'bit-integrations')}>
          {__('Refresh', 'bit-integrations')}
        </button>
      </div>

      <div className="forms" style={{ padding: '0 20px' }}>
        {filtered.length === 0 ? (
          <p className="txt-center mt-5" style={{ color: '#888' }}>
            {connections.length === 0
              ? __('No connections saved yet. Authorize an app from any integration to add one.', 'bit-integrations')
              : __('No connections match the current filters.', 'bit-integrations')}
          </p>
        ) : (
          <table className="f-table btcd-all-frm" style={{ width: '100%' }}>
            <thead>
              <tr>
                <th style={{ width: 160 }}>{__('App', 'bit-integrations')}</th>
                <th>{__('Connection Name', 'bit-integrations')}</th>
                <th style={{ width: 220 }}>{__('Account', 'bit-integrations')}</th>
                <th style={{ width: 120 }}>{__('Auth Type', 'bit-integrations')}</th>
                <th style={{ width: 180 }}>{__('Created', 'bit-integrations')}</th>
                <th style={{ width: 110 }}></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(conn => (
                <tr key={conn.id}>
                  <td>{conn.app_slug}</td>
                  <td>
                    {editingId === conn.id ? (
                      <div className="flx" style={{ gap: 6 }}>
                        <input
                          ref={inputRef}
                          type="text"
                          className="btcd-paper-inp"
                          style={{ flex: 1 }}
                          value={editValue}
                          onChange={e => setEditValue(e.target.value)}
                          onKeyDown={e => handleKeyDown(e, conn.id)}
                          disabled={savingId === conn.id}
                        />
                        <button
                          type="button"
                          className="btn btcd-btn-sm purple sh-sm"
                          onClick={() => saveRename(conn.id)}
                          disabled={savingId === conn.id}>
                          {__('Save', 'bit-integrations')}
                        </button>
                        <button
                          type="button"
                          className="btn btcd-btn-sm sh-sm"
                          onClick={cancelEdit}
                          disabled={savingId === conn.id}>
                          {__('Cancel', 'bit-integrations')}
                        </button>
                      </div>
                    ) : (
                      <div className="flx" style={{ gap: 6, alignItems: 'center' }}>
                        <span>{conn.connection_name || '—'}</span>
                        <button
                          type="button"
                          className="icn-btn"
                          title={__('Rename', 'bit-integrations')}
                          onClick={() => startEdit(conn)}>
                          <EditIcn size={14} />
                        </button>
                      </div>
                    )}
                  </td>
                  <td>{conn.account_name || '—'}</td>
                  <td>{conn.auth_type}</td>
                  <td>{conn.created_at || '—'}</td>
                  <td>
                    <button
                      type="button"
                      className="delete-button"
                      title={__('Delete', 'bit-integrations')}
                      onClick={() => setDeletingId(conn.id)}>
                      <TrashIcn />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
