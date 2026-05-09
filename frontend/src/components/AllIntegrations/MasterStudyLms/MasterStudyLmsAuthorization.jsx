import { useCallback } from 'react'
import { AUTH_TYPES } from '../../../Utils/connectionAuth'
import { __ } from '../../../Utils/i18nwrap'
import tutorialLinks from '../../../Utils/StaticData/tutorialLinks'
import PlatformAuthorization from '../../Connections/PlatformAuthorization'

export default function MasterStudyLmsAuthorization({
  msLmsConf,
  setMsLmsConf,
  step,
  setStep,
  isInfo
}) {
  return (
    <PlatformAuthorization
      config={msLmsConf}
      setConfig={setMsLmsConf}
      step={step}
      setStep={setStep}
      isInfo={isInfo}
      tutorialTitle="MasterStudy LMS"
      tutorialLinks={tutorialLinks?.masterStudyLMS || {}}
      authDetails={{
        authType: AUTH_TYPES.NO_AUTH,
        platformCheck: {
          groups: [
            { logic: 'AND', checks: [{ type: 'plugin_file', value: 'masterstudy-lms-learning-management-system/masterstudy-lms-learning-management-system.php' }] },
            { logic: 'AND', checks: [{ type: 'plugin_file', value: 'masterstudy-lms-learning-management-system-pro/masterstudy-lms-learning-management-system-pro.php' }] }
          ],
          logic: 'OR'
        }
      }}
      noteDetails={{
        note: __(
          'To use MasterStudy LMS integration, make sure the MasterStudy LMS plugin is installed and active on your site.',
          'bit-integrations'
        )
      }}
    />
  )
}
