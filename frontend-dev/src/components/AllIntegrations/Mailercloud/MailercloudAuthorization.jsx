import { useState } from 'react'
import AuthorizeButton from '../../Utilities/AuthorizeButton'
import ErrorField from '../../Utilities/ErrorField'
import GetInfo from '../../Utilities/GetInfo'
import Input from '../../Utilities/Input'
import Note from '../../Utilities/Note'
import StepPage from '../../Utilities/StepPage'
import { getAllLists, handleAuthorize, handleInput } from './MailercloudCommonFunc'
import tutorialLinks from '../../../Utils/StaticData/tutorialLinks'
import TutorialLink from '../../Utilities/TutorialLink'

function MailercloudAuthorization({ mailercloudConf, setMailercloudConf, step, setStep, isInfo, loading, setLoading }) {
  const [authorized, setAuthorized] = useState(false)
  const [error, setError] = useState({ name: '', authKey: '' })
  const { mailercloud } = tutorialLinks

  const nextPage = async () => {
    setTimeout(() => {
      document.getElementById('btcd-settings-wrp').scrollTop = 0
    }, 300)

    setStep(2)
    setLoading({ ...loading, page: true })
    const data = await getAllLists(mailercloudConf, setMailercloudConf)
    if (data) {
      setLoading({ ...loading, page: false })
    }
  }

  const note = `
  <h4> Step of get API Key:</h4>
  <ul>
    <li>Goto Account and click on <a href="https://app.mailercloud.com/account/api-integrations" target='_blank'>Integration</a></li>
    <li>Click on API Integrations .</li>
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
      {mailercloud?.youTubeLink && (
        <TutorialLink
          title={mailercloud?.title}
          youTubeLink={mailercloud?.youTubeLink}
        />
      )}
      {mailercloud?.docLink && (
        <TutorialLink
          title={mailercloud?.title}
          docLink={mailercloud?.docLink}
        />
      )}

      <div className="mt-2">

        {/* Mailercloud Authorization */}

        <Input
          label="Integration Name"
          name="name"
          placeholder="Integration Name..."
          value={mailercloudConf.name}
          onchange={(e) => handleInput(e, mailercloudConf, setMailercloudConf, error, setError)}
        />
        <Input
          label="API key"
          name="authKey"
          placeholder="API key..."
          value={mailercloudConf.authKey}
          onchange={(e) => handleInput(e, mailercloudConf, setMailercloudConf, error, setError)}
        />
        <ErrorField error={error.authKey} />
        <GetInfo
          url="https://app.mailercloud.com/account/api-integrations"
          info="To get API key, please visit"
        />
        {!isInfo && (
          <AuthorizeButton
            onclick={() => handleAuthorize(mailercloudConf, setError, setAuthorized, loading, setLoading)}
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

export default MailercloudAuthorization
