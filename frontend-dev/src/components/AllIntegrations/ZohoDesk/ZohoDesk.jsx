/* eslint-disable no-unused-expressions */
import { useEffect, useState } from 'react'
import 'react-multiple-select-dropdown-lite/dist/index.css'
import { useNavigate, useParams } from 'react-router-dom'
import BackIcn from '../../../Icons/BackIcn'
import tutorialLinks from '../../../Utils/StaticData/tutorialLinks'
import { __ } from '../../../Utils/i18nwrap'
import SnackMsg from '../../Utilities/SnackMsg'
import Steps from '../../Utilities/Steps'
import { saveActionConf, setGrantTokenResponse } from '../IntegrationHelpers/IntegrationHelpers'
import IntegrationStepThree from '../IntegrationHelpers/IntegrationStepThree'
import ZohoAuthorization from '../ZohoAuthorization'
import { checkMappedFields, handleInput, refreshOrganizations } from './ZohoDeskCommonFunc'
import ZohoDeskIntegLayout from './ZohoDeskIntegLayout'

function ZohoDesk({ formFields, setFlow, flow, allIntegURL }) {
  const navigate = useNavigate()
  const { formID } = useParams()
  const [isLoading, setIsLoading] = useState(false)
  const [step, setstep] = useState(1)
  const [snack, setSnackbar] = useState({ show: false })
  const scopes = 'Desk.settings.READ,Desk.basic.READ,Desk.search.READ,Desk.contacts.READ,Desk.contacts.CREATE,Desk.contacts.UPDATE,Desk.tickets.CREATE,Desk.tickets.UPDATE'
  const { zohoDesk } = tutorialLinks
  const [deskConf, setDeskConf] = useState({
    name: 'Zoho Desk',
    type: 'Zoho Desk',
    clientId: process.env.NODE_ENV === 'development' ? '1000.KY0PGSWT3ZVY841014BSQYV1K1C4XH' : '',
    clientSecret: process.env.NODE_ENV === 'development' ? '97fd44705c7bb79b51eae4d220d2c66a7c1d3fe59e' : '',
    orgId: '',
    department: '',
    field_map: [
      { formField: '', zohoFormField: '' },
    ],
    actions: {},
  })
  useEffect(() => {
    window.opener && setGrantTokenResponse('zohoDesk')
  }, [])

  const nextPage = val => {
    setTimeout(() => {
      document.getElementById('btcd-settings-wrp').scrollTop = 0
    }, 300)

    if (val === 3) {
      if (!checkMappedFields(deskConf)) {
        setSnackbar({ show: true, msg: __('Please map mandatory fields', 'bit-integrations') })
        return
      }

      if (!deskConf.actions?.ticket_owner) {
        setSnackbar({ show: true, msg: __('Please select a ticket owner', 'bit-integrations') })
        return
      }

      if (deskConf.department !== '' && deskConf.table !== '' && deskConf.field_map.length > 0) {
        setstep(val)
      }
    } else {
      setstep(val)
      if (val === 2 && !deskConf.department) {
        refreshOrganizations(formID, deskConf, setDeskConf, setIsLoading, setSnackbar)
      }
    }
  }

  return (
    <div>
      <SnackMsg snack={snack} setSnackbar={setSnackbar} />
      <div className="txt-center mt-2"><Steps step={3} active={step} /></div>

      {/* STEP 1 */}
      <ZohoAuthorization
        integ="zohoDesk"
        tutorialLink={zohoDesk}
        scopes={scopes}
        config={deskConf}
        setConfig={setDeskConf}
        step={step}
        nextPage={nextPage}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        setSnackbar={setSnackbar}
      />

      {/* STEP 2 */}
      <div className="btcd-stp-page" style={{ width: step === 2 && 900, height: step === 2 && 'auto' }}>
        <ZohoDeskIntegLayout
          formID={formID}
          formFields={formFields}
          handleInput={(e) => handleInput(e, deskConf, setDeskConf, formID, setIsLoading, setSnackbar)}
          deskConf={deskConf}
          setDeskConf={setDeskConf}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          setSnackbar={setSnackbar}
        />

        <button
          onClick={() => nextPage(3)}
          disabled={deskConf.department === '' || deskConf.table === '' || deskConf.field_map.length < 1}
          className="btn f-right btcd-btn-lg green sh-sm flx"
          type="button"
        >
          {__('Next', 'bit-integrations')}
          <BackIcn className="ml-1 rev-icn" />
        </button>

      </div>

      {/* STEP 3 */}
      <IntegrationStepThree
        step={step}
        saveConfig={() => saveActionConf({ flow, setFlow, allIntegURL, navigate, conf: deskConf, setIsLoading, setSnackbar })}
      />
    </div>
  )
}

export default ZohoDesk
