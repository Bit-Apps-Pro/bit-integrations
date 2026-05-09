import { useCallback } from 'react'
import { AUTH_TYPES } from '../../../Utils/connectionAuth'
import { __ } from '../../../Utils/i18nwrap'
import tutorialLinks from '../../../Utils/StaticData/tutorialLinks'
import PlatformAuthorization from '../../Connections/PlatformAuthorization'

export default function UserRegistrationMembershipAuthorization({
  userRegistrationConf,
  setUserRegistrationConf,
  step,
  nextPage,
  isInfo
}) {
  const setStep = useCallback(value => nextPage(value), [nextPage])
  return (
    <PlatformAuthorization
      config={userRegistrationConf}
      setConfig={setUserRegistrationConf}
      step={step}
      setStep={setStep}
      isInfo={isInfo}
      tutorialTitle="User Registration Membership"
      tutorialLinks={tutorialLinks?.userRegistrationMembership || {}}
      authDetails={{
        authType: AUTH_TYPES.NO_AUTH,
        platformCheck: { checks: [{ type: 'class', value: 'UserRegistration' }], logic: 'AND' }
      }}
      noteDetails={{
        note: __(
          'To use User Registration Membership integration, make sure the User Registration plugin is installed and active on your site.',
          'bit-integrations'
        )
      }}
    />
  )
}
