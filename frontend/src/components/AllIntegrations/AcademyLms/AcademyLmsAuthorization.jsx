import { useCallback } from 'react'
import { AUTH_TYPES } from '../../../Utils/connectionAuth'
import { __ } from '../../../Utils/i18nwrap'
import tutorialLinks from '../../../Utils/StaticData/tutorialLinks'
import PlatformAuthorization from '../../Connections/PlatformAuthorization'

export default function AcademyLmsAuthorization({
  academyLmsConf,
  setAcademyLmsConf,
  step,
  setStep,
  isInfo
}) {
  return (
    <PlatformAuthorization
      config={academyLmsConf}
      setConfig={setAcademyLmsConf}
      step={step}
      setStep={setStep}
      isInfo={isInfo}
      tutorialTitle="Academy LMS"
      tutorialLinks={tutorialLinks?.academyLms || {}}
      authDetails={{
        authType: AUTH_TYPES.WP_PLUGIN_CHECK,
        platformCheck: { checks: [{ type: 'plugin_file', value: 'academy/academy.php' }], logic: 'AND' }
      }}
      noteDetails={{
        note: __(
          'To use Academy LMS integration, make sure the Academy LMS plugin is installed and active on your site.',
          'bit-integrations'
        )
      }}
    />
  )
}
