/* eslint-disable no-unused-vars */
// eslint-disable-next-line import/no-extraneous-dependencies
import { Link } from 'react-router-dom'
import { __ } from '../Utils/i18nwrap'
import greeting from '../resource/img/home.svg'

export default function Welcome({ setModal, isLicenseActive, actionHandler, integrations }) {
  return (
    <div className="btcd-greeting">
      <img src={greeting} alt="" />
      <h2>{__('Welcome to Bit Integrations', 'bit-integrations')}</h2>
      <div className="sub">
        {__('Thank you for installing Bit Integrations.', 'bit-integrations')}
      </div>
      {/* <Link to="/flow/new" className="btn round btcd-btn-lg dp-blue">
        {__('Create Integration', 'bit-integrations')}
      </Link> */}


      {(integrations.length >= 1 && !isLicenseActive) ?
        (
          // eslint-disable-next-line react/button-has-type
          <button className="btn round btcd-btn-lg dp-blue" onClick={(e) => actionHandler(e)}>
            {__('Create Integration', 'bit-integrations')}
          </button>
        )
        : (
          <Link to="/flow/new" className="btn round btcd-btn-lg dp-blue">
            {__('Create Integration', 'bit-integrations')}
          </Link>
        )}
    </div>
  )
}
