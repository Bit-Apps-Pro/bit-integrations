import MultiSelect from 'react-multiple-select-dropdown-lite'
import 'react-multiple-select-dropdown-lite/dist/index.css'

function DropDown({
  options,
  placeholder,
  action,
  className,
  isMultiple,
  allowCustomOpt,
  value,
  addable,
  titleClassName,
  title,
  jsonValue
}) {
  return (
    <div className={`${titleClassName}`}>
      <span>{title}</span>
      <MultiSelect
        width="100%"
        defaultValue={value}
        className={`btcd-paper-drpdwn msl-wrp-options ${className}`}
        onChange={action}
        singleSelect={!isMultiple}
        customValue={allowCustomOpt || addable}
        placeholder={placeholder}
        jsonValue={jsonValue}
        options={options || []}
      />
    </div>
  )
}

export default DropDown
