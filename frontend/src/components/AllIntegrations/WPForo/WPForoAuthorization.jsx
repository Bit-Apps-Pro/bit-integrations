import { useCallback } from 'react'
import { AUTH_TYPES } from '../../../Utils/connectionAuth'
import { __ } from '../../../Utils/i18nwrap'
import tutorialLinks from '../../../Utils/StaticData/tutorialLinks'
import PlatformAuthorization from '../../Connections/PlatformAuthorization'

export default function WPForoAuthorization({
  wpforoConf,
  setWPForoConf,
  step,
  setStep,
  isInfo
}) {
  return (
    <PlatformAuthorization
      config={wpforoConf}
      setConfig={setWPForoConf}
      step={step}
      setStep={setStep}
      isInfo={isInfo}
      tutorialTitle="wpforo"
      tutorialLinks={tutorialLinks?.wpforo || {}}
      authDetails={{
        authType: AUTH_TYPES.NO_AUTH,
        platformCheck: { checks: [{ type: 'plugin_file', value: 'wpforo/wpforo.php' }], logic: 'AND' }
      }}
      noteDetails={{
        note: __(
          'To use wpForo integration, make sure the wpForo plugin is installed and active on your site.',
          'bit-integrations'
        )
      }}
    />
  )
}
