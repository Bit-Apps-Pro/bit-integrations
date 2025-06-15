import { useRecoilValue } from 'recoil'
import { $btcbi } from '../../../GlobalStates'
import { __, sprintf } from '../../../Utils/i18nwrap'
import { SmartTagField } from '../../../Utils/StaticData/SmartTagField'
import { memo } from 'react'

function SmartTagOptions() {
  const btcbi = useRecoilValue($btcbi)
  const { isPro } = btcbi

  return (
    <optgroup
      label={sprintf(
        __('General Smart Codes %s', 'bit-integrations'),
        isPro ? '' : `(${__('Pro', 'bit-integrations')})`
      )}>
      {isPro &&
        SmartTagField?.map((f, index) => (
          <option key={`ff-rm-${index}`} value={`\${${f.name}}`}>
            {f.label}
          </option>
        ))}
    </optgroup>
  )
}

export default memo(SmartTagOptions)
