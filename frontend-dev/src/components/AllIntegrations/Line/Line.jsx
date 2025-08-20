/* eslint-disable no-unused-expressions */
import { useState } from 'react'
import 'react-multiple-select-dropdown-lite/dist/index.css'
import { useNavigate, useParams } from 'react-router-dom'
import { __ } from '../../../Utils/i18nwrap'
import SnackMsg from '../../Utilities/SnackMsg'
import Steps from '../../Utilities/Steps'
import { saveActionConf } from '../IntegrationHelpers/IntegrationHelpers'
import IntegrationStepThree from '../IntegrationHelpers/IntegrationStepThree'
import LineAuthorization from './LineAuthorization'
import { generateMappedField, handleInput, validateLineConfiguration } from './LineCommonFunc'
import LineIntegLayout from './LineIntegLayout'
import BackIcn from '../../../Icons/BackIcn'

function Line({ formFields, setFlow, flow, allIntegURL }) {
  const navigate = useNavigate()
  const { formID } = useParams()
  const [isLoading, setIsLoading] = useState(false)
  const [step, setstep] = useState(1)
  const [snack, setSnackbar] = useState({ show: false })

  const [lineConf, setLineConf] = useState({
    name: 'Line',
    replyToken: '',
    recipientId: '',
    type: 'Line',
    accessToken: '',
    parse_mode: 'HTML',
    messageTypes,
    emojis_field_map: generateMappedField(emojisFields),
    message_field_map: generateMappedField(messageField),
    sticker_field_map: generateMappedField(stickerFields),
    image_field_map: generateMappedField(imageFields),
    audio_field_map: generateMappedField(audioFields),
    video_field_map: generateMappedField(videoFields),
    location_field_map: generateMappedField(locationFields),
    body: '',
    actions: {},
    sendEmojis: false,
    messageField: messageField,
    sendSticker: false,
    sendImage: false,
    sendAudio: false,
    sendVideo: false,
    sendLocation: false,
    emojisFields,
    locationFields,
    stickerFields,
    imageFields,
    audioFields,
    videoFields
  })

  const nextPage = val => {
    setTimeout(() => {
      const wrapper = document.getElementById('btcd-settings-wrp')
      if (wrapper) {
        wrapper.scrollTop = 0
      }
    }, 300)

    if (val === 3 && !isNextButtonEnabled()) {
      setSnackbar({
        show: true,
        msg: __(
          'Enter a Recipient ID or Reply Token, and add a message to continue.',
          'bit-integrations'
        )
      })
      return
    }

    if (lineConf?.name && isNextButtonEnabled()) {
      setstep(val)
    }

    if (val !== 3) {
      return
    }
  }

  const isNextButtonEnabled = () => {
    return validateLineConfiguration(lineConf)
  }

  return (
    <div>
      <SnackMsg snack={snack} setSnackbar={setSnackbar} />
      <div className="txt-center mt-2">
        <Steps step={3} active={step} />
      </div>

      {/* STEP 1 */}
      <LineAuthorization
        formID={formID}
        lineConf={lineConf}
        setLineConf={setLineConf}
        step={step}
        setstep={setstep}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        setSnackbar={setSnackbar}
      />

      {/* STEP 2 */}
      <div
        className="btcd-stp-page"
        style={{
          ...(step === 2 && {
            width: 900,
            height: 'auto',
            overflow: 'visible'
          })
        }}>
        <LineIntegLayout
          formFields={formFields}
          handleInput={e => handleInput(e, lineConf, setLineConf, setIsLoading, setSnackbar)}
          lineConf={lineConf}
          setLineConf={setLineConf}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          setSnackbar={setSnackbar}
        />

        <button
          onClick={() => nextPage(3)}
          disabled={!isNextButtonEnabled()}
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
          saveActionConf({
            flow,
            setFlow,
            allIntegURL,
            conf: lineConf,
            navigate,
            setIsLoading,
            setSnackbar
          })
        }
        isLoading={isLoading}
        dataConf={lineConf}
        setDataConf={setLineConf}
        formFields={formFields}
      />
    </div>
  )
}

export default Line

const messageTypes = [
  { name: 'sendPushMessage', label: __('Send a Push Message', 'bit-integrations'), is_pro: false },
  { name: 'sendReplyMessage', label: __('Send a Reply Message', 'bit-integrations'), is_pro: true },
  {
    name: 'sendBroadcastMessage',
    label: __('Send Broadcast Message', 'bit-integrations'),
    is_pro: true
  }
]

const emojisFields = [
  { label: __('Emojis ID', 'bit-integrations'), value: 'emojis_id', required: true },
  { label: __('Product Id', 'bit-integrations'), value: 'product_id', required: true },
  {
    label: __('Emoji Position (0-based index in text)', 'bit-integrations'),
    value: 'index',
    required: true
  }
]

const stickerFields = [
  { label: __('Sticker ID', 'bit-integrations'), value: 'sticker_id', required: true },
  { label: __('Package Id', 'bit-integrations'), value: 'package_id', required: true }
]

const imageFields = [
  {
    label: __("Image's Original Content URL", 'bit-integrations'),
    value: 'originalContentUrl',
    required: true
  },
  {
    label: __("Image's Preview Image URL", 'bit-integrations'),
    value: 'previewImageUrl',
    required: true
  }
]

const audioFields = [
  {
    label: __("Audio's Original Content URL", 'bit-integrations'),
    value: 'originalContentUrl',
    required: true
  },
  { label: __('Duration', 'bit-integrations'), value: 'duration', required: true }
]

const videoFields = [
  { label: __('Original Content URL', 'bit-integrations'), value: 'originalContentUrl', required: true },
  { label: __('Preview Image URL', 'bit-integrations'), value: 'previewImageUrl', required: true }
]

const locationFields = [
  { label: __('Title', 'bit-integrations'), value: 'title', required: true },
  { label: __('Address', 'bit-integrations'), value: 'address', required: true },
  { label: __('Latitude', 'bit-integrations'), value: 'latitude', required: true },
  { label: __('longitude', 'bit-integrations'), value: 'longitude', required: true }
]

const messageField = [{ label: __('Message', 'bit-integrations'), value: 'message', required: true }]
