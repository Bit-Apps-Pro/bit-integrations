/* eslint-disable no-param-reassign */
// import { __ } from '../../../Utils/i18nwrap'
// import TableCheckBox from '../../Utilities/TableCheckBox'

export default function UserRegistrationMembershipActions({ userRegistrationConf, setUserRegistrationConf }) {
  // const actionHandler = (e, type) => {
  //   const newConf = { ...userRegistrationConf }
  //   if (type === 'update') {
  //     if (e.target.checked) {
  //       newConf.actions.update = true
  //     } else {
  //       delete newConf.actions.update
  //     }
  //   }
  //   setUserRegistrationConf({ ...newConf })
  // }

  return (
    <div className="pos-rel d-flx w-8">
      {/* <TableCheckBox
        checked={userRegistrationConf?.actions?.update || false}
        onChange={(e) => actionHandler(e, 'update')}
        className="wdt-200 mt-4 mr-2"
        value="user_update"
        title={__('Update User', 'bit-integrations')}
        subTitle={__('Update existing user if user already exists', 'bit-integrations')}
      /> */}
    </div>
  )
}
