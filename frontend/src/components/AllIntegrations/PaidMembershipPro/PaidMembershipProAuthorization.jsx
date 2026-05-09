import { useCallback } from 'react'
import { AUTH_TYPES } from '../../../Utils/connectionAuth'
import { __ } from '../../../Utils/i18nwrap'
import tutorialLinks from '../../../Utils/StaticData/tutorialLinks'
import PlatformAuthorization from '../../Connections/PlatformAuthorization'

export default function PaidMembershipProAuthorization({
  paidMembershipProConf,
  setPaidMembershipProConf,
  step,
  setStep,
  isInfo
}) {
  return (
    <PlatformAuthorization
      config={paidMembershipProConf}
      setConfig={setPaidMembershipProConf}
      step={step}
      setStep={setStep}
      isInfo={isInfo}
      tutorialTitle="Paid Memberships Pro"
      tutorialLinks={tutorialLinks?.paidMembershipPro || {}}
      authDetails={{
        authType: AUTH_TYPES.NO_AUTH,
        platformCheck: { checks: [{ type: 'plugin_file', value: 'paid-memberships-pro/paid-memberships-pro.php' }], logic: 'AND' }
      }}
      noteDetails={{
        note: __(
          'To use Paid Memberships Pro integration, make sure the Paid Memberships Pro plugin is installed and active on your site.',
          'bit-integrations'
        )
      }}
    />
  )
}
