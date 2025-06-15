/* eslint-disable no-unused-vars */
import { create } from 'mutative'
import MultiSelect from 'react-multiple-select-dropdown-lite'
import 'react-multiple-select-dropdown-lite/dist/index.css'
import { __ } from '../../../Utils/i18nwrap'
import Loader from '../../Loaders/Loader'
import { addFieldMap } from './IntegrationHelpers'
import WoodpeckerActions from './WoodpeckerActions'
import { generateMappedField, getAllCampaign } from './WoodpeckerCommonFunc'
import WoodpeckerFieldMap from './WoodpeckerFieldMap'

export default function WoodpeckerIntegLayout({ formFields, handleInput, woodpeckerConf, setWoodpeckerConf, loading, setLoading, isLoading, setIsLoading, setSnackbar }) {
  const handleActionInput = (e) => {
    setWoodpeckerConf(prevConf => create(prevConf, (draftConf) => {
      const { name } = e.target

      if (e.target.value !== '') {
        draftConf.actionName = e.target.value

        if (draftConf.actionName === "adding_prospects_to_the_prospects_list" || draftConf.actionName === "adding_prospects_to_the_campaign") {
          draftConf.woodpeckerAllFields = draftConf.prospectsFields

          if (draftConf.actionName === "adding_prospects_to_the_campaign") {
            getAllCampaign(draftConf, setWoodpeckerConf, loading, setLoading)
          }
        } else {
          draftConf.woodpeckerAllFields = draftConf.companyFields
        }
        draftConf.field_map = generateMappedField(draftConf);
      } else {
        delete draftConf[name]
      }
    }))
  }

  const setChanges = (val, name) => {
    const newConf = { ...woodpeckerConf }
    newConf[name] = val

    if (name === 'selectedPipeline') {
      woodpeckerConf?.pipelines.forEach(pipeline => {
        if (pipeline.id.toString() === val) {
          newConf.stages = pipeline.stages
        }
      })
    }

    setWoodpeckerConf({ ...newConf })
  }

  return (
    <>
      <br />

      <b className="wdt-200 d-in-b">{__('Select Action:', 'bit-integrations')}</b>
      <select onChange={handleActionInput} name="actionName" value={woodpeckerConf.actionName} className="btcd-paper-inp w-5">
        <option value="">{__('Select an action', 'bit-integrations')}</option>
        <option value="adding_prospects_to_the_prospects_list" data-action_name="Adding prospects to the Prospects list">{__('Adding prospects to the Prospects list', 'bit-integrations')}</option>
        <option value="adding_prospects_to_the_campaign" data-action_name="Adding prospects to the Campaign">{__('Adding prospects to the Campaign', 'bit-integrations')}</option>
        <option value="create_company" data-action_name="Create Company">{__('Create Company', 'bit-integrations')}</option>
      </select>
      <br />
      {loading.campaign && (
        <Loader style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: 100,
          transform: 'scale(0.7)',
        }}
        />
      )}
      {woodpeckerConf.actionName === 'adding_prospects_to_the_campaign' && woodpeckerConf?.campaigns && !loading.campaign
        && (
          <>
            <br />
            <div className="flx">
              <b className="wdt-200 d-in-b">{__('Select Campaign:', 'bit-integrations')}</b>
              <MultiSelect
                options={woodpeckerConf?.campaigns.map(campaign => ({ label: campaign.name, value: campaign.id.toString() }))}
                className="msl-wrp-options dropdown-custom-width"
                defaultValue={woodpeckerConf?.selectedCampaign}
                onChange={val => setChanges(val, 'selectedCampaign')}
                disabled={loading.campaign}
                singleSelect
                closeOnSelect
              />
              <button
                onClick={() => getAllCampaign(woodpeckerConf, setWoodpeckerConf, loading, setLoading)}
                className="icn-btn sh-sm ml-2 mr-2 tooltip"
                style={{ '--tooltip-txt': `'${__('Refresh Campaigns', 'bit-integrations')}'` }}
                type="button"
                disabled={loading.campaign}
              >
                &#x21BB;
              </button>
            </div>
          </>
        )}

      {isLoading && (
        <Loader style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: 100,
          transform: 'scale(0.7)',
        }}
        />
      )}
      {woodpeckerConf.actionName && !isLoading && (
        <div>
          <br />
          <div className="mt-5">
            <b className="wdt-100">
              {__('Field Map', 'bit-integrations')}
            </b>
          </div>

          <br />
          <div className="btcd-hr mt-1" />
          <div className="flx flx-around mt-2 mb-2 btcbi-field-map-label">
            <div className="txt-dp"><b>{__('Form Fields', 'bit-integrations')}</b></div>
            <div className="txt-dp"><b>{__('Woodpecker Fields', 'bit-integrations')}</b></div>
          </div>

          {woodpeckerConf?.field_map.map((itm, i) => (
            <WoodpeckerFieldMap
              key={`rp-m-${i + 9}`}
              i={i}
              field={itm}
              woodpeckerConf={woodpeckerConf}
              formFields={formFields}
              setWoodpeckerConf={setWoodpeckerConf}
              setSnackbar={setSnackbar}
            />
          ))}
          <div className="txt-center btcbi-field-map-button mt-2"><button onClick={() => addFieldMap(woodpeckerConf.field_map.length, woodpeckerConf, setWoodpeckerConf, false)} className="icn-btn sh-sm" type="button">+</button></div>
          <br />
          <br />
          <div className="mt-4"><b className="wdt-100">{__('Actions', 'bit-integrations')}</b></div>
          <div className="btcd-hr mt-1" />
          <WoodpeckerActions
            woodpeckerConf={woodpeckerConf}
            setWoodpeckerConf={setWoodpeckerConf}
          />
        </div>
      )}
    </>
  )
}

