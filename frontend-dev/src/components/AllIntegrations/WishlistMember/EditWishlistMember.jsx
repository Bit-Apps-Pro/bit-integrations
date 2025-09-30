/* eslint-disable no-param-reassign */

import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useRecoilState, useRecoilValue } from 'recoil'
import { $actionConf, $formFields, $newFlow } from '../../../GlobalStates'
import { __ } from '../../../Utils/i18nwrap'
import SnackMsg from '../../Utilities/SnackMsg'
import EditFormInteg from '../EditFormInteg'
import SetEditIntegComponents from '../IntegrationHelpers/SetEditIntegComponents'
import EditWebhookInteg from '../EditWebhookInteg'
import { saveActionConf } from '../IntegrationHelpers/IntegrationHelpers'
import IntegrationStepThree from '../IntegrationHelpers/IntegrationStepThree'
import { checkMappedFields, checkValidation, setIntegrationName } from './WishlistMemberCommonFunc'
import WishlistMemberIntegLayout from './WishlistMemberIntegLayout'

function EditWishlistMember({ allIntegURL }) {
  const navigate = useNavigate()
  const { formID } = useParams()

  const [wishlistMemberConf, setWishlistMemberConf] = useRecoilState($actionConf)
  const [flow, setFlow] = useRecoilState($newFlow)
  const formFields = useRecoilValue($formFields)
  const [isLoading, setIsLoading] = useState(false)
  const [snack, setSnackbar] = useState({ show: false })
  const [name, setName] = useState(wishlistMemberConf?.name || '')

  const saveConfig = () => {
    if (checkValidation(wishlistMemberConf)) {
      setSnackbar({
        show: true,
        msg: __('Please map all required fields to continue.', 'bit-integrations')
      })

      return
    }

    saveActionConf({
      flow,
      setFlow,
      allIntegURL,
      conf: wishlistMemberConf,
      navigate,
      edit: 1,
      setIsLoading,
      setSnackbar
    })
  }

  return (
    <div style={{ width: 900 }}>
      <SnackMsg snack={snack} setSnackbar={setSnackbar} />

      <div className="flx mt-3">
        <b className="wdt-200 d-in-b">{__('Integration Name:', 'bit-integrations')}</b>
        <input
          className="btcd-paper-inp w-5"
          onChange={e => {
            setName(e.target.value)
            setIntegrationName(e, setWishlistMemberConf)
          }}
          name="name"
          value={name}
          type="text"
          placeholder={__('Integration Name...', 'bit-integrations')}
        />
      </div>
      <br />

      <SetEditIntegComponents entity={flow.triggered_entity} setSnackbar={setSnackbar} />
      <WishlistMemberIntegLayout
        formID={formID}
        formFields={formFields}
        wishlistMemberConf={wishlistMemberConf}
        setWishlistMemberConf={setWishlistMemberConf}
        isLoading={isLoading}
        step={2}
        setIsLoading={setIsLoading}
        setSnackbar={setSnackbar}
        edit={wishlistMemberConf.lists}
      />

      <IntegrationStepThree
        edit
        saveConfig={saveConfig}
        disabled={checkValidation(wishlistMemberConf)}
        isLoading={isLoading}
        dataConf={wishlistMemberConf}
        setDataConf={setWishlistMemberConf}
        formFields={formFields}
      />
      <br />
    </div>
  )
}

export default EditWishlistMember
