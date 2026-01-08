import { create } from 'mutative'
import MultiSelect from 'react-multiple-select-dropdown-lite'
import { useRecoilValue } from 'recoil'
import { $btcbi } from '../../../GlobalStates'
import { __ } from '../../../Utils/i18nwrap'
import Loader from '../../Loaders/Loader'
import { checkIsPro, getProLabel } from '../../Utilities/ProUtilHelpers'
import { addFieldMap } from '../IntegrationHelpers/IntegrationHelpers'
import {
  generateMappedField,
  refreshTeamsForWcMemberRoles,
  refreshTeamsForWcTeams
} from './TeamsForWooCommerceMembershipsCommonFunc'
import TeamsForWooCommerceMembershipsFieldMap from './TeamsForWooCommerceMembershipsFieldMap'
import { modules } from './staticData'

export default function TeamsForWooCommerceMembershipsIntegLayout({
  formID,
  formFields,
  teamsForWcConf,
  setTeamsForWcConf,
  isLoading,
  setIsLoading,
  setSnackbar
}) {
  const btcbi = useRecoilValue($btcbi)
  const { isPro } = btcbi

  const handleMainAction = value => {
    setTeamsForWcConf(prevConf =>
      create(prevConf, draftConf => {
        draftConf.mainAction = value

        draftConf.teamsForWooCommerceMembershipsFields = [
          { key: 'user_email', label: __('User Email', 'bit-integrations'), required: true }
        ]

        draftConf.field_map = generateMappedField(draftConf.teamsForWooCommerceMembershipsFields)
      })
    )

    refreshTeamsForWcTeams(setTeamsForWcConf, setIsLoading)

    if (!['add_member_to_team', 'invite_user_to_team', 'update_member_role'].includes(value)) {
      refreshTeamsForWcMemberRoles(setTeamsForWcConf, setIsLoading)
    }
  }

  return (
    <>
      <br />
      <div className="flx">
        <b className="wdt-200 d-in-b">{__('Action:', 'bit-integrations')}</b>
        <MultiSelect
          title="mainAction"
          defaultValue={teamsForWcConf?.mainAction ?? null}
          className="mt-2 w-5"
          onChange={value => handleMainAction(value)}
          options={modules?.map(action => ({
            label: checkIsPro(isPro, action.is_pro) ? action.label : getProLabel(action.label),
            value: action.name,
            disabled: checkIsPro(isPro, action.is_pro) ? false : true
          }))}
          singleSelect
          closeOnSelect
        />
      </div>

      {teamsForWcConf?.mainAction && (
        <>
          <br />
          <div className="flx">
            <b className="wdt-200 d-in-b">{__('Select Team:', 'bit-integrations')}</b>
            <MultiSelect
              title="selectedTeam"
              defaultValue={teamsForWcConf?.selectedTeam ?? null}
              className="btcd-paper-drpdwn w-5"
              options={
                teamsForWcConf?.allTeams &&
                Array.isArray(teamsForWcConf.allTeams) &&
                teamsForWcConf.allTeams.map(team => ({
                  label: team.team_name,
                  value: team.team_id.toString()
                }))
              }
              onChange={val =>
                setTeamsForWcConf(prevConf =>
                  create(prevConf, draftConf => {
                    draftConf.selectedTeam = val
                  })
                )
              }
              singleSelect
              closeOnSelect
            />
            <button
              onClick={() => refreshTeamsForWcTeams(setTeamsForWcConf, setIsLoading)}
              className="icn-btn sh-sm ml-2 mr-2 tooltip"
              style={{ '--tooltip-txt': `'${__('Refresh Teams', 'bit-integrations')}'` }}
              type="button"
              disabled={isLoading}>
              &#x21BB;
            </button>
          </div>
        </>
      )}

      {['add_member_to_team', 'invite_user_to_team', 'update_member_role'].includes(
        teamsForWcConf?.mainAction
      ) && (
        <>
          <br />
          <div className="flx">
            <b className="wdt-200 d-in-b">{__('Member Role:', 'bit-integrations')}</b>
            <MultiSelect
              title="selectedMemberRole"
              defaultValue={teamsForWcConf?.selectedMemberRole ?? null}
              className="btcd-paper-drpdwn w-5"
              options={
                teamsForWcConf?.allMemberRoles &&
                Array.isArray(teamsForWcConf.allMemberRoles) &&
                teamsForWcConf.allMemberRoles.map(role => ({
                  label: role.label,
                  value: role.value
                }))
              }
              onChange={val =>
                setTeamsForWcConf(prevConf =>
                  create(prevConf, draftConf => {
                    draftConf.selectedMemberRole = val
                  })
                )
              }
              singleSelect
              closeOnSelect
            />
            <button
              onClick={() => refreshTeamsForWcMemberRoles(setTeamsForWcConf, setIsLoading)}
              className="icn-btn sh-sm ml-2 mr-2 tooltip"
              style={{ '--tooltip-txt': `'${__('Refresh Member Roles', 'bit-integrations')}'` }}
              type="button"
              disabled={isLoading}>
              &#x21BB;
            </button>
          </div>
        </>
      )}

      {isLoading && (
        <Loader
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: 100,
            transform: 'scale(0.7)'
          }}
        />
      )}

      {teamsForWcConf?.mainAction && teamsForWcConf.teamsForWooCommerceMembershipsFields && (
        <div className="mt-4">
          <b className="wdt-100">{__('Map Fields', 'bit-integrations')}</b>
          <div className="btcd-hr mt-1" />
          <div className="flx flx-around mt-2 mb-2 btcbi-field-map-label">
            <div className="txt-dp">
              <b>{__('Form Fields', 'bit-integrations')}</b>
            </div>
            <div className="txt-dp">
              <b>{__('Teams for WooCommerce Memberships Fields', 'bit-integrations')}</b>
            </div>
          </div>

          {teamsForWcConf?.field_map?.map((itm, i) => (
            <TeamsForWooCommerceMembershipsFieldMap
              key={`teams-wc-m-${i + 9}`}
              i={i}
              field={itm}
              teamsForWcConf={teamsForWcConf}
              formFields={formFields}
              setTeamsForWcConf={setTeamsForWcConf}
            />
          ))}
          <div className="txt-center btcbi-field-map-button mt-2">
            <button
              onClick={() =>
                addFieldMap(teamsForWcConf.field_map.length, teamsForWcConf, setTeamsForWcConf)
              }
              className="icn-btn sh-sm"
              type="button">
              +
            </button>
          </div>
          <br />
        </div>
      )}
    </>
  )
}
