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
import BuddyBossIntegLayout from './BuddyBossIntegLayout'
import { handleInput } from './BuddyBossCommonFunc'

function EditBuddyBoss({ allIntegURL }) {
  const navigate = useNavigate()
  const { formID } = useParams()

  const [buddyBossConf, setBuddyBossConf] = useRecoilState($actionConf)
  const [flow, setFlow] = useRecoilState($newFlow)
  const formFields = useRecoilValue($formFields)
  const [isLoading, setIsLoading] = useState(false)
  const [snack, setSnackbar] = useState({ show: false })

  function isDisabled() {
    switch (buddyBossConf.mainAction) {
      case '1':
        return buddyBossConf.privacyId === undefined
      case '2':
        return buddyBossConf.groupId === undefined
      case '3':
        return buddyBossConf.friendId === undefined
      case '4':
        return buddyBossConf.friendId === undefined
      case '5':
        return buddyBossConf.forumId === undefined
      case '6':
        return buddyBossConf.groupId === undefined
      case '7':
        return buddyBossConf.friendId === undefined
      case '8':
        return buddyBossConf.groupId === undefined || buddyBossConf.friendId === undefined
      case '9':
        return buddyBossConf.groupId === undefined || buddyBossConf.friendId === undefined
      case '10':
        return buddyBossConf.friendId === undefined
      case '12':
        return buddyBossConf.friendId === undefined
      case '13':
        return buddyBossConf.forumId === undefined
      case '14':
        return buddyBossConf.groupId === undefined || buddyBossConf.friendId === undefined
      case '15':
        return buddyBossConf.friendId === undefined
      case '16':
        return buddyBossConf.friendId === undefined
      case '17':
        return buddyBossConf.topicId === undefined || buddyBossConf.forumId === undefined
      case '18':
        return buddyBossConf.userStatusId === undefined
      default:
        return false
    }
  }

  return (
    <div style={{ width: 900 }}>
      <SnackMsg snack={snack} setSnackbar={setSnackbar} />

      <div className="flx mt-3">
        <b className="wdt-200 d-in-b">{__('Integration Name:', 'bit-integrations')}</b>
        <input className="btcd-paper-inp w-5" onChange={e => handleInput(e, buddyBossConf, setBuddyBossConf)} name="name" value={buddyBossConf.name} type="text" placeholder={__('Integration Name...', 'bit-integrations')} />
      </div>
      <br />
      <br />

      <SetEditIntegComponents entity={flow.triggered_entity} setSnackbar={setSnackbar} />
      <BuddyBossIntegLayout
        formID={formID}
        formFields={formFields}
        handleInput={(e) => handleInput(e, buddyBossConf, setBuddyBossConf, setIsLoading, setSnackbar)}
        buddyBossConf={buddyBossConf}
        setBuddyBossConf={setBuddyBossConf}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        setSnackbar={setSnackbar}
      />

      <IntegrationStepThree
        edit
        saveConfig={() => saveActionConf({ flow, allIntegURL, conf: buddyBossConf, navigate, edit: 1, setIsLoading, setSnackbar })}
        disabled={!buddyBossConf.mainAction || isLoading || isDisabled()}
        isLoading={isLoading}
        dataConf={buddyBossConf}
        setDataConf={setBuddyBossConf}
        formFields={formFields}
      />
      <br />
    </div>
  )
}

export default EditBuddyBoss
