/* eslint-disable no-unused-expressions */
import { useState } from 'react'
import 'react-multiple-select-dropdown-lite/dist/index.css'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { __ } from '../../../Utils/i18nwrap'
import SnackMsg from '../../Utilities/SnackMsg'
import Steps from '../../Utilities/Steps'
import { saveActionConf } from '../IntegrationHelpers/IntegrationHelpers'
import IntegrationStepThree from '../IntegrationHelpers/IntegrationStepThree'
import RestrictContentAuthorization from './RestrictContentAuthorization'
import RestrictContentIntegLayout from './RestrictContentIntegLayout'
import { checkMappedFields, handleInput } from './RestrictContentCommonFunc'

function RestrictContent({ formFields, setFlow, flow, allIntegURL }) {
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(false)
    const [step, setStep] = useState(1)
    const [snack, setSnackbar] = useState({ show: false })

    const memberFields = [
        { key: 'user_login', label: 'User Name', required: true },
        { key: 'user_email', label: 'Email', required: true },
        { key: 'user_pass', label: 'User Password', required: false },
        { key: 'first_name', label: 'First name', required: false },
        { key: 'last_name', label: 'Last name', required: false },
        { key: 'company', label: 'Company', required: false },
        { key: 'address1', label: 'Address Line 1', required: false },
        { key: 'address2', label: 'Address Line 2', required: false },
        { key: 'city', label: 'City', required: false },
        { key: 'state', label: 'State', required: false },
        { key: 'zip', label: 'Zip', required: false },
        { key: 'country', label: 'Country', required: false },
    ]

    // const levelFields = [{ key: 'exp_date', label: 'Expiry Date', required: true }]

    const actionLists = [
        { key: 'add-member-level', label: 'Add the user to a level' }, // Add the user to a level
        { key: 'remove-member-level', label: 'Remove the user to a level' }, // Remove the user to a level
    ]

    const [restrictConf, setRestrictConf] = useState({
        name: 'Restrict Content',
        type: 'RestrictContent',
        field_map: [{ formField: '', restrictField: '' }],
        exp_date: '',
        memberFields,
        actionLists,
        // levelFields,
        actions: {},
    })

    const saveConfig = () => {
        setIsLoading(true)
        const resp = saveActionConf({ flow, setFlow, allIntegURL, conf: restrictConf, navigate, setIsLoading, setSnackbar })
    }
    const nextPage = (pageNo) => {
        // if (!checkMappedFields(restrictConf)) {
        //     toast.error('Please map mandatory fields')
        //     return
        // }
        restrictConf.field_map.length > 0 && setStep(pageNo)
    }

    return (
        <div>
            <SnackMsg snack={snack} setSnackbar={setSnackbar} />
            <div className="txt-center mt-2">
                <Steps step={3} active={step} />
            </div>

            {/* STEP 1 */}

            <RestrictContentAuthorization
                restrictConf={restrictConf}
                setRestrictConf={setRestrictConf}
                step={step}
                setStep={setStep}
                isLoading={isLoading}
                setIsLoading={setIsLoading}
                setSnackbar={setSnackbar}
            />

            {/* STEP 2 */}
            <div className="btcd-stp-page" style={{ ...(step === 2 && { width: 900, height: 'auto', overflow: 'visible' }) }}>
                <RestrictContentIntegLayout
                    formFields={formFields}
                    handleInput={(e) => handleInput(e, restrictConf, setRestrictConf, setIsLoading, setSnackbar)}
                    restrictConf={restrictConf}
                    setRestrictConf={setRestrictConf}
                    isLoading={isLoading}
                    setIsLoading={setIsLoading}
                    setSnackbar={setSnackbar}
                />

                <button
                    onClick={() => nextPage(3)}
                    disabled={!restrictConf?.level_id && !restrictConf?.member_id}
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
                dataConf={restrictConf}
                setDataConf={setRestrictConf}
                formFields={formFields}
            />
        </div>
    )
}

export default RestrictContent
