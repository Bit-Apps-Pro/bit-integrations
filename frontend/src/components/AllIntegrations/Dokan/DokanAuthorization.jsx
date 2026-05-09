import { useCallback } from 'react'
import { AUTH_TYPES } from '../../../Utils/connectionAuth'
import { __ } from '../../../Utils/i18nwrap'
import tutorialLinks from '../../../Utils/StaticData/tutorialLinks'
import PlatformAuthorization from '../../Connections/PlatformAuthorization'

export default function DokanAuthorization({
  dokanConf,
  setDokanConf,
  step,
  setStep,
  isInfo
}) {
  return (
    <PlatformAuthorization
      config={dokanConf}
      setConfig={setDokanConf}
      step={step}
      setStep={setStep}
      isInfo={isInfo}
      tutorialTitle="Dokan"
      tutorialLinks={tutorialLinks?.dokan || {}}
      authDetails={{
        authType: AUTH_TYPES.NO_AUTH,
        platformCheck: { checks: [{ type: 'plugin_file', value: 'dokan-lite/dokan.php' }], logic: 'AND' }
      }}
      noteDetails={{
        note: __(
          'To use Dokan integration, make sure the Dokan plugin is installed and active on your site.',
          'bit-integrations'
        )
      }}
    />
  )
}
