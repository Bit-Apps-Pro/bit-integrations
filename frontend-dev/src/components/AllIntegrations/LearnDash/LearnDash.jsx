import { useEffect, useState } from 'react'
import 'react-multiple-select-dropdown-lite/dist/index.css'
import { useNavigate, useParams } from 'react-router-dom'
import { useRecoilValue } from 'recoil'
import BackIcn from '../../../Icons/BackIcn'
import { __ } from '../../../Utils/i18nwrap'
import SnackMsg from '../../Utilities/SnackMsg'
import Steps from '../../Utilities/Steps'
import { saveActionConf } from '../IntegrationHelpers/IntegrationHelpers'
import IntegrationStepThree from '../IntegrationHelpers/IntegrationStepThree'
import { handleInput, checkMappedFields } from './LearnDashCommonFunc'
import LearnDashIntegLayout from './LearnDashIntegLayout'
import { $btcbi } from '../../../GlobalStates'
import LearnDashAuthorization from './LearnDashAuthorization'

function LearnDash({ formFields, setFlow, flow, allIntegURL, isInfo, edit }) {
  const navigate = useNavigate()
  const { formID } = useParams()
  const btcbi = useRecoilValue($btcbi)
  const { siteURL } = btcbi

  const [isLoading, setIsLoading] = useState(false)
  const [step, setStep] = useState(1)
  const [snack, setSnackbar] = useState({ show: false })

  const allActions = [
    { key: '1', label: 'Create Group' },
    { key: '2', label: 'Add the user to a group pro' },
    { key: '3', label: 'Enroll the user in a course' },
    { key: '4', label: 'Make the user the leader of group' },
    { key: '5', label: 'Mark a course complete for the user' },
    { key: '6', label: 'Mark a lesson complete for the user' },
    { key: '7', label: 'Mark a lesson not complete for the user pro' },
    { key: '8', label: 'Mark a topic complete for the user' },
    { key: '9', label: 'Mark a topic not complete for the user pro' },
    { key: '10', label: 'Remove the Leader from a group and its children pro' },
    { key: '11', label: 'Remove the user from a group pro' },
    { key: '12', label: 'Remove the user from a group and its children pro' },
    { key: '13', label: 'Reset the users attempts for a quiz pro ' },
    { key: '14', label: 'Reset the users progress in a course pro' },
    // { key: '15', label: 'Send a certificate pro' },
    { key: '16', label: 'Send an email to the users group leaders' },
    { key: '17', label: 'Unenroll the user from a course pro' },
  ]

  const groupUserRole = [
    { key: '1', label: 'Do not add group leader role' },
    { key: '2', label: 'Add the role to their exiting role' },
    { key: '3', label: 'Replace their existing role(s) with the Group Leader role' },
  ]

  const groupOfLeader4 = [
    { key: '1', label: 'Do nothing' },
    { key: '2', label: 'Add the role to their exiting role' },
    { key: '3', label: 'Replace their existing role(s) with the Group Leader role' },
  ]

  const createGroupFields = [
    { key: 'title', label: 'Title', required: true },
  ]
  const [learnDashConf, setLearnDashConf] = useState({
    name: 'LearnDash',
    type: 'LearnDash',
    mainAction: '',
    courseId: '',
    domainName: siteURL,
    field_map: [
      { formField: '', learnDeshFormField: '' },
    ],
    allActions,
    groupUserRole,
    groupOfLeader4,
    createGroupFields,
    actions: {},
  })

  const nextPage = () => {
    setTimeout(() => {
      document.getElementById('btcd-settings-wrp').scrollTop = 0
    }, 300)
    if (learnDashConf.mainAction === '1' && !checkMappedFields(learnDashConf)) {
      setSnackbar({ show: true, msg: 'Please map fields to continue.' })
      return
    }
    if (learnDashConf.mainAction !== '') {
      setStep(3)
    }
  }

  return (
    <div>
      <SnackMsg snack={snack} setSnackbar={setSnackbar} />
      <div className="txt-center mt-2"><Steps step={3} active={step} /></div>

      {/* STEP 1 */}
      <LearnDashAuthorization
        formID={formID}
        learnDashConf={learnDashConf}
        setLearnDashConf={setLearnDashConf}
        step={step}
        setStep={setStep}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        setSnackbar={setSnackbar}
      />

      {/* STEP 2 */}
      <div className="btcd-stp-page" style={{ ...(step === 2 && { width: 900, height: 'auto', overflow: 'visible' }) }}>

        <LearnDashIntegLayout
          formFields={formFields}
          handleInput={(e) => handleInput(e, learnDashConf, setLearnDashConf, setIsLoading, setSnackbar, formID)}
          learnDashConf={learnDashConf}
          setLearnDashConf={setLearnDashConf}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          setSnackbar={setSnackbar}
          allIntegURL={allIntegURL}
          isInfo={isInfo}
          edit={edit}
        />

        {learnDashConf.mainAction !== '16' && (
          <button
            onClick={() => nextPage(3)}
            disabled={!learnDashConf.mainAction || isLoading}
            className="btn f-right btcd-btn-lg green sh-sm flx"
            type="button"
          >
            {__('Next', 'bit-integrations')}
            &nbsp;
            <div className="btcd-icn icn-arrow_back rev-icn d-in-b" />
          </button>
        )}
      </div>
      {/* STEP 3 */}
      {learnDashConf.mainAction !== '16' && (
        <IntegrationStepThree
          step={step}
          saveConfig={() => saveActionConf({ flow, setFlow, allIntegURL, navigate, conf: learnDashConf, setIsLoading, setSnackbar })}
          isLoading={isLoading}
          dataConf={learnDashConf}
          setDataConf={setLearnDashConf}
          formFields={formFields}
        />
      )}

    </div>
  )
}

export default LearnDash
