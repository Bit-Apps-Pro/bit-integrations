import { useState } from 'react'
import AuthorizeButton from '../../Utilities/AuthorizeButton'
import ErrorField from '../../Utilities/ErrorField'
import GetInfo from '../../Utilities/GetInfo'
import Input from '../../Utilities/Input'
import Note from '../../Utilities/Note'
import StepPage from '../../Utilities/StepPage'
import { getAllTags, handleAuthorize, handleInput } from './SelzyCommonFunc'
import tutorialLinks from '../../../Utils/StaticData/tutorialLinks'
import TutorialLink from '../../Utilities/TutorialLink'

function SelzyAuthorization({ selzyConf, setSelzyConf, step, setStep, loading, setLoading, isInfo }) {
  const [authorized, setAuthorized] = useState(false)
  const [error, setError] = useState({ name: '', authKey: '' })
  const { selzy } = tutorialLinks

  const nextPage = async () => {
    setTimeout(() => {
      document.getElementById('btcd-settings-wrp').scrollTop = 0
    }, 300)
    setStep(2)
    setLoading({ ...loading, page: true })
    const data = await getAllTags(selzyConf, setSelzyConf)
    if (data) {
      setLoading({ ...loading, page: false })
    }
  }

  const note = `
  <h4> Step of get API Key:</h4>
  <ul>
    <li>Goto Settings and click on <a href="https://cp.selzy.com/en/v5/user/info/api" target='_blank'>Integration and API.</a></li>
    <li>API access section API key click show full.</li>
    <li>Enter your password and click send</li>
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
      {selzy?.youTubeLink && (
        <TutorialLink
          title={selzy?.title}
          youTubeLink={selzy?.youTubeLink}
        />
      )}
      {selzy?.docLink && (
        <TutorialLink
          title={selzy?.title}
          docLink={selzy?.docLink}
        />
      )}

      <div className="mt-2">
        {/* SelzyAuthorization */}
        <Input
          label="Integration Name"
          name="name"
          placeholder="Integration Name..."
          value={selzyConf.name}
          onchange={(e) => handleInput(e, selzyConf, setSelzyConf, error, setError)}
        />
        <Input
          label="API key"
          name="authKey"
          placeholder="API key..."
          value={selzyConf.authKey}
          onchange={(e) => handleInput(e, selzyConf, setSelzyConf, error, setError)}
        />
        <ErrorField error={error.authKey} />
        <GetInfo
          url="https://cp.selzy.com/en/v5/user/info/api"
          info="To get API key, please visit"
        />
        {!isInfo && (
          <AuthorizeButton
            onclick={() => handleAuthorize(selzyConf, setSelzyConf, setError, setAuthorized, loading, setLoading)}
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

export default SelzyAuthorization
