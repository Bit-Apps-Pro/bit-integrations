/* eslint-disable no-unused-expressions */
import { useState } from 'react'
import 'react-multiple-select-dropdown-lite/dist/index.css'
import { useNavigate, useParams } from 'react-router-dom'
import { __ } from '../../../Utils/i18nwrap'
import SnackMsg from '../../Utilities/SnackMsg'
import Steps from '../../Utilities/Steps'
import { saveActionConf } from '../IntegrationHelpers/IntegrationHelpers'
import IntegrationStepThree from '../IntegrationHelpers/IntegrationStepThree'
import PipeDriveAuthorization from './PipeDriveAuthorization'
import { checkMappedFields, checkRequired, handleInput } from './PipeDriveCommonFunc'
import PipeDriveIntegLayout from './PipeDriveIntegLayout'

function PipeDrive({ formFields, setFlow, flow, allIntegURL }) {
  const navigate = useNavigate()
  const { formID } = useParams()
  const [isLoading, setIsLoading] = useState(false)
  const [step, setstep] = useState(1)
  const [snack, setSnackbar] = useState({ show: false })
  const [tab, settab] = useState(0)

  const [pipeDriveConf, setPipeDriveConf] = useState({
    name: 'PipeDrive',
    type: 'PipeDrive',
    api_key: process.env.NODE_ENV === 'development' ? '0d2e5820bcbf64fec19a40f7261f41a88b06980b' : '',
    default:
    {
      modules: {
        Leads: {
          required: true,
          requiredFields: [
            'title',
          ],
          relatedlists: [
            { name: 'Notes' },
            { name: 'Activities' },
          ],
        },
        Deals: {
          required: true,
          requiredFields: [
            'title',
          ],
          relatedlists: [
            { name: 'Notes' },
            { name: 'Activities' },
          ],
        },
        Activities: { required: true },
        Persons: {
          required: true,
          requiredFields: [
            'name',
          ],
        },
        Products: {
          requiredFields: [
            'name',
          ],
        },
        Notes: {
          required: true,
          requiredFields: [
            'content',
          ],
        },
      },
    },
    moduleData: { module: '' },
    field_map: [
      { formField: '', pipeDriveFormField: '' },
    ],
    relatedlists: [],
    actions: {},
  })

  const saveConfig = () => {
    saveActionConf({ flow, setFlow, allIntegURL, conf: pipeDriveConf, navigate, setIsLoading, setSnackbar })
  }
  const nextPage = (pageNo) => {
    setTimeout(() => {
      document.getElementById('btcd-settings-wrp').scrollTop = 0
    }, 300)

    if (!checkMappedFields(pipeDriveConf)) {
      setSnackbar({ show: true, msg: __('Please map mandatory fields', 'bit-integrations') })
      return
    }
    if (!checkRequired(pipeDriveConf)) {
      if (['Leads', 'Deals', 'Activities', 'Notes'].includes(pipeDriveConf.moduleData.module)) {
        setSnackbar({ show: true, msg: __('Please select a organization or a person', 'bit-integrations') })
      }
      // if (pipeDriveConf.moduleData.module === 'Persons') {
      //   setSnackbar({ show: true, msg: __('Please select a organization', 'bit-integrations') })
      // }
      return
    }
    pipeDriveConf.moduleData.module && pipeDriveConf.field_map.length > 0 && setstep(pageNo)
  }

  return (
    <div>
      <SnackMsg snack={snack} setSnackbar={setSnackbar} />
      <div className="txt-center mt-2"><Steps step={3} active={step} /></div>

      {/* STEP 1 */}
      <PipeDriveAuthorization
        formID={formID}
        pipeDriveConf={pipeDriveConf}
        setPipeDriveConf={setPipeDriveConf}
        step={step}
        setstep={setstep}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        setSnackbar={setSnackbar}
      />

      {/* STEP 2 */}
      <div className="btcd-stp-page" style={{ ...(step === 2 && { width: 900, height: 'auto', overflow: 'visible' }) }}>

        <PipeDriveIntegLayout
          tab={tab}
          settab={settab}
          formID={formID}
          formFields={formFields}
          handleInput={(e) => handleInput(e, tab, pipeDriveConf, setPipeDriveConf, formID, setIsLoading, setSnackbar)}
          pipeDriveConf={pipeDriveConf}
          setPipeDriveConf={setPipeDriveConf}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          setSnackbar={setSnackbar}
        />

        <button
          onClick={() => nextPage(3)}
          disabled={pipeDriveConf.moduleData.module === '' || pipeDriveConf.field_map.length < 1}
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
        dataConf={pipeDriveConf}
        setDataConf={setPipeDriveConf}
        formFields={formFields}
      />
    </div>
  )
}

export default PipeDrive
