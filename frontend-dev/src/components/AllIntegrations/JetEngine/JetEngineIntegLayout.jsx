/* eslint-disable react-hooks/exhaustive-deps */
import MultiSelect from 'react-multiple-select-dropdown-lite'
import { __ } from '../../../Utils/i18nwrap'
import JetEngineActions from './JetEngineActions'
import 'react-multiple-select-dropdown-lite/dist/index.css'
import JetEngineFieldMap from './JetEngineFieldMap'
import { addFieldMap } from './IntegrationHelpers'
import {
  getJetEngineCCTList,
  getJetEngineCPTList,
  getJetEngineRelationList,
  getJetEngineRelationTypes,
  getJetEngineTaxList,
  jetEngineStaticFields
} from './jetEngineCommonFunctions'
import { DELETE_LIST_ARRAY, TASK_LIST, TASK_LIST_VALUES } from './jetEngineConstants'
import Loader from '../../Loaders/Loader'
import TableCheckBox from '../../Utilities/TableCheckBox'
import Note from '../../Utilities/Note'

export default function JetEngineIntegLayout({
  formFields,
  jetEngineConf,
  setJetEngineConf,
  loading,
  setLoading,
  setSnackbar
}) {
  const setChanges = (val) => {
    const newConf = { ...jetEngineConf }
    newConf.selectedTask = val

    if (val) {
      const fieldsAndFieldMap = jetEngineStaticFields(val)
      newConf.staticFields = fieldsAndFieldMap.staticFields
      newConf.field_map = fieldsAndFieldMap.fieldMap

      if (val === TASK_LIST_VALUES.CREATE_RELATION) {
        getJetEngineRelationTypes(newConf, setJetEngineConf, loading, setLoading)
      }
      if (val === TASK_LIST_VALUES.UPDATE_POST_TYPE || val === TASK_LIST_VALUES.DELETE_POST_TYPE) {
        getJetEngineCPTList(newConf, setJetEngineConf, loading, setLoading)
      }
      if (
        val === TASK_LIST_VALUES.UPDATE_CONTENT_TYPE ||
        val === TASK_LIST_VALUES.DELETE_CONTENT_TYPE
      ) {
        getJetEngineCCTList(newConf, setJetEngineConf, loading, setLoading)
      }
      if (val === TASK_LIST_VALUES.UPDATE_TAXONOMY || val === TASK_LIST_VALUES.DELETE_TAXONOMY) {
        getJetEngineTaxList(newConf, setJetEngineConf, loading, setLoading)
      }
      if (val === TASK_LIST_VALUES.UPDATE_RELATION || val === TASK_LIST_VALUES.DELETE_RELATION) {
        getJetEngineRelationList(newConf, setJetEngineConf, loading, setLoading)
      }
    } else {
      newConf.staticFields = []
      newConf.field_map = []
    }

    setJetEngineConf({ ...newConf })
  }

  const handleRelationTypeChange = (val, type) => {
    const newConf = { ...jetEngineConf }
    newConf.relOptions[type] = val
    setJetEngineConf({ ...newConf })
  }

  const handleMultiSelectChange = (val, type) => {
    const newConf = { ...jetEngineConf }
    newConf[type] = val
    setJetEngineConf({ ...newConf })
  }

  const handleDeleteFieldMapCheck = (event, type) => {
    const newConf = { ...jetEngineConf }

    if (event.target.checked) {
      newConf.deleteFieldMap[type] = true
    } else {
      newConf.deleteFieldMap[type] = false
    }

    setJetEngineConf({ ...newConf })
  }

  return (
    <>
      <div>
        <div className="flx mt-3 mb-4">
          <b className="wdt-200 d-in-b">{__('Select Task:', 'bit-integrations')}</b>
          <MultiSelect
            style={{ width: '450px' }}
            options={TASK_LIST}
            className="msl-wrp-options"
            defaultValue={jetEngineConf?.selectedTask}
            onChange={(val) => setChanges(val)}
            singleSelect
          />
        </div>

        {(jetEngineConf.selectedTask === TASK_LIST_VALUES.UPDATE_RELATION ||
          jetEngineConf.selectedTask === TASK_LIST_VALUES.DELETE_RELATION) && (
            <div className="flx mt-3 mb-4">
              <b className="wdt-200 d-in-b">{__('Select Relation:', 'bit-integrations')}</b>
              <MultiSelect
                style={{ width: '450px' }}
                options={jetEngineConf?.relationList}
                className="msl-wrp-options"
                defaultValue={jetEngineConf?.relOptions?.selectedRelationForEdit}
                onChange={(val) => handleRelationTypeChange(val, 'selectedRelationForEdit')}
                singleSelect
              />
              <button
                onClick={() =>
                  getJetEngineRelationList(jetEngineConf, setJetEngineConf, loading, setLoading)
                }
                className="icn-btn sh-sm ml-2 mr-2 tooltip"
                style={{ '--tooltip-txt': `'${__('Refresh relation list', 'bit-integrations')}'` }}
                type="button">
                &#x21BB;
              </button>
            </div>
          )}

        {(jetEngineConf.selectedTask === TASK_LIST_VALUES.CREATE_RELATION ||
          jetEngineConf.selectedTask === TASK_LIST_VALUES.UPDATE_RELATION) && (
            <>
              <div className="flx mt-3 mb-4">
                <b className="wdt-200 d-in-b">{__('Parent object:', 'bit-integrations')}</b>
                <MultiSelect
                  style={{ width: '450px' }}
                  options={jetEngineConf?.allRelationTypes}
                  className="msl-wrp-options"
                  defaultValue={jetEngineConf?.relOptions?.parentObject}
                  onChange={(val) => handleRelationTypeChange(val, 'parentObject')}
                  singleSelect
                />
                <button
                  onClick={() =>
                    getJetEngineRelationTypes(jetEngineConf, setJetEngineConf, loading, setLoading)
                  }
                  className="icn-btn sh-sm ml-2 mr-2 tooltip"
                  style={{ '--tooltip-txt': `'${__('Refresh parent objects', 'bit-integrations')}'` }}
                  type="button">
                  &#x21BB;
                </button>
              </div>
              <div className="flx mt-3 mb-4">
                <b className="wdt-200 d-in-b">{__('Child object:', 'bit-integrations')}</b>
                <MultiSelect
                  style={{ width: '450px' }}
                  options={jetEngineConf?.allRelationTypes}
                  className="msl-wrp-options"
                  defaultValue={jetEngineConf?.relOptions?.childObject}
                  onChange={(val) => handleRelationTypeChange(val, 'childObject')}
                  singleSelect
                />
                <button
                  onClick={() =>
                    getJetEngineRelationTypes(jetEngineConf, setJetEngineConf, loading, setLoading)
                  }
                  className="icn-btn sh-sm ml-2 mr-2 tooltip"
                  style={{ '--tooltip-txt': `'${__('Refresh child objects', 'bit-integrations')}'` }}
                  type="button">
                  &#x21BB;
                </button>
              </div>
              <div className="flx mt-3 mb-4">
                <b className="wdt-200 d-in-b">{__('Relation type:', 'bit-integrations')}</b>
                <MultiSelect
                  style={{ width: '450px' }}
                  options={[
                    { label: __('One to one', 'bit-integrations'), value: 'one_to_one' },
                    { label: __('One to many', 'bit-integrations'), value: 'one_to_many' },
                    { label: __('Many to many', 'bit-integrations'), value: 'many_to_many' }
                  ]}
                  className="msl-wrp-options"
                  defaultValue={jetEngineConf?.relOptions?.selectedRelationType}
                  onChange={(val) => handleRelationTypeChange(val, 'selectedRelationType')}
                  singleSelect
                />
              </div>
            </>
          )}

        {(jetEngineConf.selectedTask === TASK_LIST_VALUES.UPDATE_POST_TYPE ||
          jetEngineConf.selectedTask === TASK_LIST_VALUES.DELETE_POST_TYPE) && (
            <div className="flx mt-3 mb-4">
              <b className="wdt-200 d-in-b">{__('Custom Post Type:', 'bit-integrations')}</b>
              <MultiSelect
                style={{ width: '450px' }}
                options={jetEngineConf?.cptList}
                className="msl-wrp-options"
                defaultValue={jetEngineConf?.selectedCPT}
                onChange={(val) => handleMultiSelectChange(val, 'selectedCPT')}
                singleSelect
              />
              <button
                onClick={() =>
                  getJetEngineCPTList(jetEngineConf, setJetEngineConf, loading, setLoading)
                }
                className="icn-btn sh-sm ml-2 mr-2 tooltip"
                style={{ '--tooltip-txt': `'${__('Refresh CPT List', 'bit-integrations')}'` }}
                type="button">
                &#x21BB;
              </button>
            </div>
          )}

        {(jetEngineConf.selectedTask === TASK_LIST_VALUES.UPDATE_CONTENT_TYPE ||
          jetEngineConf.selectedTask === TASK_LIST_VALUES.DELETE_CONTENT_TYPE) && (
            <div className="flx mt-3 mb-4">
              <b className="wdt-200 d-in-b">{__('Custom Content Type:', 'bit-integrations')}</b>
              <MultiSelect
                style={{ width: '450px' }}
                options={jetEngineConf?.cctList}
                className="msl-wrp-options"
                defaultValue={jetEngineConf?.selectedCCT}
                onChange={(val) => handleMultiSelectChange(val, 'selectedCCT')}
                singleSelect
              />
              <button
                onClick={() =>
                  getJetEngineCCTList(jetEngineConf, setJetEngineConf, loading, setLoading)
                }
                className="icn-btn sh-sm ml-2 mr-2 tooltip"
                style={{ '--tooltip-txt': `'${__('Refresh CCT List', 'bit-integrations')}'` }}
                type="button">
                &#x21BB;
              </button>
            </div>
          )}

        {(jetEngineConf.selectedTask === TASK_LIST_VALUES.UPDATE_TAXONOMY ||
          jetEngineConf.selectedTask === TASK_LIST_VALUES.DELETE_TAXONOMY) && (
            <div className="flx mt-3 mb-4">
              <b className="wdt-200 d-in-b">{__('Select Taxonomy:', 'bit-integrations')}</b>
              <MultiSelect
                style={{ width: '450px' }}
                options={jetEngineConf?.taxList}
                className="msl-wrp-options"
                defaultValue={jetEngineConf?.selectedTaxForEdit}
                onChange={(val) => handleMultiSelectChange(val, 'selectedTaxForEdit')}
                singleSelect
              />
              <button
                onClick={() =>
                  getJetEngineTaxList(jetEngineConf, setJetEngineConf, loading, setLoading)
                }
                className="icn-btn sh-sm ml-2 mr-2 tooltip"
                style={{ '--tooltip-txt': `'${__('Refresh Tax List', 'bit-integrations')}'` }}
                type="button">
                &#x21BB;
              </button>
            </div>
          )}

        {(loading.relation_types ||
          loading.cptList ||
          loading.cctList ||
          loading.taxList ||
          loading.relationList) && (
            <Loader
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: 45,
                transform: 'scale(0.5)'
              }}
            />
          )}

        {DELETE_LIST_ARRAY.includes(jetEngineConf.selectedTask) && (
          <>
            <br />
            <div className="flx">
              <span className="action-delete-task-note">
                To delete, you can select from the list above, or you can map fields.
              </span>
              <TableCheckBox
                checked={jetEngineConf.deleteFieldMap[jetEngineConf.selectedTask]}
                onChange={(e) => handleDeleteFieldMapCheck(e, jetEngineConf.selectedTask)}
                className=" ml-2"
                value="delete_field_map"
                title={__('Map Fields', 'bit-integrations')}
              />
            </div>
          </>
        )}

        {(!DELETE_LIST_ARRAY.includes(jetEngineConf.selectedTask) ||
          (DELETE_LIST_ARRAY.includes(jetEngineConf.selectedTask) &&
            jetEngineConf.deleteFieldMap[jetEngineConf.selectedTask])) && (
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
                  <b>{__('JetEngine Fields', 'bit-integrations')}</b>
                </div>
              </div>

              {jetEngineConf?.selectedTask &&
                jetEngineConf?.field_map.map((itm, i) => (
                  <JetEngineFieldMap
                    key={`rp-m-${i + 9}`}
                    i={i}
                    field={itm}
                    jetEngineConf={jetEngineConf}
                    formFields={formFields}
                    setJetEngineConf={setJetEngineConf}
                    setSnackbar={setSnackbar}
                  />
                ))}

              {jetEngineConf?.selectedTask && (
                <div className="txt-center btcbi-field-map-button mt-2">
                  <button
                    onClick={() =>
                      addFieldMap(
                        jetEngineConf.field_map.length,
                        jetEngineConf,
                        setJetEngineConf,
                        false
                      )
                    }
                    className="icn-btn sh-sm"
                    type="button">
                    +
                  </button>
                </div>
              )}
            </>
          )}

        <Note
          note={__('The Jet Engine Action requires user login to perform any of the tasks listed above (as webhook does not indicate whether the user is logged in or not, any trigger that uses webhook will not be functional).', 'bit-integrations')}
        />

        {jetEngineConf.selectedTask &&
          jetEngineConf.selectedTask !== TASK_LIST_VALUES.DELETE_CONTENT_TYPE &&
          jetEngineConf.selectedTask !== TASK_LIST_VALUES.DELETE_RELATION && (
            <div>
              <br />
              <br />
              <div className="mt-4">
                <b className="wdt-100">{__('Utilities', 'bit-integrations')}</b>
              </div>
              <div className="btcd-hr mt-1" />
              <JetEngineActions
                jetEngineConf={jetEngineConf}
                setJetEngineConf={setJetEngineConf}
                loading={loading}
                setLoading={setLoading}
              />
            </div>
          )}
      </div>
    </>
  )
}
