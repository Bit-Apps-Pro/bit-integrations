// eslint-disable-next-line import/no-extraneous-dependencies
import { __ } from '../../../Utils/i18nwrap'
import { useState } from 'react'
import 'react-multiple-select-dropdown-lite/dist/index.css'
import { useNavigate, useParams } from 'react-router-dom'
import BackIcn from '../../../Icons/BackIcn'
import Steps from '../../Utilities/Steps'
import { saveIntegConfig } from '../IntegrationHelpers/IntegrationHelpers'
import IntegrationStepThree from '../IntegrationHelpers/IntegrationStepThree'
import HighLevelAuthorization from './HighLevelAuthorization'
import { checkMappedFields } from './HighLevelCommonFunc'
import HighLevelIntegLayout from './HighLevelIntegLayout'
import toast from 'react-hot-toast'
import { OPTIONAL_FIELD_MAP_ARRAY, TASK_LIST_VALUES } from './highlevelConstants'

function HighLevel({ formFields, setFlow, flow, allIntegURL }) {
  const navigate = useNavigate()
  const { formID } = useParams()
  const [isLoading, setIsLoading] = useState(false)
  const [step, setstep] = useState(1)
  const [loading, setLoading] = useState({
    auth: false,
    customFields: false,
    options: false,
    contacts: false,
    users: false,
    hlTasks: false,
    pipelines: false
  })

  const [highLevelConf, setHighLevelConf] = useState({
    name: 'High Level',
    type: 'High Level',
    api_key:
      process.env.NODE_ENV === 'development'
        ? 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsb2NhdGlvbl9pZCI6IlBqM1lwWkE2bHZTcmhBYlZ4dDRWIiwidmVyc2lvbiI6MSwiaWF0IjoxNzI2MzkxMjM1NTQwLCJzdWIiOiJORHFMUmNBT1ZSU2xPbTFrTUlLZiJ9.N8u68mUJxmmFHIozCtJCoIgCnxq9D-uipGIZFDYMe1w'
        : '',
    field_map: [{ formField: '', highLevelField: '' }],
    actions: {},
    tags: [],
    highLevelFields: [],
    selectedTags: '',
    selectedTask: '',
    contacts: [],
    selectedContact: '',
    selectedTaskStatus: '',
    users: [],
    selectedUser: '',
    hlTasks: [],
    updateTaskId: '',
    pipelines: [],
    selectedPipeline: '',
    stages: [],
    currentStages: [],
    selectedStage: ''
  })

  const nextPage = (val) => {
    setTimeout(() => {
      document.getElementById('btcd-settings-wrp').scrollTop = 0
    }, 300)

    if (val === 3) {
      if (!OPTIONAL_FIELD_MAP_ARRAY.includes(highLevelConf.selectedTask)) {
        if (!checkMappedFields(highLevelConf)) {
          toast.error('Please map all required fields to continue!')
          return
        }
      }

      if (!highLevelConf?.selectedTask) {
        toast.error('Please select task to continue!')
        return
      }

      if (highLevelConf.selectedTask === TASK_LIST_VALUES.UPDATE_CONTACT) {
        if (!highLevelConf.selectedContact && !checkMappedFields(highLevelConf)) {
          toast.error('Please select a contact or map fields!')
          return
        }
      }

      if (
        highLevelConf.selectedTask === TASK_LIST_VALUES.CREATE_TASK ||
        highLevelConf.selectedTask === TASK_LIST_VALUES.UPDATE_TASK
      ) {
        if (!highLevelConf.selectedContact && !checkMappedFields(highLevelConf)) {
          toast.error('Please select a contact or map fields!')
          return
        }
      }

      if (highLevelConf.selectedTask === TASK_LIST_VALUES.UPDATE_TASK) {
        if (!highLevelConf.updateTaskId && !checkMappedFields(highLevelConf)) {
          toast.error('Please select a task or map fields!')
          return
        }
      }

      if (highLevelConf.selectedTask === TASK_LIST_VALUES.CREATE_OPPORTUNITY) {
        if (!highLevelConf.selectedPipeline) {
          toast.error('Please select a pipeline!')
          return
        }

        if (!highLevelConf.selectedStage) {
          toast.error('Please select a stage!')
          return
        }

        if (!highLevelConf.selectedTaskStatus) {
          toast.error('Please select a status!')
          return
        }
      }

      if (highLevelConf.name !== '' && highLevelConf.field_map.length > 0) {
        setstep(3)
      }
    }
  }

  return (
    <div>
      <div className="txt-center mt-2">
        <Steps step={3} active={step} />
      </div>

      {/* STEP 1 */}
      <HighLevelAuthorization
        formID={formID}
        highLevelConf={highLevelConf}
        setHighLevelConf={setHighLevelConf}
        step={step}
        setstep={setstep}
        loading={loading}
        setLoading={setLoading}
      />
      {/* STEP 2 */}
      <div
        className="btcd-stp-page"
        style={{ width: step === 2 && 900, height: step === 2 && 'auto' }}>
        <HighLevelIntegLayout
          formID={formID}
          formFields={formFields}
          highLevelConf={highLevelConf}
          setHighLevelConf={setHighLevelConf}
          loading={loading}
          setLoading={setLoading}
        />
        <button
          onClick={() => nextPage(3)}
          disabled={!highLevelConf?.selectedTask}
          className="btn f-right btcd-btn-lg purple sh-sm flx"
          type="button">
          {__('Next', 'bit-integrations')} &nbsp;
          <BackIcn className="ml-1 rev-icn" />
        </button>
      </div>

      {/* STEP 3 */}
      <IntegrationStepThree
        step={step}
        saveConfig={() =>
          saveIntegConfig(flow, setFlow, allIntegURL, highLevelConf, navigate, '', '', setIsLoading)
        }
        isLoading={isLoading}
        dataConf={highLevelConf}
        setDataConf={setHighLevelConf}
        formFields={formFields}
      />
    </div>
  )
}

export default HighLevel
