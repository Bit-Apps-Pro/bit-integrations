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
import DripAuthorization from './DripAuthorization'
import { checkMappedFields } from './DripCommonFunc'
import DripIntegLayout from './DripIntegLayout'

function Drip({ formFields, setFlow, flow, allIntegURL }) {
  const navigate = useNavigate()
  const { formID } = useParams()
  const [isLoading, setIsLoading] = useState(false)
  const [step, setstep] = useState(1)
  const [snack, setSnackbar] = useState({ show: false })
  // const fields = [
  //   { fieldName: 'email', fieldName: 'Email', required: true },
  //   { fieldName: 'first_name', fieldName: 'First Name', required: false },
  //   { fieldName: 'last_name', fieldName: 'Last Name', required: false }, ,
  // ]
  const [dripConf, setDripConf] = useState({
    name: 'Drip',
    type: 'Drip',
    api_token: process.env.NODE_ENV === 'development' ? '8cac39208b7aadb09e625a380140bf62' : '',
    field_map: [
      { formField: '', dripField: '' },
    ],
    actions: {},
    // default: {
    //   fields: fields,
    // },
  })

  const nextPage = (val) => {
    // setIsLoading(true)
    setTimeout(() => {
      document.getElementById('btcd-settings-wrp').scrollTop = 0
    }, 300)
    if (val === 3) {
      if (!checkMappedFields(dripConf)) {
        setSnackbar({ show: true, msg: 'Please map all required fields to continue.' })
        return
      }
      if (!dripConf?.campaignId) {
        setSnackbar({ show: true, msg: 'Please select campaign to continue.' })
        return
      }
      if (dripConf.name !== '' && dripConf.field_map.length > 0) {
        setstep(3)
      }
    }
  }
  return (
    <div>
      <SnackMsg snack={snack} setSnackbar={setSnackbar} />
      <div className="txt-center mt-2"><Steps step={3} active={step} /></div>

      {/* STEP 1 */}
      <DripAuthorization
        formID={formID}
        dripConf={dripConf}
        setDripConf={setDripConf}
        step={step}
        setstep={setstep}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        setSnackbar={setSnackbar}
      />
      {/* STEP 2 */}
      <div className="btcd-stp-page" style={{ width: step === 2 && 900, height: step === 2 && 'auto' }}>

        <DripIntegLayout
          formID={formID}
          formFields={formFields}
          dripConf={dripConf}
          setDripConf={setDripConf}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          setSnackbar={setSnackbar}
        />
        <button
          onClick={() => nextPage(3)}
          disabled={!dripConf?.campaignId || dripConf.field_map.length < 1}
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
        saveConfig={() => saveIntegConfig(flow, setFlow, allIntegURL, dripConf, navigate, '', '', setIsLoading)}
        isLoading={isLoading}
        dataConf={dripConf}
        setDataConf={setDripConf}
        formFields={formFields}
      />
    </div>
  )
}

export default Drip
