import { useEffect, useState } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import { $btcbi, authInfoAtom } from '../../../GlobalStates'
import BackIcn from '../../../Icons/BackIcn'
import { __ } from '../../../Utils/i18nwrap'
import LoaderSm from '../../Loaders/LoaderSm'
import CopyText from '../../Utilities/CopyText'
import { handleAuthorize, refreshSpreadsheets, tokenHelper } from './GoogleSheetCommonFunc'
import tutorialLinks from '../../../Utils/StaticData/tutorialLinks'
import TutorialLink from '../../Utilities/TutorialLink'
import SelectAuthorizationType from '../../OneClickRadioComponents/SelectAuthorizationType'
import AuthorizationAccountList from '../../OneClickRadioComponents/AuthorizationAccountList'
import bitsFetch from '../../../Utils/bitsFetch'
import Loader from '../../Loaders/Loader'

export default function GoogleSheetAuthorization({
  formID,
  sheetConf,
  setSheetConf,
  step,
  setstep,
  isLoading,
  setIsLoading,
  setSnackbar,
  redirectLocation,
  isEdit,
  isInfo
}) {
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [error, setError] = useState({ clientId: '', clientSecret: '' })
  const btcbi = useRecoilValue($btcbi)
  const { googleSheet } = tutorialLinks
  const [authData, setAuthData] = useState([])
  const [authInfo, setAuthInfo] = useRecoilState(authInfoAtom)
  const [selectedAuthType, setSelectedAuthType] = useState('Custom Authorization')
  // const [selectedUserId, setSelectedUserId] = useState(null)

  //Commented for one click authorization

  // const handleChange = (option) => {
  //   setSelectedAuthType(option)
  //   setIsAuthorized(false)

  //   setSheetConf((prevConf) => ({
  //     ...prevConf,
  //     selectedAuthType: option,
  //     ...(option === "One Click Authorization" && process.env.NODE_ENV !== 'development'
  //       ? {
  //         clientId: '',
  //         clientSecret: '',
  //       }
  //       : {}),
  //   }))

  //   if (option === "One Click Authorization") {
  //     processAuth(option);
  //   }
  //   setIsLoading(false);
  // };

  const processAuth = option => {
    handleAuthorize(sheetConf, option, setError, setIsLoading)
  }

  const getAuthData = () => {
    setIsLoading(true)
    const queryParams = {
      actionName: sheetConf.type
    }

    bitsFetch(null, 'auth/get', queryParams, 'GET').then(res => {
      if (res.success && res.data.data.length > 0) {
        setAuthData(res.data.data)
      }
      setIsLoading(false)
    })
  }

  // useEffect(() => {
  //   if (step === 1) {
  //     getAuthData()
  //   }
  // }, [])

  // useEffect(() => {

  //   if (step === 1 && isEdit) {

  //     const authIdExists = authData.find(auth => auth.id === sheetConf.authId);

  //     if (authIdExists) {
  //       setSelectedUserId(sheetConf.authId)
  //     } else {
  //       setSelectedUserId(null)
  //     }
  //   }
  // }, [authData])

  const handleVerificationCode = async authInfo => {
    await tokenHelper(
      authInfo,
      sheetConf,
      setSheetConf,
      setIsAuthorized,
      selectedAuthType,
      authData,
      setAuthData,
      setIsLoading,
      setSnackbar
    )
    setAuthInfo(undefined)
    // getAuthData()
  }

  useEffect(() => {
    if (!authInfo || Object.keys(authInfo).length === 0) return

    handleVerificationCode(authInfo)
  }, [authInfo])

  const handleInput = e => {
    const newConf = { ...sheetConf }
    const rmError = { ...error }
    rmError[e.target.name] = ''
    newConf[e.target.name] = e.target.value
    setError(rmError)
    setSheetConf(newConf)
  }

  const nextPage = () => {
    // const selectedAuth = authData.find((item) => item.id === selectedUserId)
    // setSheetConf((prevConf) => ({
    //   ...prevConf,
    //   tokenDetails: selectedAuth ? selectedAuth.tokenDetails : '',
    //   authId: selectedAuth ? selectedAuth.id : '',
    // }))

    setTimeout(() => {
      document.getElementById('btcd-settings-wrp').scrollTop = 0
    }, 300)

    setstep(2)
    refreshSpreadsheets(formID, sheetConf, setSheetConf, setIsLoading, setSnackbar)
  }

  return (
    <div
      className="btcd-stp-page"
      style={{ ...{ width: step === 1 && 900 }, ...{ height: step === 1 && 'auto' } }}>
      {googleSheet?.youTubeLink && (
        <TutorialLink title="Google Sheets" youTubeLink={googleSheet?.youTubeLink} />
      )}
      {googleSheet?.docLink && <TutorialLink title="Google Sheets" docLink={googleSheet?.docLink} />}

      {/* <div>
        <h2>Choose channel</h2>
        <SelectAuthorizationType
          name="auth"
          options={['One Click Authorization', 'Custom Authorization']}
          selectedAuthType={selectedAuthType}
          handleChange={handleChange}
        />
      </div> */}

      {selectedAuthType === 'Custom Authorization' && (
        <div>
          <div className="mt-3">
            <b>{__('Integration Name:', 'bit-integrations')}</b>
          </div>
          <input
            className="btcd-paper-inp w-6 mt-1"
            onChange={handleInput}
            name="name"
            value={sheetConf.name}
            type="text"
            placeholder={__('Integration Name...', 'bit-integrations')}
            disabled={isInfo}
          />

          <div className="mt-3">
            <b>{__('Homepage URL:', 'bit-integrations')}</b>
          </div>
          <CopyText
            value={`${window.location.origin}`}
            className="field-key-cpy w-6 ml-0"
            setSnackbar={setSnackbar}
          />

          <div className="mt-3">
            <b>{__('Authorized Redirect URIs:', 'bit-integrations')}</b>
          </div>
          <CopyText
            value={redirectLocation || `${btcbi.api.base}/redirect`}
            className="field-key-cpy w-6 ml-0"
            setSnackbar={setSnackbar}
          />

          <small className="d-blk mt-5">
            {__('To get Client ID and SECRET , Please Visit', 'bit-integrations')}{' '}
            <a
              className="btcd-link"
              href="https://console.developers.google.com/apis/credentials"
              target="_blank"
              rel="noreferrer">
              {__('Google API Console', 'bit-integrations')}
            </a>
          </small>

          <div className="mt-3">
            <b>{__('Client id:', 'bit-integrations')}</b>
          </div>
          <input
            className="btcd-paper-inp w-6 mt-1"
            onChange={handleInput}
            name="clientId"
            value={sheetConf.clientId}
            type="text"
            placeholder={__('Client id...', 'bit-integrations')}
            disabled={isInfo}
          />
          <div style={{ color: 'red', fontSize: '15px' }}>{error.clientId}</div>

          <div className="mt-3">
            <b>{__('Client secret:', 'bit-integrations')}</b>
          </div>
          <input
            className="btcd-paper-inp w-6 mt-1"
            onChange={handleInput}
            name="clientSecret"
            value={sheetConf.clientSecret}
            type="text"
            placeholder={__('Client secret...', 'bit-integrations')}
            disabled={isInfo}
          />
          <div style={{ color: 'red', fontSize: '15px' }}>{error.clientSecret}</div>

          <button
            onClick={() => processAuth(selectedAuthType)}
            className="btn btcd-btn-lg purple sh-sm flx"
            type="button"
            disabled={isLoading || isInfo}>
            {isAuthorized || isInfo
              ? __('Authorized ✔', 'bit-integrations')
              : __('Authorize', 'bit-integrations')}
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
      {/* {authData.length > 0 &&
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
      } */}
      {isAuthorized && selectedAuthType === 'One Click Authorization' && (
        <button
          onClick={() => processAuth()}
          className="btn btcd-btn-lg purple sh-sm flx"
          type="button"
          disabled={isLoading}>
          {isAuthorized ? __('Authorized ✔', 'bit-integrations') : __('Authorize', 'bit-integrations')}
          {isLoading && <LoaderSm size={20} clr="#022217" className="ml-2" />}
        </button>
      )}
      <br />
      <button
        onClick={() => nextPage(2)}
        className="btn f-right btcd-btn-lg purple sh-sm flx"
        type="button"
        disabled={!isAuthorized}>
        {__('Next', 'bit-integrations')}
        <BackIcn className="ml-1 rev-icn" />
      </button>
    </div>
  )
}
