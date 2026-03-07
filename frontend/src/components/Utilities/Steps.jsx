import { Fragment } from 'react'

function Steps({ step, active, className }) {
  return (
    <div className={`d-in-b ${className}`}>
      <div className="flx flx-center">
        {Array(active)
          .fill(0)
          .map((itm, i) => (
            <Fragment key={`stp-${i + 21}`}>
              <div className="btcd-stp flx flx-center stp-a  txt-center">{i + 1}</div>
              {active - 1 !== i && <div className="btcd-stp-line stp-line-a" />}
            </Fragment>
          ))}
        {step - active !== 0 && <div className="btcd-stp-line" />}
        {Array(step - active)
          .fill(0)
          .map((itm, i) => (
            <Fragment key={`stp-${i + 23}`}>
              <div className="btcd-stp flx flx-center txt-center">{i + active + 1}</div>
              {step - active - 1 !== i && <div className="btcd-stp-line " />}
            </Fragment>
          ))}
      </div>
    </div>
  )
}

export default Steps
