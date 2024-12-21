import { useEffect, useState } from "react"
import bitsFetch from "../../../Utils/bitsFetch";
import { __ } from "../../../Utils/i18nwrap";
import AuthorizationAccountList from "../../OneClickRadioComponents/AuthorizationAccountList";


export default function ZohoCRMInfo({ crmConf, isInfo }) {

  const [authData, setAuthData] = useState([])

  useEffect(() => {
    const queryParams = {
      id: crmConf.authId
    }
    bitsFetch(null, 'auth/getbyId', queryParams, 'GET').then((res) => {
      if (res.success) {
        if (res.data.data.length > 0) {
          setAuthData(res.data.data);
        }
      }
    })
  }, []);
  return (
    <div style={{ width: '900px' }}>
      {crmConf.tokenDetails.selectedAuthType == 'Custom Authorization' && (
        <div>
          <h3>Account Details <small>(Custom Authorization)</small> </h3>
          <div className="mt-3"><b>{__('Client id:', 'bit-integrations')}</b></div>
          <input className="btcd-paper-inp w-6 mt-1" name="clientId" value={crmConf.clientId} type="text" placeholder={__('Client id...', 'bit-integrations')} disabled={isInfo} />

          <div className="mt-3"><b>{__('Client secret:', 'bit-integrations')}</b></div>
          <input className="btcd-paper-inp w-6 mt-1" name="clientSecret" value={crmConf.clientSecret} type="text" placeholder={__('Client secret...', 'bit-integrations')} disabled={isInfo} />

        </div>
      )}
      {(crmConf.tokenDetails.selectedAuthType == 'One Click Authorization' && authData.length !== 0) && (
        <div>
          <h3>Account Details <small>(One Click Authorization)</small> </h3>
          <AuthorizationAccountList
            authData={authData}
            isInfo={isInfo}
          />
        </div>
      )}
      {(crmConf.tokenDetails.selectedAuthType == 'One Click Authorization' && authData.length === 0) && (
        <div>
          <h3>The Authorized Account Has been Deleted. <small>(One Click Authorization)</small> </h3>
        </div>
      )}

    </div>
  )
}