import { useCallback } from 'react'
import { AUTH_TYPES } from '../../../Utils/connectionAuth'
import { __ } from '../../../Utils/i18nwrap'
import tutorialLinks from '../../../Utils/StaticData/tutorialLinks'
import PlatformAuthorization from '../../Connections/PlatformAuthorization'

export default function LifterLmsAuthorization({
  lifterLmsConf,
  setLifterLmsConf,
  step,
  setStep,
  isInfo
}) {
  return (
    <PlatformAuthorization
      config={lifterLmsConf}
      setConfig={setLifterLmsConf}
      step={step}
      setStep={setStep}
      isInfo={isInfo}
      tutorialTitle="LifterLMS"
      tutorialLinks={tutorialLinks?.lifterLms || {}}
      authDetails={{
        authType: AUTH_TYPES.NO_AUTH,
        platformCheck: { checks: [{ type: 'plugin_file', value: 'lifterlms/lifterlms.php' }], logic: 'AND' }
      }}
      noteDetails={{
        note: __(
          'To use LifterLMS integration, make sure the LifterLMS plugin is installed and active on your site.',
          'bit-integrations'
        )
      }}
    />
  )
}
