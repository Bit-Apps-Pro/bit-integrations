import { useState } from 'react'
import AuthorizeButton from '../../Utilities/AuthorizeButton'
import ErrorField from '../../Utilities/ErrorField'
import GetInfo from '../../Utilities/GetInfo'
import Input from '../../Utilities/Input'
import Note from '../../Utilities/Note'
import StepPage from '../../Utilities/StepPage'
import { getAllLists, handleAuthorize, handleInput } from './MoosendCommonFunc'
import tutorialLinks from '../../../Utils/StaticData/tutorialLinks'
import TutorialLink from '../../Utilities/TutorialLink'

function MoosendAuthorization({ moosendConf, setMoosendConf, step, setStep, loading, setLoading, isInfo }) {
  const [authorized, setAuthorized] = useState(false)
  const [error, setError] = useState({ name: '', authKey: '' })
  const { moosend } = tutorialLinks

  const nextPage = async () => {
    setTimeout(() => {
      document.getElementById('btcd-settings-wrp').scrollTop = 0
    }, 300)

    setStep(2)
    setLoading({ ...loading, page: true })
    const data = await getAllLists(moosendConf, setMoosendConf)
    if (data) {
      setLoading({ ...loading, page: false })
    }
  }

  const note = `
  <h4> Step of get API Key:</h4>
  <ul>
    <li>First login on account.</li>
    <li>Goto Settings and click on <b>API Key</b></li>
    <li>Copy the <b>API Key</b> and paste into <b>API Key</b> field of your authorization form.</li>
    <li>Finally, click <b>Authorize</b> button.</li>
</ul>
`

  return (
    <StepPage
      step={step}
      stepNo={1}
      style={{ width: 900, height: 'auto' }}
    >
      {moosend?.youTubeLink && (
        <TutorialLink
          title={moosend?.title}
          youTubeLink={moosend?.youTubeLink}
        />
      )}
      {moosend?.docLink && (
        <TutorialLink
          title={moosend?.title}
          docLink={moosend?.docLink}
        />
      )}

      <div className="mt-2">

        {/* Moosend Authorization */}

        <Input
          label="Integration Name"
          name="name"
          placeholder="Integration Name..."
          value={moosendConf.name}
          onchange={(e) => handleInput(e, moosendConf, setMoosendConf, error, setError)}
        />
        <Input
          label="API key"
          name="authKey"
          placeholder="API key..."
          value={moosendConf.authKey}
          onchange={(e) => handleInput(e, moosendConf, setMoosendConf, error, setError)}
        />
        <GetInfo
          url="https://moosend.com/"
          info="To get API key, please visit"
        />
        <ErrorField error={error.authKey} />
        {!isInfo && (
          <AuthorizeButton
            onclick={() => handleAuthorize(moosendConf, setError, setAuthorized, loading, setLoading)}
            nextPage={nextPage}
            auth={authorized}
            loading={loading.auth}
          />
        )}
      </div>

      <Note note={note} />
    </StepPage>
  )
}

export default MoosendAuthorization
