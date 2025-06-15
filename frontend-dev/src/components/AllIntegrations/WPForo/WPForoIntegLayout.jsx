/* eslint-disable react-hooks/exhaustive-deps */
import MultiSelect from 'react-multiple-select-dropdown-lite'
import { __ } from '../../../Utils/i18nwrap'
import WPForoActions from './WPForoActions'
import 'react-multiple-select-dropdown-lite/dist/index.css'

import WPForoFieldMap from './WPForoFieldMap'
import { addFieldMap } from './IntegrationHelpers'
import { getWPForoTopics, wpforoStaticFields } from './WPForoCommonFunc'
import { TASK_LIST, TASK_LIST_VALUES } from './wpforoConstants'
import Loader from '../../Loaders/Loader'
import TableCheckBox from '../../Utilities/TableCheckBox'

export default function WPForoIntegLayout({
  formFields,
  wpforoConf,
  setWPForoConf,
  loading,
  setLoading,
  setSnackbar
}) {
  const setChanges = (val) => {
    const newConf = { ...wpforoConf }
    newConf.selectedTask = val

    if (val) {
      if (val === TASK_LIST_VALUES.DELETE_TOPIC) {
        getWPForoTopics(newConf, setWPForoConf, loading, setLoading)
      }
      const fieldsAndFieldMap = wpforoStaticFields(val)
      newConf.staticFields = fieldsAndFieldMap.staticFields
      newConf.field_map = fieldsAndFieldMap.fieldMap
    } else {
      newConf.staticFields = []
      newConf.field_map = []
    }

    setWPForoConf({ ...newConf })
  }

  const handleTopicChange = (val) => {
    const newConf = { ...wpforoConf }
    newConf.selectedTopic = val
    setWPForoConf({ ...newConf })
  }

  const handleDeleteTopicFieldMapCheck = (event) => {
    const newConf = { ...wpforoConf }

    if (event.target.checked) {
      newConf.deleteTopicFieldMap = true
    } else {
      newConf.deleteTopicFieldMap = false
    }

    setWPForoConf({ ...newConf })
  }

  return (
    <>
      <div>
        <div className="flx mt-3">
          <b className="wdt-200 d-in-b">{__('Select Task:', 'bit-integrations')}</b>
          <MultiSelect
            style={{ width: '450px' }}
            options={TASK_LIST}
            className="msl-wrp-options"
            defaultValue={wpforoConf?.selectedTask}
            onChange={(val) => setChanges(val)}
            singleSelect
          />
        </div>
        <br />
        {wpforoConf.selectedTask === TASK_LIST_VALUES.DELETE_TOPIC && (
          <>
            {loading.topics && (
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
            <div className="flx mt-3 mb-4">
              <b className="wdt-200 d-in-b">{__('Select Topic:', 'bit-integrations')}</b>
              <MultiSelect
                style={{ width: '450px' }}
                options={wpforoConf?.topics}
                className="msl-wrp-options"
                defaultValue={wpforoConf?.selectedTopic}
                onChange={(val) => handleTopicChange(val)}
                singleSelect
              />
              <button
                onClick={() => getWPForoTopics(wpforoConf, setWPForoConf, loading, setLoading)}
                className="icn-btn sh-sm ml-2 mr-2 tooltip"
                style={{ '--tooltip-txt': `${__('Refresh topics', 'bit-integrations')}'` }}
                type="button">
                &#x21BB;
              </button>
            </div>
            <br />
            <div className="flx">
              <span className="action-delete-task-note">
                {__(
                  'To delete a topic, you can select a topic from the list above, or you can map fields',
                  'bit-integrations'
                )}
              </span>
              <TableCheckBox
                checked={wpforoConf.deleteTopicFieldMap}
                onChange={(e) => handleDeleteTopicFieldMapCheck(e)}
                className=" ml-2"
                value="select_group"
                title={__('Map Fields', 'bit-integrations')}
              />
            </div>
            <br />
          </>
        )}

        {(wpforoConf.selectedTask !== TASK_LIST_VALUES.DELETE_TOPIC ||
          (wpforoConf.selectedTask === TASK_LIST_VALUES.DELETE_TOPIC &&
            wpforoConf.deleteTopicFieldMap)) && (
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
                <b>{__('WPForo Fields', 'bit-integrations')}</b>
              </div>
            </div>
          </>
        )}

        {((wpforoConf?.selectedTask &&
          wpforoConf?.selectedTask !== TASK_LIST_VALUES.DELETE_TOPIC) ||
          (wpforoConf.selectedTask === TASK_LIST_VALUES.DELETE_TOPIC &&
            wpforoConf.deleteTopicFieldMap)) &&
          wpforoConf?.field_map.map((itm, i) => (
            <WPForoFieldMap
              key={`rp-m-${i + 9}`}
              i={i}
              field={itm}
              wpforoConf={wpforoConf}
              formFields={formFields}
              setWPForoConf={setWPForoConf}
              setSnackbar={setSnackbar}
            />
          ))}

        {((wpforoConf?.selectedTask &&
          wpforoConf?.selectedTask !== TASK_LIST_VALUES.DELETE_TOPIC) ||
          (wpforoConf.selectedTask === TASK_LIST_VALUES.DELETE_TOPIC &&
            wpforoConf.deleteTopicFieldMap)) && (
          <div>
            <div className="txt-center btcbi-field-map-button mt-2">
              <button
                onClick={() =>
                  addFieldMap(wpforoConf.field_map.length, wpforoConf, setWPForoConf, false)
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
            <WPForoActions
              wpforoConf={wpforoConf}
              setWPForoConf={setWPForoConf}
              loading={loading}
              setLoading={setLoading}
            />
          </div>
        )}
      </div>
    </>
  )
}
