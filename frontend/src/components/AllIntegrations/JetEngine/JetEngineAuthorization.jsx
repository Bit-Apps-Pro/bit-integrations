import { useCallback } from 'react'
import { AUTH_TYPES } from '../../../Utils/connectionAuth'
import { __ } from '../../../Utils/i18nwrap'
import tutorialLinks from '../../../Utils/StaticData/tutorialLinks'
import PlatformAuthorization from '../../Connections/PlatformAuthorization'

export default function JetEngineAuthorization({
  jetEngineConf,
  setJetEngineConf,
  step,
  setStep,
  isInfo
}) {
  return (
    <PlatformAuthorization
      config={jetEngineConf}
      setConfig={setJetEngineConf}
      step={step}
      setStep={setStep}
      isInfo={isInfo}
      tutorialTitle="JetEngine"
      tutorialLinks={tutorialLinks?.jetEngine || {}}
      authDetails={{
        authType: AUTH_TYPES.NO_AUTH,
        platformCheck: { checks: [{ type: 'plugin_file', value: 'jet-engine/jet-engine.php' }], logic: 'AND' }
      }}
      noteDetails={{
        note: __(
          'To use JetEngine integration, make sure the JetEngine plugin is installed and active on your site.',
          'bit-integrations'
        )
      }}
    />
  )
}
