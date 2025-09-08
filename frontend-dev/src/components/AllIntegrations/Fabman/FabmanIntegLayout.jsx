/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { __ } from '../../../Utils/i18nwrap'
import FabmanFieldMap from './FabmanFieldMap'
import { addFieldMap } from './IntegrationHelpers'
import FabmanActions from './FabmanActions'
import { fetchFabmanWorkspaces, fetchFabmanMembers, generateMappedField } from './FabmanCommonFunc'
import Loader from '../../Loaders/Loader'
import { useEffect } from 'react'

export default function FabmanIntegLayout({
  formFields,
  fabmanConf,
  setFabmanConf,
  loading,
  setLoading,
  setSnackbar
}) {
  useEffect(() => {
    if (
      fabmanConf?.actionName &&
      (fabmanConf?.selectedWorkspace || fabmanConf?.actionName === 'create_spaces') &&
      Array.isArray(fabmanConf.field_map) &&
      fabmanConf.field_map.length === 1 &&
      (fabmanConf.field_map[0].fabmanFormField === '' ||
        fabmanConf.field_map[0].fabmanFormField === undefined)
    ) {
      const newConf = { ...fabmanConf }
      newConf.field_map = generateMappedField({ staticFields: getActiveStaticFields(fabmanConf) })
      setFabmanConf(newConf)
    }
  }, [fabmanConf.actionName, fabmanConf.selectedWorkspace])

  const actions = [
    { label: __('Create Member', 'bit-integrations'), value: 'create_member' },
    { label: __('Update Member', 'bit-integrations'), value: 'update_member' },
    { label: __('Delete Member', 'bit-integrations'), value: 'delete_member' },
    { label: __('Create Spaces', 'bit-integrations'), value: 'create_spaces' },
    { label: __('Update Spaces', 'bit-integrations'), value: 'update_spaces' }
  ]

  const getActiveStaticFields = conf => {
    if (conf.actionName === 'create_spaces' || conf.actionName === 'update_spaces') {
      const fields = Array.isArray(conf.spacesStaticFields)
        ? conf.spacesStaticFields.map(f => ({ ...f }))
        : []
      const isCreate = conf.actionName === 'create_spaces'
      const nameIdx = fields.findIndex(f => String(f.key) === 'name')
      if (nameIdx > -1) fields[nameIdx].required = true
      const tzIdx = fields.findIndex(f => String(f.key) === 'timezone')
      if (tzIdx > -1) fields[tzIdx].required = isCreate
      return fields
    }
    return conf.memberStaticFields
  }

  useEffect(() => {
    const staticFields = getActiveStaticFields(fabmanConf) || []
    const requiredFields = staticFields.filter(f => !!f.required)
    if (!Array.isArray(fabmanConf.field_map)) return

    let changed = false
    const newFieldMap = [...fabmanConf.field_map]

    for (let i = 0; i < requiredFields.length; i += 1) {
      if (!newFieldMap[i]) {
        newFieldMap[i] = { formField: '', fabmanFormField: requiredFields[i].key }
        changed = true
      } else if (newFieldMap[i].fabmanFormField !== requiredFields[i].key) {
        newFieldMap[i] = { ...newFieldMap[i], fabmanFormField: requiredFields[i].key }
        changed = true
      }
    }

    if (changed) {
      const newConf = { ...fabmanConf, field_map: newFieldMap }
      setFabmanConf(newConf)
    }
  }, [fabmanConf.actionName, fabmanConf.selectedWorkspace, fabmanConf.field_map])

  const handleActionChange = e => {
    const newConf = { ...fabmanConf }
    const value = e.target.value
    newConf.actionName = value

    if (value === 'create_spaces' || value === 'update_spaces') {
      delete newConf.selectedMember
      delete newConf.selectedLockVersion
    }

    newConf.field_map = [{ formField: '', fabmanFormField: '' }]

    setFabmanConf(newConf)

    const requiresMemberSelection = value === 'update_member' || value === 'delete_member'
    if (requiresMemberSelection && newConf.selectedWorkspace) {
      fetchFabmanMembers(newConf, setFabmanConf, loading, setLoading, 'fetch')
    }
  }

  const handleWorkspaceChange = e => {
    const newConf = { ...fabmanConf }
    newConf.selectedWorkspace = e.target.value

    const ws = (fabmanConf?.workspaces || []).find(w => String(w.id) === String(e.target.value))
    if (ws && typeof ws.lockVersion !== 'undefined') {
      newConf.selectedLockVersion = ws.lockVersion
    }

    setFabmanConf(newConf)

    const requiresMemberSelection =
      newConf.actionName === 'update_member' || newConf.actionName === 'delete_member'
    if (requiresMemberSelection && newConf.selectedWorkspace) {
      fetchFabmanMembers(newConf, setFabmanConf, loading, setLoading, 'fetch')
    }
  }

  const handleMemberChange = e => {
    const newConf = { ...fabmanConf }
    const selectedValue = e.target.value

    if (selectedValue) {
      const [memberId, lockVersion] = selectedValue.split('|')
      newConf.selectedMember = memberId
      newConf.selectedLockVersion = lockVersion
    } else {
      delete newConf.selectedMember
      delete newConf.selectedLockVersion
    }

    setFabmanConf(newConf)
  }

  const handleRefreshWorkspaces = () => {
    fetchFabmanWorkspaces(fabmanConf, setFabmanConf, loading, setLoading, 'refresh')
  }

  const handleRefreshMembers = () => {
    fetchFabmanMembers(fabmanConf, setFabmanConf, loading, setLoading, 'refresh')
  }

  const requiresMemberSelection =
    fabmanConf.actionName === 'update_member' || fabmanConf.actionName === 'delete_member'

  const isSpaceAction =
    fabmanConf.actionName === 'create_spaces' || fabmanConf.actionName === 'update_spaces'

  const activeStaticFields = getActiveStaticFields(fabmanConf)

  return (
    <div>
      <br />

      <div className="flx">
        <b className="wdt-200 d-in-b">{__('Action:', 'bit-integrations')}</b>
        <select
          onChange={handleActionChange}
          name="actionName"
          value={fabmanConf?.actionName}
          className="btcd-paper-inp w-5">
          <option value="">{__('Select Action', 'bit-integrations')}</option>
          {actions.map(({ label, value }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>
      <br />

      {fabmanConf.actionName && (!isSpaceAction || fabmanConf.actionName === 'update_spaces') && (
        <>
          <div className="flx">
            <b className="wdt-200 d-in-b">{__('Select Workspace:', 'bit-integrations')}</b>
            <select
              onChange={handleWorkspaceChange}
              name="selectedWorkspace"
              value={fabmanConf?.selectedWorkspace || ''}
              className="btcd-paper-inp w-5"
              disabled={loading.workspaces}>
              <option value="">{__('Select Workspace', 'bit-integrations')}</option>
              {fabmanConf?.workspaces?.map(workspace => (
                <option key={workspace.id} value={workspace.id}>
                  {workspace.name}
                </option>
              ))}
            </select>
            <button
              onClick={handleRefreshWorkspaces}
              className="icn-btn sh-sm ml-2 mr-2 tooltip"
              style={{ '--tooltip-txt': `'${__('Refresh Workspaces', 'bit-integrations')}'` }}
              type="button"
              disabled={loading.workspaces}>
              &#x21BB;
            </button>
          </div>

          {loading.workspaces && (
            <Loader
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: 50,
                transform: 'scale(0.7)'
              }}
            />
          )}
          <br />
        </>
      )}

      {requiresMemberSelection && fabmanConf.selectedWorkspace && (
        <>
          <div className="flx">
            <b className="wdt-200 d-in-b">{__('Select Member:', 'bit-integrations')}</b>
            <select
              onChange={handleMemberChange}
              name="selectedMember"
              value={
                fabmanConf?.selectedMember && fabmanConf?.selectedLockVersion
                  ? `${fabmanConf.selectedMember}|${fabmanConf.selectedLockVersion}`
                  : ''
              }
              className="btcd-paper-inp w-5"
              disabled={loading.members}>
              <option value="">{__('Select Member', 'bit-integrations')}</option>
              {fabmanConf?.members?.map(member => (
                <option key={member.id} value={`${member.id}|${member.lockVersion}`}>
                  {member.firstName} {member.lastName} (
                  {member.emailAddress || member.memberNumber || member.id})
                </option>
              ))}
            </select>
            <button
              onClick={handleRefreshMembers}
              className="icn-btn sh-sm ml-2 mr-2 tooltip"
              style={{ '--tooltip-txt': `'${__('Refresh Members', 'bit-integrations')}'` }}
              type="button"
              disabled={loading.members}>
              &#x21BB;
            </button>
          </div>

          {loading.members && (
            <Loader
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: 50,
                transform: 'scale(0.7)'
              }}
            />
          )}
          <br />
        </>
      )}

      {fabmanConf.actionName &&
        fabmanConf.actionName !== 'delete_member' &&
        (!isSpaceAction ||
          (isSpaceAction &&
            (fabmanConf.actionName !== 'update_spaces' || fabmanConf.selectedWorkspace))) && (
          <>
            <div className="mt-5">
              <b className="wdt-100">{__('Field Map', 'bit-integrations')}</b>
            </div>
            <br />
            <div className="btcd-hr mt-1" />
            <div className="flx flx-around mt-2 mb-2 btcbi-field-map-label">
              <div className="txt-dp">
                <b>{__('Form Fields', 'bit-integrations')}</b>
              </div>
              <div className="txt-dp">
                <b>{__('Fabman Fields', 'bit-integrations')}</b>
              </div>
            </div>

            {fabmanConf?.field_map.map((itm, i) => (
              <FabmanFieldMap
                key={`rp-m-${i + 9}`}
                i={i}
                field={itm}
                fabmanConf={{ ...fabmanConf, staticFields: activeStaticFields }}
                formFields={formFields}
                setFabmanConf={setFabmanConf}
                setSnackbar={setSnackbar}
              />
            ))}
            <div>
              <div className="txt-center btcbi-field-map-button mt-2">
                <button
                  onClick={() =>
                    addFieldMap(fabmanConf.field_map.length, fabmanConf, setFabmanConf, false)
                  }
                  className="icn-btn sh-sm"
                  type="button">
                  +
                </button>
              </div>
              <br />
              <br />
              <div className="mt-4">
                <b className="wdt-100">{__('Utilities', 'bit-integrations')}</b>
              </div>
              <div className="btcd-hr mt-1" />
              <FabmanActions
                fabmanConf={fabmanConf}
                setFabmanConf={setFabmanConf}
                loading={loading}
                setLoading={setLoading}
              />
            </div>
          </>
        )}
    </div>
  )
}
