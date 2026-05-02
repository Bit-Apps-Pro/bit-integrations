import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import EditIcn from '../Icons/EditIcn'
import TrashIcn from '../Icons/TrashIcn'
import Table from '../components/Utilities/Table'
import ConfirmModal from '../components/Utilities/ConfirmModal'
import {
  deleteConnection,
  listConnections,
  updateConnection
} from '../Utils/connectionApi'
import { __ } from '../Utils/i18nwrap'

export default function Connections() {
  const [connections, setConnections] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [filterApp, setFilterApp] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [deletingId, setDeletingId] = useState(null)
  const [savingId, setSavingId] = useState(null)
  const inputRef = useRef(null)
  const editValueRef = useRef('')

  const fetchConnections = useCallback(() => {
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
  }, [])

  useEffect(() => {
    fetchConnections()
  }, [fetchConnections])

  useEffect(() => {
    if (editingId !== null && inputRef.current) inputRef.current.focus()
  }, [editingId])

  const apps = useMemo(() => {
    const set = new Set(connections.map(c => c.app_slug).filter(Boolean))
    return Array.from(set).sort()
  }, [connections])

  const filteredConnections = useMemo(
    () => connections.filter(conn => !filterApp || conn.app_slug === filterApp),
    [connections, filterApp]
  )

  const startEdit = useCallback(conn => {
    setEditingId(conn.id)
    editValueRef.current = conn.connection_name || ''
  }, [])

  const cancelEdit = useCallback(() => {
    setEditingId(null)
    editValueRef.current = ''
  }, [])

  const saveRename = useCallback(
    (id, rawName = editValueRef.current) => {
      const next = (rawName || '').trim()
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
    },
    [connections, cancelEdit]
  )

  const handleKeyDown = (e, id) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      saveRename(id, e.currentTarget.value)
    } else if (e.key === 'Escape') {
      e.preventDefault()
      cancelEdit()
    }
  }

  const confirmDelete = useCallback(() => {
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
  }, [deletingId])

  const setBulkDelete = useCallback(rows => {
    const ids = []

    if (Array.isArray(rows)) {
      rows.forEach(row => {
        if (row?.original?.id) {
          ids.push(row.original.id)
        }
      })
    } else if (rows?.original?.id) {
      ids.push(rows.original.id)
    }

    if (ids.length < 1) {
      return
    }

    const promise = Promise.all(
      ids.map(id =>
        deleteConnection(id).then(res => {
          if (!res?.success) {
            throw new Error('bulk_delete_failed')
          }

          return id
        })
      )
    ).then(() => {
      setConnections(prev => prev.filter(item => !ids.includes(item.id)))

      return ids.length > 1
        ? __('Connections deleted', 'bit-integrations')
        : __('Connection deleted', 'bit-integrations')
    })

    toast.promise(promise, {
      success: msg => msg,
      error: __('Failed to delete', 'bit-integrations'),
      loading: __('Deleting...', 'bit-integrations')
    })
  }, [])

  const columns = useMemo(
    () => [
      {
        Header: __('App', 'bit-integrations'),
        accessor: 'app_slug',
        width: 130,
        minWidth: 90,
        Cell: ({ value }) => <span className="connections-app-tag">{value || '—'}</span>
      },
      {
        Header: __('Connection Name', 'bit-integrations'),
        accessor: 'connection_name',
        width: 250,
        minWidth: 170,
        className: 'connections-name-cell',
        Cell: ({ row, value }) => {
          const conn = row.original

          if (editingId === conn.id) {
            return (
              <div className="flx connections-edit-row">
                <input
                  ref={inputRef}
                  type="text"
                  className="btcd-paper-inp"
                  defaultValue={editValueRef.current}
                  onChange={e => {
                    editValueRef.current = e.target.value
                  }}
                  onKeyDown={e => handleKeyDown(e, conn.id)}
                  disabled={savingId === conn.id}
                />
                <button
                  type="button"
                  className="btn btcd-btn-sm purple"
                  onClick={() => saveRename(conn.id, inputRef.current?.value ?? editValueRef.current)}
                  disabled={savingId === conn.id}>
                  {__('Save', 'bit-integrations')}
                </button>
                <button
                  type="button"
                  className="btn btcd-btn-sm gray"
                  onClick={cancelEdit}
                  disabled={savingId === conn.id}>
                  {__('Cancel', 'bit-integrations')}
                </button>
              </div>
            )
          }

          return (
            <div className="flx connections-name-row">
              <span>{value || '—'}</span>
              <button
                type="button"
                className="icn-btn tooltip"
                style={{ '--tooltip-txt': `'${__('Rename connection', 'bit-integrations')}'` }}
                onClick={() => startEdit(conn)}>
                <EditIcn size={14} />
              </button>
            </div>
          )
        }
      },
      {
        Header: __('Account', 'bit-integrations'),
        accessor: 'account_name',
        width: 180,
        minWidth: 120,
        Cell: ({ value }) => value || '—'
      },
      {
        Header: __('Auth Type', 'bit-integrations'),
        accessor: 'auth_type',
        width: 120,
        minWidth: 95,
        Cell: ({ value }) => <span className="connections-auth-tag">{value || '—'}</span>
      },
      {
        Header: __('Created', 'bit-integrations'),
        accessor: 'created_at',
        width: 140,
        minWidth: 110,
        Cell: ({ value }) => value || '—'
      },
      {
        id: 't_action',
        Header: '',
        accessor: 'id',
        width: 70,
        minWidth: 60,
        maxWidth: 80,
        disableSortBy: true,
        Cell: ({ row }) => (
          <div className="flx connections-action-cell">
            <button
              type="button"
              className="icn-btn tooltip"
              style={{ '--tooltip-txt': `'${__('Delete', 'bit-integrations')}'` }}
              onClick={() => setDeletingId(row.original.id)}>
              <TrashIcn size={18} />
            </button>
          </div>
        )
      }
    ],
    [editingId, savingId, cancelEdit, saveRename, startEdit]
  )

  return (
    <div id="connections-page">
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
        <small className="connections-count-txt">
          {__('Showing', 'bit-integrations')} {filteredConnections.length} {__('of', 'bit-integrations')}{' '}
          {connections.length}
        </small>
      </div>

      <div className="forms">
        <Table
          className="f-table btcd-all-frm"
          height="60vh"
          columns={columns}
          data={filteredConnections}
          loading={isLoading}
          countEntries={filteredConnections.length}
          rowSeletable
          resizable
          search
          searchPlaceholder={__('Search connections...', 'bit-integrations')}
          setBulkDelete={setBulkDelete}
          bulkDeleteLabel={__('Delete Connection', 'bit-integrations')}
          topLeftContent={
            <div className="connections-table-filters flx">
              <select
                className="btcd-paper-inp connections-filter-select"
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
                className="icn-btn sh-sm tooltip"
                style={{ '--tooltip-txt': `'${__('Refresh connections', 'bit-integrations')}'` }}
                onClick={fetchConnections}
                disabled={isLoading}
                aria-label={__('Refresh connections', 'bit-integrations')}>
                &#x21BB;
              </button>
            </div>
          }
        />

        {!isLoading && filteredConnections.length === 0 && (
          <p className="txt-center mt-3 connections-empty-note">
            {connections.length === 0
              ? __('No connections saved yet. Authorize an app from any integration to add one.', 'bit-integrations')
              : __('No connections match the current filters.', 'bit-integrations')}
          </p>
        )}
      </div>
    </div>
  )
}
