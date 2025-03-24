/* eslint-disable no-unused-vars */
import MultiSelect from 'react-multiple-select-dropdown-lite'
import 'react-multiple-select-dropdown-lite/dist/index.css'
import { __ } from '../../../Utils/i18nwrap'
import Loader from '../../Loaders/Loader'
import { getFields } from './BentoCommonFunc'
import BentoFieldMap from './BentoFieldMap'
import { addFieldMap } from './IntegrationHelpers'
import { create } from 'mutative'
import { useRecoilValue } from 'recoil'
import { $btcbi } from '../../../GlobalStates'
import Note from '../../Utilities/Note'
import BentoActions from './BentoActions'
import { checkIsPro, getProLabel } from '../../Utilities/ProUtilHelpers'

export default function BentoIntegLayout({
  formFields,
  bentoConf,
  setBentoConf,
  loading,
  setLoading,
  isLoading,
  setIsLoading,
  setSnackbar
}) {
  const btcbi = useRecoilValue($btcbi)
  const { isPro } = btcbi

  const setChanges = (val, name) => {
    if (name === 'action' && val !== '') {
      getFields(bentoConf, setBentoConf, val, setLoading)
    }

    setBentoConf(prevConf =>
      create(prevConf, draftConf => {
        draftConf[name] = val
      })
    )
  }

  return (
    <>
      <br />
      <br />
      <div className="flx">
        <b className="wdt-200 d-in-b">{__('Select Action:', 'bit-integrations')}</b>
        <MultiSelect
          className="msl-wrp-options dropdown-custom-width"
          defaultValue={bentoConf?.action}
          onChange={val => setChanges(val, 'action')}
          options={bentoConf.actions?.map(action => ({
            label: checkIsPro(isPro, action.is_pro) ? action.label : getProLabel(action.label),
            value: action.value,
            disabled: checkIsPro(isPro, action.is_pro) ? false : true
          }))}
          singleSelect
          closeOnSelect
        />
      </div>
      <br />
      <br />
      {(isLoading || loading.fields || loading.session) && (
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

      {bentoConf.action && bentoConf.bentoFields && !isLoading && (
        <div>
          <br />
          <div className="mt-5">
            <b className="wdt-100">{__('Field Map', 'bit-integrations')}</b>
            <button
              onClick={() => getFields(bentoConf, setBentoConf, bentoConf.action, setLoading)}
              className="icn-btn sh-sm ml-2 mr-2 tooltip"
              style={{ '--tooltip-txt': `'${__('Refresh fields', 'bit-integrations')}'` }}
              type="button">
              &#x21BB;
            </button>
          </div>

          <br />
          <div className="btcd-hr mt-1" />
          <div className="flx flx-around mt-2 mb-2 btcbi-field-map-label">
            <div className="txt-dp">
              <b>{__('Form Fields', 'bit-integrations')}</b>
            </div>
            <div className="txt-dp">
              <b>{__('Bento Fields', 'bit-integrations')}</b>
            </div>
          </div>

          {bentoConf?.field_map.map((itm, i) => (
            <BentoFieldMap
              key={`rp-m-${i + 9}`}
              i={i}
              field={itm}
              bentoConf={bentoConf}
              formFields={formFields}
              setBentoConf={setBentoConf}
              setSnackbar={setSnackbar}
            />
          ))}
          <div className="txt-center btcbi-field-map-button mt-2">
            <button
              onClick={() => addFieldMap(bentoConf.field_map.length, bentoConf, setBentoConf, false)}
              className="icn-btn sh-sm"
              type="button">
              +
            </button>
          </div>
          <br />
          <br />

          {!isPro &&
            bentoConf.action ===
              'add_people'(
                <Note note={`<p>${__('Custom Fields Available in Pro', 'bit-integrations')}</p>`} />
              )}

          <div className="mt-4">
            <b className="wdt-100">{__('Utilities', 'bit-integrations')}</b>
          </div>
          <div className="btcd-hr mt-1" />

          <BentoActions
            bentoConf={bentoConf}
            setBentoConf={setBentoConf}
            loading={loading}
            setLoading={setLoading}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
            setSnackbar={setSnackbar}
          />
        </div>
      )}
    </>
  )
}
