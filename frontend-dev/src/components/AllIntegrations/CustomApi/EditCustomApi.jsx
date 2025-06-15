import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useRecoilState, useRecoilValue } from 'recoil'
import { $actionConf, $formFields, $newFlow } from '../../../GlobalStates'
import SnackMsg from '../../Utilities/SnackMsg'
import { saveActionConf } from '../IntegrationHelpers/IntegrationHelpers'
import IntegrationStepThree from '../IntegrationHelpers/IntegrationStepThree'
import SetEditIntegComponents from '../IntegrationHelpers/SetEditIntegComponents'
import CustomApiIntegrationLayout from './CustomApiIntegrationLayout'

export default function EditCustomApi({ allIntegURL }) {
    const navigate = useNavigate()
    const { formID } = useParams()

    const [customApiConf, setCustomApiConf] = useRecoilState($actionConf)
    const [isLoading, setIsLoading] = useState(false)
    const [flow, setFlow] = useRecoilState($newFlow)
    const formFields = useRecoilValue($formFields)
    const [snack, setSnackbar] = useState({ show: false })

    return (
        <div style={{ width: 900 }}>
            <SnackMsg snack={snack} setSnackbar={setSnackbar} />
            <SetEditIntegComponents entity={flow.triggered_entity} setSnackbar={setSnackbar} />
            <div className="mt-3">
                <CustomApiIntegrationLayout
                    formID={formID}
                    formFields={formFields}
                    customApiConf={customApiConf}
                    setCustomApiConf={setCustomApiConf}
                />
            </div>

            <IntegrationStepThree
                edit
                saveConfig={() => saveActionConf({ flow, setFlow, allIntegURL, conf: customApiConf, navigate, edit: 1, setIsLoading, setSnackbar })}
                isLoading={isLoading}
            />
            <br />
        </div>
    )
}
