import { useRecoilValue } from 'recoil'
import { $formFields } from '../../../GlobalStates'
import { __ } from '../../../Utils/i18nwrap'
import { memo } from 'react'

function FlowFormFieldsOptions() {
  const formFields = useRecoilValue($formFields)

  return (
    <optgroup label={__('Form Fields', 'bit-integrations')}>
      {formFields?.map((f, index) => (
        <option key={`ff-rm-${index}`} value={`\${${f.name}}`}>
          {f.label}
        </option>
      ))}
    </optgroup>
  )
}

export default memo(FlowFormFieldsOptions)
