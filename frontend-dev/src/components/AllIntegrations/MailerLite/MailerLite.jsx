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
import MailerLiteAuthorization from './MailerLiteAuthorization'
import { checkMappedFields, handleInput } from './MailerLiteCommonFunc'
import MailerLiteIntegLayout from './MailerLiteIntegLayout'

function MailerLite({ formFields, setFlow, flow, allIntegURL }) {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [loading, setLoading] = useState({
    list: false,
    field: false,
    auth: false,
    group: false,
  })

  const [step, setstep] = useState(1)
  const [snack, setSnackbar] = useState({ show: false })

  const [mailerLiteConf, setMailerLiteConf] = useState({
    name: 'MailerLite',
    type: 'MailerLite',
    // eslint-disable-next-line max-len
    auth_token: process.env.NODE_ENV === 'development' ? 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI0IiwianRpIjoiMDkyZGQ0OTM5YWEyMTI2OGM5NGQzMDBkZTQ3MjRhZWM0YWU2MmUyMDExMjA4MzQ1ODllNzMzZGRjODRkYzY1ZjMzODYyZDBmZDhkZTgwOTIiLCJpYXQiOjE2ODUyNTI5NDEuMDA4NzU2LCJuYmYiOjE2ODUyNTI5NDEuMDA4NzU4LCJleHAiOjQ4NDA5MjY1NDEuMDAzNDY5LCJzdWIiOiI3MTY2MCIsInNjb3BlcyI6W119.VVT1hmV8xiZ-Js2HCbEbdkX1cVPGLHxeeCER0XPqZEtveQHTguhG9bdrzhnEfiZYILi4rgCpyiI9ib1kj7psQZX2lkBBtNao6QHecvwHejKNNjHvjsuGUX_Yy7Xeku5kU0wWKJod5zVHWcbESHbVlG09d2giMlsmoSvAk8OnkEy63JZ0kG2VGvqN8wGN9BJ1V9oNBsNrD-nPyw6VV0pNQmsFnjrL4_nvN4Z0f_wYbLnNH1b0Kv76N5NloDiXeyOlz2fqwi7XKD-JdvoUM0dF6zpso2c5BfN3zmOXzyY5r-qsvVQkSK7mN8t2XHh51roF2j2qZBy53Dm4ICitCeughGO5nb74od1okaKjAdDdC16HnW9Q7saSa31R1I_rAt150UkQKxrbDj8AWEyjAaF1KxzzyF8U77IxJhDSAdYm_rY62PMY8I8Me2rL7SnjQUZ8qwo5QNXWmbV8JZK9B-w7b7QiX0keT1gFufLwHIGZcM47YWmHXdBa1xtyQ-YB3A0Koi4K2oIa01uIXdWT4WS8OHSMH0sb2gCy_lYcOPDb0T7OaXi-Qq-knyPYT1rTcnPxS9AikuYokphiBttcaYbpzlBENvQWbkC29oIcnA6R4RMpKDwtdqz9eC8rDaaL4zbshvLZUyFkLGJvANT0tA2lSUCMBFOcGarRBMfyvH3Oux0' : '',
    field_map: [
      { formField: '', mailerLiteFormField: 'email' },
    ],
    mailer_lite_type: '',
    mailerLiteFields: [],
    groups: [],
    group_ids: [],
    actions: {},
  })

  const saveConfig = () => {
    setIsLoading(true)
    const resp = saveIntegConfig(flow, setFlow, allIntegURL, mailerLiteConf, navigate, '', '', setIsLoading)
    resp.then(res => {
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

    if (!checkMappedFields(mailerLiteConf)) {
      toast.error('Please map mandatory fields')
      return
    }
    mailerLiteConf.field_map.length > 0 && setstep(pageNo)
  }

  return (
    <div>
      <SnackMsg snack={snack} setSnackbar={setSnackbar} />
      <div className="txt-center mt-2"><Steps step={3} active={step} /></div>

      {/* STEP 1 */}

      <MailerLiteAuthorization
        mailerLiteConf={mailerLiteConf}
        setMailerLiteConf={setMailerLiteConf}
        step={step}
        setstep={setstep}
        loading={loading}
        setLoading={setLoading}
        setSnackbar={setSnackbar}
      />

      {/* STEP 2 */}
      <div className="btcd-stp-page" style={{ ...(step === 2 && { width: 900, height: 'auto', overflow: 'visible' }) }}>

        <MailerLiteIntegLayout
          formFields={formFields}
          handleInput={(e) => handleInput(e, mailerLiteConf, setMailerLiteConf, setLoading, setSnackbar)}
          mailerLiteConf={mailerLiteConf}
          setMailerLiteConf={setMailerLiteConf}
          loading={loading}
          setLoading={setLoading}
          setSnackbar={setSnackbar}
        />

        <button
          onClick={() => nextPage(3)}
          // disabled={!mailerLiteConf?.recipient_id}
          className="btn f-right btcd-btn-lg green sh-sm flx"
          type="button"
        >
          {__('Next', 'bit-integrations')}
          {' '}
          &nbsp;
          <div className="btcd-icn icn-arrow_back rev-icn d-in-b" />
        </button>
      </div>

      {/* STEP 3 */}
      <IntegrationStepThree
        step={step}
        saveConfig={() => saveConfig()}
        isLoading={isLoading}
        dataConf={mailerLiteConf}
        setDataConf={setMailerLiteConf}
        formFields={formFields}
      />
    </div>
  )
}

export default MailerLite
