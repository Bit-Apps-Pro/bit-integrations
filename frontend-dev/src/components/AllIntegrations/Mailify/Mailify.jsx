// eslint-disable-next-line import/no-extraneous-dependencies
import { __ } from '@wordpress/i18n'
import { useState } from 'react'
import 'react-multiple-select-dropdown-lite/dist/index.css'
import { useNavigate, useParams } from 'react-router-dom'
import BackIcn from '../../../Icons/BackIcn'
import SnackMsg from '../../Utilities/SnackMsg'
import Steps from '../../Utilities/Steps'
import { saveIntegConfig } from '../IntegrationHelpers/IntegrationHelpers'
import IntegrationStepThree from '../IntegrationHelpers/IntegrationStepThree'
import MailifyAuthorization from './MailifyAuthorization'
import { checkMappedFields } from './MailifyCommonFunc'
import MailifyIntegLayout from './MailifyIntegLayout'

function Mailify({ formFields, setFlow, flow, allIntegURL }) {
  const navigate = useNavigate()
  const { formID } = useParams()
  const [isLoading, setIsLoading] = useState(false)
  const [step, setstep] = useState(1)
  const [snack, setSnackbar] = useState({ show: false })
  const [mailifyConf, setMailifyConf] = useState({
    name: 'Sarbacane(Mailify)',
    type: 'Sarbacane(Mailify)',
    account_id: process.env.NODE_ENV === 'development' ? '643240d170f32e4b76f5e52b' : '',
    api_key: process.env.NODE_ENV === 'development' ? 'hoWqax0jSVuMsxGBizHOUg' : '',
    field_map: [
      { formField: '', mailifyField: '' },
    ],
    actions: {},
  })

  const nextPage = (val) => {
    // setIsLoading(true)
    setTimeout(() => {
      document.getElementById('btcd-settings-wrp').scrollTop = 0
    }, 300)
    if (val === 3) {
      if (!checkMappedFields(mailifyConf)) {
        setSnackbar({ show: true, msg: 'Please map all required fields to continue.' })
        return
      }
      if (!mailifyConf?.listId) {
        setSnackbar({ show: true, msg: 'Please select list to continue.' })
        return
      }
      if (mailifyConf.name !== '' && mailifyConf.field_map.length > 0) {
        setstep(3)
      }
    }
  }
  return (
    <div>
      <SnackMsg snack={snack} setSnackbar={setSnackbar} />
      <div className="txt-center mt-2"><Steps step={3} active={step} /></div>

      {/* STEP 1 */}
      <MailifyAuthorization
        formID={formID}
        mailifyConf={mailifyConf}
        setMailifyConf={setMailifyConf}
        step={step}
        setstep={setstep}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        setSnackbar={setSnackbar}
      />
      {/* STEP 2 */}
      <div className="btcd-stp-page" style={{ width: step === 2 && 900, height: step === 2 && 'auto' }}>

        <MailifyIntegLayout
          formID={formID}
          formFields={formFields}
          mailifyConf={mailifyConf}
          setMailifyConf={setMailifyConf}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          setSnackbar={setSnackbar}
        />
        <button
          onClick={() => nextPage(3)}
          disabled={!mailifyConf?.listId || mailifyConf.field_map.length < 1}
          className="btn f-right btcd-btn-lg green sh-sm flx"
          type="button"
        >
          {__('Next', 'bit-integrations')}
          {' '}
          &nbsp;
          <BackIcn className="ml-1 rev-icn" />
        </button>

      </div>

      {/* STEP 3 */}
      <IntegrationStepThree
        step={step}
        saveConfig={() => saveIntegConfig(flow, setFlow, allIntegURL, mailifyConf, navigate, '', '', setIsLoading)}
        isLoading={isLoading}
        dataConf={mailifyConf}
        setDataConf={setMailifyConf}
        formFields={formFields}
      />
    </div>
  )
}

export default Mailify
