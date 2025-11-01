import React from 'react'

const AddFieldButton = ({
  fieldMapLength,
  lineConf,
  setLineConf,
  fields,
  isLoading,
  sendType,
  addFieldMapFunc
}) => {
  if (!lineConf[sendType] || isLoading) return null

  const handleClick = () => {
    addFieldMapFunc(fieldMapLength, lineConf, setLineConf, fields)
  }

  return (
    <div className="txt-center btcbi-field-map-button mt-2">
      <button onClick={handleClick} className="icn-btn sh-sm" type="button">
        +
      </button>
    </div>
  )
}

export default AddFieldButton
