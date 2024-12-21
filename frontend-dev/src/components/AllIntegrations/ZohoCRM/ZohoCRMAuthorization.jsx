import { useEffect, useState } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import { __ } from '../../../Utils/i18nwrap'
import CopyText from '../../Utilities/CopyText'
import LoaderSm from '../../Loaders/LoaderSm'
import { handleAuthorize, refreshModules, tokenHelper } from './ZohoCRMCommonFunc'
import { $btcbi, authInfoAtom } from '../../../GlobalStates'
import tutorialLinks from '../../../Utils/StaticData/tutorialLinks'
import TutorialLink from '../../Utilities/TutorialLink'
import SelectAuthorizationType from '../../OneClickRadioComponents/SelectAuthorizationType'
import Loader from '../../Loaders/Loader'
import BackIcn from '../../../Icons/BackIcn'
import AuthorizationAccountList from '../../OneClickRadioComponents/AuthorizationAccountList'
import bitsFetch from '../../../Utils/bitsFetch'

export default function ZohoCRMAuthorization({
  formID,
  crmConf,
  setCrmConf,
  step,
  setstep,
  isLoading,
  setIsLoading,
  setSnackbar,
  redirectLocation,
  isEdit
}) {

  const [isAuthorized, setisAuthorized] = useState(false)
  const [error, setError] = useState({ dataCenter: '', clientId: '', clientSecret: '' })
  const btcbi = useRecoilValue($btcbi)
  const { zohoCRM } = tutorialLinks
  const [authData, setAuthData] = useState([])
  const [authInfo, setAuthInfo] = useRecoilState(authInfoAtom);
  const [selectedAuthType, setSelectedAuthType] = useState('')
  const [selectedUserId, setSelectedUserId] = useState(null)

  const scopes = 'ZohoCRM.modules.ALL,ZohoCRM.settings.ALL,ZohoCRM.users.Read,zohocrm.files.CREATE'
  const nextPage = () => {
    console.log('crmConf', crmConf)
    const selectedAuth = authData.find((item) => item.id === selectedUserId)
    setCrmConf((prevConf) => ({
      ...prevConf,
      tokenDetails: selectedAuth ? selectedAuth.tokenDetails : '',
      authId: selectedAuth ? selectedAuth.id : '',
      dataCenter: (selectedAuth?.tokenDetails?.selectedAuthType ?? crmConf?.tokenDetails) === 'One Click Authorization' ? 'com' : '',
    }))

    setTimeout(() => {
      document.getElementById('btcd-settings-wrp').scrollTop = 0
    }, 300)

    setstep(2)
    !crmConf.module && refreshModules(formID, {
      ...crmConf, tokenDetails: selectedAuth ? selectedAuth.tokenDetails : '', authId: selectedAuth ? selectedAuth.id : '',
      dataCenter: selectedAuth.tokenDetails.selectedAuthType === 'One Click Authorization' ? 'com' : ''
    }, setCrmConf, setIsLoading, setSnackbar)
  }
  const handleInput = (e) => {
    const newConf = { ...crmConf }
    const rmError = { ...error }
    rmError[e.target.name] = ''
    newConf[e.target.name] = e.target.value
    setError(rmError)
    setCrmConf(newConf)
  }

  //Commented for one click authorization

  const handleChange = (option) => {
    setSelectedAuthType(option)
    setisAuthorized(false)

    setCrmConf((prevConf) => ({
      ...prevConf,
      selectedAuthType: option,
      ...(option === "One Click Authorization" && process.env.NODE_ENV !== 'development'
        ? {
          clientId: '',
          clientSecret: '',
        }
        : {}),
    }))

    if (option === "One Click Authorization") {
      processAuth(option);
    }
    setIsLoading(false);
  };


  const processAuth = (option) => {
    handleAuthorize('zohoCRM',
      'zcrm',
      option,
      scopes,
      crmConf,
      setCrmConf,
      setError,
      setisAuthorized,
      setIsLoading,
      setSnackbar,
      btcbi);
  }

  const getAuthData = () => {
    setIsLoading(true)
    const queryParams = {
      actionName: crmConf.type
    }

    bitsFetch(null, 'auth/get', queryParams, 'GET').then((res) => {
      if (res.success && res.data.data.length > 0) {
        setAuthData(res.data.data);
      }
      setIsLoading(false)
    })
  }

  useEffect(() => {
    if (step === 1) {
      getAuthData()
    }
  }, [])



  const handleVerificationCode = async (authInfo) => {
    await tokenHelper(authInfo, crmConf, setCrmConf, selectedAuthType, setAuthData, setIsLoading, setSnackbar);
    setAuthInfo(undefined)
    getAuthData()
  }

  useEffect(() => {
    if (!authInfo || Object.keys(authInfo).length === 0) return;
    handleVerificationCode(authInfo);
  }, [authInfo]);



  useEffect(() => {

    if (step === 1 && isEdit) {

      const authIdExists = authData.find(auth => auth.id === crmConf.authId);

      if (authIdExists) {
        setSelectedUserId(crmConf.authId)
      } else {
        setSelectedUserId(null)
      }
    }
  }, [authData])

  console.log('authData.length === 0 && !isEdit && (crmConf.tokenDetails == null)', authData.length === 0 && !isEdit && !(crmConf.tokenDetails))
  return (
    <div
      className="btcd-stp-page"
      style={{ ...{ width: step === 1 && 900 }, ...{ height: step === 1 && 'auto' } }}>
      {zohoCRM?.youTubeLink && <TutorialLink title="Zoho CRM" youTubeLink={zohoCRM?.youTubeLink} />}
      {zohoCRM?.docLink && <TutorialLink title="Zoho CRM" docLink={zohoCRM?.docLink} />}

      <div>
        <h2>Choose channel</h2>
        <SelectAuthorizationType
          name="auth"
          options={['One Click Authorization', 'Custom Authorization']}
          selectedAuthType={selectedAuthType}
          handleChange={handleChange}
        />
      </div>
      {selectedAuthType === "Custom Authorization" && (
        <div>
          <div className="mt-3">
            <b>{__('Integration Name:', 'bit-integrations')}</b>
          </div>
          <input
            className="btcd-paper-inp w-6 mt-1"
            onChange={handleInput}
            name="name"
            value={crmConf.name}
            type="text"
            placeholder={__('Integration Name...', 'bit-integrations')}

          />

          <div className="mt-3">
            <b>{__('Data Center:', 'bit-integrations')}</b>
          </div>
          <select
            onChange={handleInput}
            name="dataCenter"
            value={crmConf.dataCenter}
            className="btcd-paper-inp w-6 mt-1"
          >
            <option value="">{__('--Select a data center--', 'bit-integrations')}</option>
            <option value="com">zoho.com</option>
            <option value="eu">zoho.eu</option>
            <option value="com.cn">zoho.com.cn</option>
            <option value="in">zoho.in</option>
            <option value="com.au">zoho.com.au</option>
          </select>
          <div style={{ color: 'red' }}>{error.dataCenter}</div>

          <div className="mt-3">
            <b>{__('Homepage URL:', 'bit-integrations')}</b>
          </div>
          <CopyText
            value={`${window.location.origin}`}
            setSnackbar={setSnackbar}
            className="field-key-cpy w-6 ml-0"
          />

          <div className="mt-3">
            <b>{__('Authorized Redirect URIs:', 'bit-integrations')}</b>
          </div>
          <CopyText
            value={redirectLocation || `${btcbi.api.base}/redirect`}
            setSnackbar={setSnackbar}
            className="field-key-cpy w-6 ml-0"
          />

          <small className="d-blk mt-5">
            {__('To get Client ID and SECRET , Please Visit', 'bit-integrations')}{' '}
            <a
              className="btcd-link"
              href={`https://api-console.zoho.${crmConf?.dataCenter || 'com'}/`}
              target="_blank"
              rel="noreferrer">
              {__('Zoho API Console', 'bit-integrations')}
            </a>
          </small>

          <div className="mt-3">
            <b>{__('Client id:', 'bit-integrations')}</b>
          </div>
          <input
            className="btcd-paper-inp w-6 mt-1"
            onChange={handleInput}
            name="clientId"
            value={crmConf.clientId}
            type="text"
            placeholder={__('client ID...', 'bit-integrations')}

          />
          <div style={{ color: 'red' }}>{error.clientId}</div>

          <div className="mt-3">
            <b>{__('Client secret:', 'bit-integrations')}</b>
          </div>
          <input
            className="btcd-paper-inp w-6 mt-1"
            onChange={handleInput}
            name="clientSecret"
            value={crmConf.clientSecret}
            type="text"
            placeholder={__('client Secret...', 'bit-integrations')}

          />
          <div style={{ color: 'red' }}>{error.clientSecret}</div>


          <button onClick={() => processAuth(selectedAuthType)} className="btn btcd-btn-lg purple sh-sm flx" type="button" disabled={isLoading}>
            {isAuthorized ? __('Authorized ✔', 'bit-integrations') : __('Authorize', 'bit-integrations')}
            {isLoading && <LoaderSm size={20} clr="#022217" className="ml-2" />}
          </button>
          <br />
        </div>
      )}
      {isLoading && selectedAuthType !== 'Custom Authorization' && (
        <Loader
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: 100,
            transform: 'scale(0.7)'
          }}
        />
      )}
      {authData.length > 0 &&
        <>
          <h2>Choose your connected account</h2>
          <AuthorizationAccountList
            authData={authData}
            setAuthData={setAuthData}
            selectedUserId={selectedUserId}
            setSelectedUserId={setSelectedUserId}
            setIsLoading={setIsLoading}
            isEdit={isEdit}
          />
        </>
      }

      {(isAuthorized && selectedAuthType === "One Click Authorization") &&
        (<button onClick={() => processAuth()} className="btn btcd-btn-lg purple sh-sm flx" type="button" disabled={isLoading}>
          {isAuthorized ? __('Authorized ✔', 'bit-integrations') : __('Authorize', 'bit-integrations')}
          {isLoading && <LoaderSm size={20} clr="#022217" className="ml-2" />}
        </button>
        )}
      <br />
      <button onClick={() => nextPage(2)} className="btn f-right btcd-btn-lg purple sh-sm flx" type="button" disabled={!selectedUserId && (authData.length === 0 && !isEdit && !(crmConf.tokenDetails))}>
        {__('Next', 'bit-integrations')}
        <BackIcn className="ml-1 rev-icn" />
      </button>
    </div>
  )
}
