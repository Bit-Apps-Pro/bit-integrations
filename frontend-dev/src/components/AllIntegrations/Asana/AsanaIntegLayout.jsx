/* eslint-disable no-unused-vars */
import MultiSelect from 'react-multiple-select-dropdown-lite'
import { __ } from '../../../Utils/i18nwrap'
import Loader from '../../Loaders/Loader'
import { getAllSections, getAllProjects, getCustomFields } from './AsanaCommonFunc'
import AsanaFieldMap from './AsanaFieldMap'
import { addFieldMap } from './IntegrationHelpers'
import 'react-multiple-select-dropdown-lite/dist/index.css'

export default function AsanaIntegLayout({ formFields, handleInput, asanaConf, setAsanaConf, loading, setLoading, setSnackbar }) {
  const handleActionInput = (e) => {
    const newConf = { ...asanaConf }
    newConf.field_map = [
      { formField: '', asanaFormField: '' },
    ]
    const { name } = e.target
    if (e.target.value !== '') {
      newConf[name] = e.target.value
      if (e.target.value === 'task') {
        getAllProjects(newConf, setAsanaConf, setLoading)
      }
    } else {
      delete newConf[name]
    }
    setAsanaConf({ ...newConf })
  }

  const setChanges = (val, name) => {
    const newConf = { ...asanaConf }
    newConf[name] = val
    if ((name === 'selectedProject') && val !== '' && (asanaConf.actionName === 'task')) {
      newConf.selectedSections = ''
      getAllSections(newConf, setAsanaConf, setLoading)
      getCustomFields(newConf, setAsanaConf, setLoading)
    }
    setAsanaConf({ ...newConf })
  }
  return (
    <>
      <br />

      <b className="wdt-200 d-in-b">{__('Select Action:', 'bit-integrations')}</b>
      <select onChange={handleActionInput} name="actionName" value={asanaConf.actionName} className="btcd-paper-inp w-5">
        <option value="">{__('Select an action', 'bit-integrations')}</option>
        <option value="task">{__('Create Task', 'bit-integrations')}</option>
      </select>
      {(loading.Projects || loading.Sections) && (
        <Loader style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: 100,
          transform: 'scale(0.7)',
        }}
        />
      )}
      {(asanaConf.actionName === 'task')
        && (
          <>
            <br />
            <br />
            <div className="flx">
              <b className="wdt-200 d-in-b">{__('Select Project:', 'bit-integrations')}</b>

              <MultiSelect
                options={asanaConf?.Projects?.map(Project => ({ label: Project.name, value: Project.id }))}
                className="msl-wrp-options dropdown-custom-width"
                defaultValue={asanaConf?.selectedProject}
                onChange={val => setChanges(val, 'selectedProject')}
                disabled={loading.Projects}
                singleSelect
              />
              <button
                onClick={() => getAllProjects(asanaConf, setAsanaConf, setLoading)}
                className="icn-btn sh-sm ml-2 mr-2 tooltip"
                style={{ '--tooltip-txt': `'${__('Refresh projects', 'bit-integrations')}'` }}
                type="button"
                disabled={loading.Projects}
              >
                &#x21BB;
              </button>
            </div>
          </>
        )}
      {((asanaConf.actionName === 'task') && (asanaConf.selectedProject))
        && (
          <>
            <br />
            <br />
            <div className="flx">
              <b className="wdt-200 d-in-b">{__('Select Section:', 'bit-integrations')}</b>
              <MultiSelect
                options={asanaConf?.Sections?.map(Section => ({ label: Section.name, value: Section.id }))}
                className="msl-wrp-options dropdown-custom-width"
                defaultValue={asanaConf?.selectedSections}
                onChange={val => setChanges(val, 'selectedSections')}
                disabled={loading.Sections}
                singleSelect
              />
              <button
                onClick={() => getAllSections(asanaConf, setAsanaConf, setLoading)}
                className="icn-btn sh-sm ml-2 mr-2 tooltip"
                style={{ '--tooltip-txt': `'${__('Refresh Sections', 'bit-integrations')}'` }}
                type="button"
                disabled={loading.Sections}
              >
                &#x21BB;
              </button>
            </div>
          </>
        )}
      {(loading.customFields) && (
        <Loader style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: 100,
          transform: 'scale(0.7)',
        }}
        />
      )}
      {asanaConf.actionName && (
        <div>
          <br />
          <div className="mt-5">
            <b className="wdt-100">
              {__('Field Map', 'bit-integrations')}
            </b>
            <button
              onClick={() => getCustomFields(asanaConf, setAsanaConf, setLoading)}
              className="icn-btn sh-sm ml-2 mr-2 tooltip"
              style={{ '--tooltip-txt': `'${__('Refresh Fields', 'bit-integrations')}'` }}
              type="button"
              disabled={loading.Sections}
            >
              &#x21BB;
            </button>
          </div>

          <br />
          <div className="btcd-hr mt-1" />
          <div className="flx flx-around mt-2 mb-2 btcbi-field-map-label">
            <div className="txt-dp"><b>{__('Form Fields', 'bit-integrations')}</b></div>
            <div className="txt-dp"><b>{__('Asana Fields', 'bit-integrations')}</b></div>

          </div>

          {asanaConf?.field_map.map((itm, i) => (
            <AsanaFieldMap
              key={`rp-m-${i + 9}`}
              i={i}
              field={itm}
              asanaConf={asanaConf}
              formFields={formFields}
              setAsanaConf={setAsanaConf}
              setSnackbar={setSnackbar}
            />
          ))}
          <div className="txt-center btcbi-field-map-button mt-2"><button onClick={() => addFieldMap(asanaConf.field_map.length, asanaConf, setAsanaConf, false)} className="icn-btn sh-sm" type="button">+</button></div>
          <br />
          <br />
        </div>
      )}
    </>
  )
}
