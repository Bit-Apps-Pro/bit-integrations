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
import { handleInput, checkMappedFields } from './LifterLmsCommonFunc'
import LifterLmsIntegLayout from './LifterLmsIntegLayout'
import LifterLmsAuthorization from './LifterLmsAuthorization'

function LifterLms({ formFields, setFlow, flow, allIntegURL, isInfo, edit }) {
  const navigate = useNavigate()
  const { formID } = useParams()

  const [isLoading, setIsLoading] = useState(false)
  const [step, setStep] = useState(1)
  const [snack, setSnackbar] = useState({ show: false })

  const allActions = [
    { key: '1', label: 'Lesson complete for the user' },
    { key: '2', label: 'Section complete for the user' },
    { key: '3', label: 'Enroll user in a course' },
    { key: '4', label: 'Enroll user in a membership' },
    { key: '5', label: 'Course complete for the user' },
    { key: '6', label: 'Unenroll user from a course' },
    { key: '7', label: 'Unenroll user from a membership' },
  ]

  const [lifterLmsConf, setLifterLmsConf] = useState({
    name: 'LifterLms',
    type: 'LifterLms',
    mainAction: '',
    field_map: [
      { formField: '', lifterLmsFormField: '' },
    ],
    allActions,
    actions: {},
  })

  const nextPage = () => {
    setTimeout(() => {
      document.getElementById('btcd-settings-wrp').scrollTop = 0
    }, 300)
    if (lifterLmsConf.mainAction === '11' && !checkMappedFields(lifterLmsConf)) {
      setSnackbar({ show: true, msg: 'Please map fields to continue.' })
      return
    }
    if (lifterLmsConf.mainAction !== '') {
      setStep(3)
    }
  }

  function isDisabled() {
    switch (lifterLmsConf.mainAction) {
      case '1':
        return lifterLmsConf.lessonId === undefined
      case '2':
        return lifterLmsConf.sectionId === undefined
      case '3':
      case '5':
      case '6':
        return lifterLmsConf.courseId === undefined
      case '4':
      case '7':
        return lifterLmsConf.membershipId === undefined
      default:
        return false
    }
  }

  return (
    <div>
      <SnackMsg snack={snack} setSnackbar={setSnackbar} />
      <div className="txt-center mt-2"><Steps step={3} active={step} /></div>

      {/* STEP 1 */}
      <LifterLmsAuthorization
        formID={formID}
        lifterLmsConf={lifterLmsConf}
        setLifterLmsConf={setLifterLmsConf}
        step={step}
        setStep={setStep}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        setSnackbar={setSnackbar}
      />

      {/* STEP 2 */}
      <div className="btcd-stp-page" style={{ ...(step === 2 && { width: 900, height: 'auto', overflow: 'visible' }) }}>

        <LifterLmsIntegLayout
          formFields={formFields}
          handleInput={(e) => handleInput(e, lifterLmsConf, setLifterLmsConf, setIsLoading, setSnackbar, formID)}
          lifterLmsConf={lifterLmsConf}
          setLifterLmsConf={setLifterLmsConf}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          setSnackbar={setSnackbar}
          allIntegURL={allIntegURL}
          isInfo={isInfo}
          edit={edit}
        />

        <button
          onClick={() => nextPage(3)}
          disabled={!lifterLmsConf.mainAction || isLoading || isDisabled()}
          className="btn f-right btcd-btn-lg green sh-sm flx"
          type="button"
        >
          {__('Next', 'bit-integrations')}
          &nbsp;
          <div className="btcd-icn icn-arrow_back rev-icn d-in-b" />
        </button>
      </div>
      {/* STEP 3 */}
      <IntegrationStepThree
        step={step}
        saveConfig={() => saveActionConf({ flow, setFlow, allIntegURL, navigate, conf: lifterLmsConf, setIsLoading, setSnackbar })}
        isLoading={isLoading}
        dataConf={lifterLmsConf}
        setDataConf={setLifterLmsConf}
        formFields={formFields}
      />

    </div>
  )
}

export default LifterLms
