import { useEffect, useRef, useState } from 'react'
import TrashIcn from '../../Icons/TrashIcn'
import { __ } from '../../Utils/i18nwrap'
import { deleteConnection } from '../../Utils/connectionApi'

const NEW_VALUE = '__new__'

export default function ConnectionAccountSelect({
  connections,
  selectedId,
  onSelect,
  onAddNew,
  isInfo,
  label = __('Account:', 'bit-integrations'),
  newOptionLabel = __('+ Add new connection', 'bit-integrations')
}) {
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
      </div>
    </div>
  )
}
