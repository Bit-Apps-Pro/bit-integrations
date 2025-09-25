import { useState } from 'react'
import 'react-multiple-select-dropdown-lite/dist/index.css'
import { useNavigate, useParams } from 'react-router-dom'
import BackIcn from '../../../Icons/BackIcn'
import { __ } from '../../../Utils/i18nwrap'
import SnackMsg from '../../Utilities/SnackMsg'
import Steps from '../../Utilities/Steps'
import { saveIntegConfig } from '../IntegrationHelpers/IntegrationHelpers'
import IntegrationStepThree from '../IntegrationHelpers/IntegrationStepThree'
import FluentCommunityAuthorization from './FluentCommunityAuthorization'
import { checkMappedFields, refreshCommunityList } from './FluentCommunityCommonFunc'
import FluentCommunityIntegLayout from './FluentCommunityIntegLayout'

export default function FluentCommunity({ formFields, setFlow, flow, allIntegURL }) {
  const navigate = useNavigate()
  const { formID } = useParams()
  const [isLoading, setIsLoading] = useState(false)
  const [loading, setLoading] = useState({})
  const [step, setStep] = useState(1)
  const [snack, setSnackbar] = useState({ show: false })
  const [fluentCommunityConf, setFluentCommunityConf] = useState({
    name: 'Fluent Community',
    type: 'Fluent Community',
    actionName: '',
    field_map: [{ formField: '', fluentCommunityField: '' }],
    actions: {}
  })

  const nextPage = val => {
    setTimeout(() => {
      document.getElementById('btcd-settings-wrp').scrollTop = 0
    }, 300)
    if (val === 3) {
      if (!checkMappedFields(fluentCommunityConf)) {
        setSnackbar({
          show: true,
          msg: __('Please map all required fields to continue.', 'bit-integrations')
        })
        return
      }
      if (fluentCommunityConf?.actionName === 'add-user' && !fluentCommunityConf.list_id) {
        setSnackbar({ show: true, msg: __('Please select space to continue.', 'bit-integrations') })
        return
      }
      if (
        (fluentCommunityConf?.actionName === 'add-course' ||
          fluentCommunityConf?.actionName === 'remove-course') &&
        !fluentCommunityConf.course_id
      ) {
        setSnackbar({ show: true, msg: __('Please select course to continue.', 'bit-integrations') })
        return
      }
      if (
        fluentCommunityConf?.actionName === 'create-post' &&
        (!fluentCommunityConf.post_space_id || !fluentCommunityConf.post_user_id)
      ) {
        setSnackbar({
          show: true,
          msg: __('Please select space and user to continue.', 'bit-integrations')
        })
        return
      }
      if (fluentCommunityConf.name !== '' && fluentCommunityConf.field_map.length > 0) {
        setStep(val)
      }
    } else {
      setStep(val)
    }
  }

  return (
    <div>
      <SnackMsg snack={snack} setSnackbar={setSnackbar} />
      <div className="txt-center mt-2">
        <Steps step={3} active={step} />
      </div>

      {/* STEP 1 */}
      <FluentCommunityAuthorization
        formID={formID}
        fluentCommunityConf={fluentCommunityConf}
        setFluentCommunityConf={setFluentCommunityConf}
        step={step}
        nextPage={nextPage}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        setSnackbar={setSnackbar}
      />

      {/* STEP 2 */}
      <div
        className="btcd-stp-page"
        style={{
          width: step === 2 && 900,
          height: step === 2 && 'auto',
          minHeight: step === 2 && `${200}px`
        }}>
        <FluentCommunityIntegLayout
          formID={formID}
          formFields={formFields}
          fluentCommunityConf={fluentCommunityConf}
          setFluentCommunityConf={setFluentCommunityConf}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          loading={loading}
          setLoading={setLoading}
          setSnackbar={setSnackbar}
        />
        <br />
        <br />
        <br />
        <button
          onClick={() => nextPage(3)}
          disabled={fluentCommunityConf.field_map.length < 1}
          className="btn f-right btcd-btn-lg purple sh-sm flx"
          type="button">
          {__('Next', 'bit-integrations')}
          <BackIcn className="ml-1 rev-icn" />
        </button>
      </div>

      {/* STEP 3 */}
      <IntegrationStepThree
        step={step}
        saveConfig={() =>
          saveIntegConfig(
            flow,
            setFlow,
            allIntegURL,
            fluentCommunityConf,
            navigate,
            '',
            '',
            setIsLoading
          )
        }
        isLoading={isLoading}
        dataConf={fluentCommunityConf}
        setDataConf={setFluentCommunityConf}
        formFields={formFields}
      />
    </div>
  )
}
