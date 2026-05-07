import { useParams } from 'react-router'
import { __ } from '../../Utils/i18nwrap'
import MultiSelect from 'react-multiple-select-dropdown-lite'
import 'react-multiple-select-dropdown-lite/dist/index.css'

const NEW_VALUE = '__new__'

export default function ConnectionAccountSelect({
  config,
  setConfig,
  connections,
  setShowNewConnection,
  isInfo,
}) {
  const { integUrlName } = useParams()

  const handleChange = value => {

    if (value === NEW_VALUE) {
      setShowNewConnection(true)
      return
    }
    setShowNewConnection(false)
    setConfig(prev => ({ ...prev, connection_id: value }))
  }

  const dropdownValue = config?.connection_id ? String(config.connection_id) : ''

  const options = [
    ...(Array.isArray(connections) ? connections?.map(conn => {
      const accountName = conn.account_name || conn.connection_name
      const label =
        conn.connection_name && conn.account_name && conn.connection_name !== conn.account_name
          ? `${conn.connection_name} (${accountName})`
          : conn.connection_name || accountName

      return {
        label,
        value: String(conn.id)
      }
    }) : []),
    { label: __('+ Add new connection', 'bit-integrations'), value: NEW_VALUE }
  ]

  return (
    <div className="connection-select-wrap">
      <div className="mt-3">
        <b>{integUrlName ? `${integUrlName} ${__('Connections:', 'bit-integrations')}` : __('Connections:', 'bit-integrations')}</b>
      </div>
      <div className="flx mt-1" style={{ gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
        <MultiSelect
          className="btcd-paper-drpdwn msl-wrp-options w-6"
          defaultValue={dropdownValue}
          options={options}
          onChange={handleChange}
          singleSelect
          closeOnSelect
          showSearch
          placeholder={__('Select a connection...', 'bit-integrations')}
          disabled={isInfo}
        />
      </div>
    </div>
  )
}
