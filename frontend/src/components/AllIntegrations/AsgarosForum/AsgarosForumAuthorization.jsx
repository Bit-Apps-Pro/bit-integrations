import { useCallback } from 'react'
import { AUTH_TYPES } from '../../../Utils/connectionAuth'
import { __ } from '../../../Utils/i18nwrap'
import PlatformAuthorization from '../../Connections/PlatformAuthorization'

export default function AsgarosForumAuthorization({
  asgarosForumConf,
  setAsgarosForumConf,
  step,
  nextPage,
  isInfo
}) {
  const setStep = useCallback(value => nextPage(value), [nextPage])
  return (
    <PlatformAuthorization
      config={asgarosForumConf}
      setConfig={setAsgarosForumConf}
      step={step}
      setStep={setStep}
      isInfo={isInfo}
      authDetails={{
        authType: AUTH_TYPES.NO_AUTH,
        platformCheck: { checks: [{ type: 'class', value: 'AsgarosForum' }], logic: 'AND' }
      }}
      noteDetails={{
        note: __(
          'To use Asgaros Forum integration, make sure the Asgaros Forum plugin is installed and active on your site.',
          'bit-integrations'
        )
      }}
    />
  )
}
