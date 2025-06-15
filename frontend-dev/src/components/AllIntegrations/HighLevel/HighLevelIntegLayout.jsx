// eslint-disable-next-line import/no-extraneous-dependencies
import { __ } from '../../../Utils/i18nwrap'
import Loader from '../../Loaders/Loader'
import { addFieldMap } from '../IntegrationHelpers/IntegrationHelpers'
import {
  getCustomFields,
  highLevelStaticFields,
  getContacts,
  getUsers,
  getHLTasks,
  getPipelines,
  getOpportunities
} from './HighLevelCommonFunc'
import HighLevelFieldMap from './HighLevelFieldMap'
import HighLevelActions from './HighLevelAction'
import MultiSelect from 'react-multiple-select-dropdown-lite'
import 'react-multiple-select-dropdown-lite/dist/index.css'
import { OPTIONAL_FIELD_MAP_ARRAY, TASK_LIST, TASK_LIST_VALUES } from './highlevelConstants'

export default function HighLevelIntegLayout({
  formFields,
  highLevelConf,
  setHighLevelConf,
  loading,
  setLoading
}) {
  const setChanges = (val) => {
    const newConf = highLevelConf
    newConf.selectedTask = val

    if (val) {
      const fieldsAndFieldMap = highLevelStaticFields(val)
      newConf.highLevelFields = fieldsAndFieldMap.staticFields
      newConf.field_map = fieldsAndFieldMap.fieldMap

      if (val === TASK_LIST_VALUES.CREATE_CONTACT) {
        getCustomFields(newConf, setHighLevelConf, loading, setLoading)
      } else if (
        val === TASK_LIST_VALUES.UPDATE_CONTACT ||
        val === TASK_LIST_VALUES.CREATE_TASK ||
        val === TASK_LIST_VALUES.UPDATE_TASK
      ) {
        getContacts(newConf, setHighLevelConf, loading, setLoading)
      } else if (
        val === TASK_LIST_VALUES.CREATE_OPPORTUNITY ||
        val === TASK_LIST_VALUES.UPDATE_OPPORTUNITY
      ) {
        getPipelines(newConf, setHighLevelConf, loading, setLoading)
      }
    } else {
      newConf.highLevelFields = []
      newConf.field_map = []
    }

    setHighLevelConf({ ...newConf })
  }

  const handleMultiSelectChange = (val, type) => {
    const newConf = { ...highLevelConf }
    newConf[type] = val

    if (
      val &&
      newConf.selectedTask === TASK_LIST_VALUES.UPDATE_TASK &&
      type === 'selectedContact'
    ) {
      getHLTasks(newConf, setHighLevelConf, loading, setLoading)
    }

    if (val && type === 'selectedPipeline') {
      newConf.selectedStage = ''
      newConf.selectedOpportunity = ''
      const stageList = newConf.stages[val].map((stage) => ({ label: stage.name, value: stage.id }))
      newConf.currentStages = stageList

      if (highLevelConf.selectedTask === TASK_LIST_VALUES.UPDATE_OPPORTUNITY) {
        getOpportunities(newConf, setHighLevelConf, loading, setLoading)
      }
    }

    if (!val && type === 'selectedPipeline') {
      newConf.selectedStage = ''
      newConf.selectedOpportunity = ''
    }

    setHighLevelConf({ ...newConf })
  }

  const getStatusOptions = () => {
    if (
      highLevelConf.selectedTask === TASK_LIST_VALUES.CREATE_TASK ||
      highLevelConf.selectedTask === TASK_LIST_VALUES.UPDATE_TASK
    ) {
      return [
        { label: 'Incompleted', value: 'incompleted' },
        { label: 'Completed', value: 'completed' }
      ]
    }

    return [
      { label: 'Open', value: 'open' },
      { label: 'Won', value: 'won' },
      { label: 'Lost', value: 'lost' },
      { label: 'Abandoned', value: 'abandoned' }
    ]
  }

  return (
    <>
      <br />
      <div className="flx mt-3 mb-4">
        <b className="wdt-200 d-in-b">{__('Select Task:', 'bit-integrations')}</b>
        <MultiSelect
          style={{ width: '450px' }}
          options={TASK_LIST}
          className={`msl-wrp-options ${!highLevelConf.selectedTask ? 'height-s' : ''}`}
          defaultValue={highLevelConf?.selectedTask}
          onChange={(val) => setChanges(val)}
          singleSelect
        />
      </div>

      {(highLevelConf.selectedTask === TASK_LIST_VALUES.CREATE_OPPORTUNITY ||
        highLevelConf.selectedTask === TASK_LIST_VALUES.UPDATE_OPPORTUNITY) && (
        <>
          <div className="flx mt-3 mb-4">
            <b className="wdt-200 d-in-b">{__('Select Pipeline:', 'bit-integrations')}</b>
            <MultiSelect
              style={{ width: '450px' }}
              options={highLevelConf.pipelines}
              className="msl-wrp-options"
              defaultValue={highLevelConf?.selectedPipeline}
              onChange={(val) => handleMultiSelectChange(val, 'selectedPipeline')}
              disabled={loading.pipelines || loading.contacts || loading.users}
              singleSelect
            />
            <button
              onClick={() => getPipelines(highLevelConf, setHighLevelConf, loading, setLoading)}
              className="icn-btn sh-sm ml-2 mr-2 tooltip"
              style={{ '--tooltip-txt': `'${__('Refresh pipeline list', 'bit-integrations')}'` }}
              disabled={loading.contacts || loading.pipelines}
              type="button">
              &#x21BB;
            </button>
          </div>
          <div className="flx mt-3 mb-4">
            <b className="wdt-200 d-in-b">{__('Select Stage:', 'bit-integrations')}</b>
            <MultiSelect
              style={{ width: '450px' }}
              options={highLevelConf.currentStages}
              className="msl-wrp-options"
              defaultValue={highLevelConf?.selectedStage}
              onChange={(val) => handleMultiSelectChange(val, 'selectedStage')}
              disabled={!highLevelConf.selectedPipeline}
              singleSelect
            />
          </div>
        </>
      )}

      {highLevelConf.selectedTask === TASK_LIST_VALUES.UPDATE_OPPORTUNITY && (
        <div className="flx mt-3 mb-4">
          <b className="wdt-200 d-in-b">{__('Select Opportunity:', 'bit-integrations')}</b>
          <MultiSelect
            style={{ width: '450px' }}
            options={highLevelConf.opportunities}
            className="msl-wrp-options"
            defaultValue={highLevelConf?.selectedOpportunity}
            onChange={(val) => handleMultiSelectChange(val, 'selectedOpportunity')}
            disabled={!highLevelConf.selectedPipeline || loading.opportunities}
            singleSelect
          />
          <button
            onClick={() => getOpportunities(highLevelConf, setHighLevelConf, loading, setLoading)}
            className="icn-btn sh-sm ml-2 mr-2 tooltip"
            style={{ '--tooltip-txt': `'${__('Refresh opportunity list', 'bit-integrations')}'` }}
            disabled={
              !highLevelConf.selectedPipeline ||
              loading.contacts ||
              loading.pipelines ||
              loading.opportunities
            }
            type="button">
            &#x21BB;
          </button>
        </div>
      )}

      {(highLevelConf.selectedTask === TASK_LIST_VALUES.UPDATE_CONTACT ||
        highLevelConf.selectedTask === TASK_LIST_VALUES.CREATE_TASK ||
        highLevelConf.selectedTask === TASK_LIST_VALUES.UPDATE_TASK ||
        highLevelConf.selectedTask === TASK_LIST_VALUES.CREATE_OPPORTUNITY ||
        highLevelConf.selectedTask === TASK_LIST_VALUES.UPDATE_OPPORTUNITY) && (
        <div className="flx mt-3 mb-4">
          <b className="wdt-200 d-in-b">{__('Select Contact:', 'bit-integrations')}</b>
          <MultiSelect
            style={{ width: '450px' }}
            options={highLevelConf.contacts}
            className="msl-wrp-options"
            defaultValue={highLevelConf?.selectedContact}
            onChange={(val) => handleMultiSelectChange(val, 'selectedContact')}
            singleSelect
          />
          <button
            onClick={() => getContacts(highLevelConf, setHighLevelConf, loading, setLoading)}
            className="icn-btn sh-sm ml-2 mr-2 tooltip"
            style={{ '--tooltip-txt': `'${__('Refresh contact list', 'bit-integrations')}'` }}
            disabled={loading.contacts}
            type="button">
            &#x21BB;
          </button>
        </div>
      )}

      {highLevelConf.selectedTask === TASK_LIST_VALUES.UPDATE_TASK && (
        <div className="flx mt-3 mb-4">
          <b className="wdt-200 d-in-b">{__('Select Task:', 'bit-integrations')}</b>
          <MultiSelect
            style={{ width: '450px' }}
            options={highLevelConf.hlTasks}
            className="msl-wrp-options"
            defaultValue={highLevelConf?.updateTaskId}
            onChange={(val) => handleMultiSelectChange(val, 'updateTaskId')}
            disabled={!highLevelConf.selectedContact || loading.contacts || loading.hlTasks}
            singleSelect
          />
          <button
            onClick={() => getHLTasks(highLevelConf, setHighLevelConf, loading, setLoading)}
            className="icn-btn sh-sm ml-2 mr-2 tooltip"
            style={{ '--tooltip-txt': `'${__('Refresh task list', 'bit-integrations')}'` }}
            disabled={
              !highLevelConf.selectedContact || loading.contacts || loading.users || loading.hlTasks
            }
            type="button">
            &#x21BB;
          </button>
        </div>
      )}

      {(highLevelConf.selectedTask === TASK_LIST_VALUES.CREATE_TASK ||
        highLevelConf.selectedTask === TASK_LIST_VALUES.UPDATE_TASK ||
        highLevelConf.selectedTask === TASK_LIST_VALUES.CREATE_OPPORTUNITY ||
        highLevelConf.selectedTask === TASK_LIST_VALUES.UPDATE_OPPORTUNITY) && (
        <>
          <div className="flx mt-3 mb-4">
            <b className="wdt-200 d-in-b">{__('Select Assignee:', 'bit-integrations')}</b>
            <MultiSelect
              style={{ width: '450px' }}
              options={highLevelConf.users}
              className="msl-wrp-options"
              defaultValue={highLevelConf?.selectedUser}
              onChange={(val) => handleMultiSelectChange(val, 'selectedUser')}
              singleSelect
            />
            <button
              onClick={() => getUsers(highLevelConf, setHighLevelConf, loading, setLoading)}
              className="icn-btn sh-sm ml-2 mr-2 tooltip"
              style={{ '--tooltip-txt': `'${__('Refresh assignee list', 'bit-integrations')}'` }}
              disabled={loading.contacts || loading.users}
              type="button">
              &#x21BB;
            </button>
          </div>
          <div className="flx mt-3 mb-4">
            <b className="wdt-200 d-in-b">{__('Select Status:', 'bit-integrations')}</b>
            <MultiSelect
              style={{ width: '450px' }}
              options={getStatusOptions()}
              className="msl-wrp-options"
              defaultValue={highLevelConf?.selectedTaskStatus}
              onChange={(val) => handleMultiSelectChange(val, 'selectedTaskStatus')}
              singleSelect
            />
          </div>
        </>
      )}

      {(loading.accounts ||
        loading.customFields ||
        loading.contacts ||
        loading.users ||
        loading.hlTasks ||
        loading.pipelines ||
        loading.opportunities) && (
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

      {OPTIONAL_FIELD_MAP_ARRAY.includes(highLevelConf.selectedTask) && (
        <>
          <span className="action-delete-task-note">
            {__(
              'To update, you can select from the list above, or you can map fields. If not selected, ID field mapping is required.',
              'bit-integrations'
            )}
          </span>
        </>
      )}

      {highLevelConf.selectedTask === TASK_LIST_VALUES.CREATE_TASK && (
        <span className="action-delete-task-note">
          {__(
            'To create, you can select contact from the list above, or you can map fields. If not selected, "Contact ID" field mapping is required.',
            'bit-integrations'
          )}
        </span>
      )}

      {(highLevelConf.selectedTask === TASK_LIST_VALUES.CREATE_OPPORTUNITY ||
        highLevelConf.selectedTask === TASK_LIST_VALUES.UPDATE_OPPORTUNITY) && (
        <span className="action-delete-task-note">
          {__(
            'Either a Select Contact, Email, or Phone Number is required. For Contact you can select from the list above, or you can map field (Contact ID).',
            'bit-integrations'
          )}
        </span>
      )}

      {highLevelConf.selectedTask === TASK_LIST_VALUES.UPDATE_OPPORTUNITY && (
        <>
          <br />
          <br />
          <span className="action-delete-task-note">
            {__(
              'To update, you can select opportunity from the list above, or you can map field.  If not selected, "Opportunity ID" field mapping is required.',
              'bit-integrations'
            )}
          </span>
        </>
      )}

      {highLevelConf.selectedTask === TASK_LIST_VALUES.UPDATE_TASK && (
        <>
          <span className="action-delete-task-note">
            {__(
              'To update, you can select contact from the list above, or you can map fields. If not selected, "Contact ID" field mapping is required.',
              'bit-integrations'
            )}
          </span>
          <br />
          <br />
          <span className="action-delete-task-note">
            {__(
              'You can select task from the list above, or you can map fields. If not selected, "Task ID" field mapping is required. To enable task selection, choose a contact first.',
              'bit-integrations'
            )}
          </span>
        </>
      )}

      <br />
      <div className="mt-4">
        <b className="wdt-100">{__('Map Fields', 'bit-integrations')}</b>
        {(highLevelConf?.selectedTask === TASK_LIST_VALUES.CREATE_CONTACT ||
          highLevelConf?.selectedTask === TASK_LIST_VALUES.UPDATE_CONTACT) && (
          <button
            onClick={() => getCustomFields(highLevelConf, setHighLevelConf, loading, setLoading)}
            className="icn-btn sh-sm ml-2 mr-2 tooltip"
            style={{ '--tooltip-txt': `'${__('Refresh custom fields', 'bit-integrations')}'` }}
            type="button"
            disabled={loading.customFields || loading.contacts}>
            &#x21BB;
          </button>
        )}
      </div>

      <div className="btcd-hr mt-1" />
      <div className="flx flx-around mt-2 mb-2 btcbi-field-map-label">
        <div className="txt-dp">
          <b>{__('Form Fields', 'bit-integrations')}</b>
        </div>
        <div className="txt-dp">
          <b>{__('HighLevel Fields', 'bit-integrations')}</b>
        </div>
      </div>

      {highLevelConf?.selectedTask && (
        <>
          {highLevelConf.field_map.map((itm, i) => (
            <HighLevelFieldMap
              key={`HighLevel-m-${i + 9}`}
              i={i}
              field={itm}
              highLevelConf={highLevelConf}
              formFields={formFields}
              setHighLevelConf={setHighLevelConf}
            />
          ))}
          <div className="txt-center btcbi-field-map-button mt-2">
            <button
              onClick={() =>
                addFieldMap(highLevelConf.field_map.length, highLevelConf, setHighLevelConf)
              }
              className="icn-btn sh-sm"
              type="button">
              +
            </button>
          </div>
        </>
      )}

      {(highLevelConf.selectedTask === TASK_LIST_VALUES.CREATE_TASK ||
        highLevelConf.selectedTask === TASK_LIST_VALUES.UPDATE_TASK) && (
        <>
          <br />
          <br />
          <span className="action-delete-task-note">
            {__(
              'The "Due Date" field must be a date and time with timezone offset. e.g. 2024-10-25T10:00:00Z.',
              'bit-integrations'
            )}
          </span>
        </>
      )}

      {(highLevelConf.selectedTask === TASK_LIST_VALUES.CREATE_CONTACT ||
        highLevelConf.selectedTask === TASK_LIST_VALUES.UPDATE_CONTACT ||
        highLevelConf.selectedTask === TASK_LIST_VALUES.CREATE_OPPORTUNITY ||
        highLevelConf.selectedTask === TASK_LIST_VALUES.UPDATE_OPPORTUNITY) && (
        <>
          <br />
          <br />
          <div className="mt-4">
            <b className="wdt-100">{__('Utilities', 'bit-integrations')}</b>
          </div>
          <div className="btcd-hr mt-1" />
          <HighLevelActions
            highLevelConf={highLevelConf}
            setHighLevelConf={setHighLevelConf}
            loading={loading}
            setLoading={setLoading}
          />
        </>
      )}
    </>
  )
}
