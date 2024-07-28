/* eslint-disable no-console */
/* eslint-disable no-unused-expressions */
import { useState } from 'react'
import 'react-multiple-select-dropdown-lite/dist/index.css'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { __ } from '../../../Utils/i18nwrap'
import SnackMsg from '../../Utilities/SnackMsg'
import Steps from '../../Utilities/Steps'
import { saveIntegConfig } from '../IntegrationHelpers/IntegrationHelpers'
import IntegrationStepThree from '../IntegrationHelpers/IntegrationStepThree'
import { checkMappedFields } from './WPForoCommonFunc'
import WPForoIntegLayout from './WPForoIntegLayout'
import WPForoAuthorization from './WPForoAuthorization'
import { TASK_LIST_VALUES } from './wpforoConstants'

function WPForo({ formFields, setFlow, flow, allIntegURL }) {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [loading, setLoading] = useState({
    auth: false,
    reputation: false,
    groups: false,
    forums: false,
    topics: false
  })

  const [step, setStep] = useState(1)
  const [snack, setSnackbar] = useState({ show: false })

  const [wpforoConf, setWPForoConf] = useState({
    name: 'WPForo',
    type: 'WPForo',
    field_map: [],
    staticFields: [],
    selectedTask: '',
    groups: [],
    selectedGroup: '',
    reputations: [],
    selectedReputation: '',
    forums: [],
    selectedForum: '',
    selectedTags: '',
    actions: {},
    selectedTopic: '',
    topics: [],
    deleteTopicFieldMap: false
  })

  const saveConfig = () => {
    setIsLoading(true)
    const resp = saveIntegConfig(
      flow,
      setFlow,
      allIntegURL,
      wpforoConf,
      navigate,
      '',
      '',
      setIsLoading
    )
    resp.then((res) => {
      if (res.success) {
        toast.success(res.data?.msg)
        navigate(allIntegURL)
      } else {
        toast.error(res.data || res)
      }
    })
  }

  const nextPage = (pageNo) => {
    setTimeout(() => {
      document.getElementById('btcd-settings-wrp').scrollTop = 0
    }, 300)

    if (!wpforoConf.selectedTask) {
      toast.error('Please select a task!')
      return
    }

    if (
      wpforoConf.selectedTask !== TASK_LIST_VALUES.DELETE_TOPIC &&
      !checkMappedFields(wpforoConf)
    ) {
      toast.error('Please map mandatory fields!')
      return
    }

    if (
      wpforoConf.selectedTask === TASK_LIST_VALUES.USER_REPUTATION &&
      !wpforoConf.selectedReputation
    ) {
      toast.error('Please select a reputation!')
      return
    }

    if (wpforoConf.selectedTask === TASK_LIST_VALUES.ADD_TO_GROUP && !wpforoConf.selectedGroup) {
      toast.error('Please select a group!')
      return
    }

    if (
      wpforoConf.selectedTask === TASK_LIST_VALUES.REMOVE_FROM_GROUP &&
      !wpforoConf.selectedGroup
    ) {
      toast.error('Please select a group!')
      return
    }

    if (wpforoConf.selectedTask === TASK_LIST_VALUES.CREATE_TOPIC && !wpforoConf.selectedForum) {
      toast.error('Please select a forum!')
      return
    }

    if (
      wpforoConf.selectedTask === TASK_LIST_VALUES.DELETE_TOPIC &&
      !wpforoConf.selectedTopic &&
      !checkMappedFields(wpforoConf)
    ) {
      toast.error('Please select a topic or map fields!')
      return
    }

    wpforoConf.field_map.length > 0 && setStep(pageNo)
  }

  return (
    <div>
      <SnackMsg snack={snack} setSnackbar={setSnackbar} />
      <div className="txt-center mt-2">
        <Steps step={3} active={step} />
      </div>

      {/* STEP 1 */}
      <WPForoAuthorization
        wpforoConf={wpforoConf}
        setWPForoConf={setWPForoConf}
        step={step}
        setStep={setStep}
        loading={loading}
        setLoading={setLoading}
        setSnackbar={setSnackbar}
      />

      {/* STEP 2 */}
      <div
        className="btcd-stp-page"
        style={{ ...(step === 2 && { width: 900, height: 'auto', overflow: 'visible' }) }}>
        <WPForoIntegLayout
          formFields={formFields}
          wpforoConf={wpforoConf}
          setWPForoConf={setWPForoConf}
          loading={loading}
          setLoading={setLoading}
          setSnackbar={setSnackbar}
        />
        <button
          onClick={() => nextPage(3)}
          disabled={
            wpforoConf?.selectedTask !== TASK_LIST_VALUES.DELETE_TOPIC &&
            !checkMappedFields(wpforoConf)
          }
          className="btn f-right btcd-btn-lg purple sh-sm flx"
          type="button">
          {__('Next', 'bit-integrations')} &nbsp;
          <div className="btcd-icn icn-arrow_back rev-icn d-in-b" />
        </button>
      </div>

      {/* STEP 3 */}
      <IntegrationStepThree
        step={step}
        saveConfig={() => saveConfig()}
        isLoading={isLoading}
        dataConf={wpforoConf}
        setDataConf={setWPForoConf}
        formFields={formFields}
      />
    </div>
  )
}

export default WPForo
