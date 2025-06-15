import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { __ } from '../../../Utils/i18nwrap'
// import { postFields } from '../../../Utils/StaticData/postField'
import Cooltip from '../../Utilities/Cooltip'
import SnackMsg from '../../Utilities/SnackMsg'
import Steps from '../../Utilities/Steps'
import CustomField from './CustomField'
import { postFields } from '../../../Utils/StaticData/postField'
import { addFieldMap, checkMappedAcfFields, checkMappedMbFields, checkMappedPostFields, refreshPostTypes } from './PostHelperFunction'
import FieldMap from './FieldMap'
import bitsFetch from '../../../Utils/bitsFetch'
import { saveIntegConfig } from '../IntegrationHelpers/IntegrationHelpers'
import IntegrationStepThree from '../IntegrationHelpers/IntegrationStepThree'
import tutorialLinks from '../../../Utils/StaticData/tutorialLinks'
import TutorialLink from '../../Utilities/TutorialLink'

function Post({ formFields, setFlow, flow, allIntegURL }) {
  const [users, setUsers] = useState([])
  const [postTypes, setPostTypes] = useState([])
  const navigate = useNavigate()
  const { formID } = useParams()
  const [isLoading, setIsLoading] = useState(false)
  const [step, setstep] = useState(1)
  const [snack, setSnackbar] = useState({ show: false })
  const [acf, setAcf] = useState({ fields: [], files: [] })
  const [mb, setMb] = useState({ fields: [], files: [] })
  const { postCreation } = tutorialLinks

  const [postConf, setPostConf] = useState({
    name: 'Post Creation',
    type: 'Post Creation',
    post_map: [{ post_author: 'logged_in_user' }],
    acf_map: [{}],
    acf_file_map: [{}],
    metabox_map: [{}],
    metabox_file_map: [{}],
  })

  const handleInput = (typ, val) => {
    const tmpData = { ...postConf }
    tmpData[typ] = val
    setPostConf(tmpData)
  }

  useEffect(() => {
    bitsFetch(
      {},
      'user/list',
    ).then((res) => {
      const { data } = res
      setUsers(data)
    })

    bitsFetch(
      {},
      'post-types/list',
    ).then((res) => {
      const { data } = res
      setPostTypes(data)
    })
    const newConf = { ...postConf }
    newConf.post_map = postFields.filter(fld => fld.required).map(fl => ({ formField: '', postField: fl.key, required: fl.required }))
    setPostConf(newConf)
  }, [])

  const getCustomFields = (typ, val) => {
    const tmpData = { ...postConf }
    tmpData[typ] = val
    bitsFetch(
      { post_type: val },
      'customfield/list',
    ).then((res) => {
      const { data } = res
      setAcf({ fields: data.acf_fields, files: data.acf_files })
      setMb({ fields: data.mb_fields, files: data.mb_files })

      if (data?.acf_fields) {
        tmpData.acf_map = data.acf_fields.filter(fld => fld.required).map(fl => ({ formField: '', acfField: fl.key, required: fl.required }))
        if (tmpData.acf_map.length < 1) {
          tmpData.acf_map = [{}]
        }
      }
      if (data?.mb_fields) {
        tmpData.metabox_map = data.mb_fields.filter(fld => fld.required).map(fl => ({ formField: '', metaboxField: fl.key, required: fl.required }))
        if (tmpData.metabox_map.length < 1) {
          tmpData.metabox_map = [{}]
        }
      }
    })

    //  tmpData.metabox_map = postFields.filter(fld => fld.required).map(fl => ({ formField: '', postFormField: fl.key, required: fl.required }))
    setPostConf(tmpData)
    // setLoad(false)
  }

  const nextPage = (stepNo) => {
    setTimeout(() => {
      document.getElementById('btcd-settings-wrp').scrollTop = 0
    }, 300)

    if (!checkMappedPostFields(postConf)) {
      setSnackbar({ show: true, msg: __('Please map mandatory fields', 'bit-integrations') })
      return
    }
    if (!postConf.post_type) {
      setSnackbar({ show: true, msg: __('Post Type cann\'t be empty', 'bit-integrations') })
      return
    }
    if (!postConf.post_status) {
      setSnackbar({ show: true, msg: __('Post Status cann\'t be empty', 'bit-integrations') })
      return
    }

    if (stepNo === 3) {
      if (!checkMappedAcfFields(postConf)) {
        setSnackbar({ show: true, msg: __('Please map mandatory fields', 'bit-integrations') })
        return
      }

      if (!checkMappedMbFields(postConf)) {
        setSnackbar({ show: true, msg: __('Please map mandatory fields', 'bit-integrations') })
        return
      }
    }
    setstep(stepNo)
  }

  const saveConfig = () => {
    setIsLoading(true)
    const resp = saveIntegConfig(flow, setFlow, allIntegURL, postConf, navigate, '', '', setIsLoading)
    resp.then(res => {
      if (res.success) {
        setSnackbar({ show: true, msg: res.data?.msg })
        navigate(allIntegURL)
      } else {
        setSnackbar({ show: true, msg: res.data || res })
      }
    })
  }

  return (
    <div>
      <SnackMsg snack={snack} setSnackbar={setSnackbar} />
      {postCreation?.youTubeLink && (
        <TutorialLink
          title={postCreation?.title}
          youTubeLink={postCreation?.youTubeLink}
        />
      )}
      {postCreation?.docLink && (
        <TutorialLink
          title={postCreation?.title}
          docLink={postCreation?.docLink}
        />
      )}

      <div className="txt-center mt-2"><Steps step={3} active={step} /></div>
      <div className="btcd-stp-page" style={{ ...{ width: step === 1 && 900 }, ...{ height: step === 1 && 'auto' } }}>

        <div className="mt-3"><b>{__('Integration Name ', 'bit-integrations')}</b></div>
        <input className="btcd-paper-inp w-5 mt-1" onChange={(e) => handleInput(e.target.name, e.target.value)} name="name" value={postConf.name} type="text" placeholder={__('Integration Name...', 'bit-integrations')} />

        <div className="mt-3 flx">
          <b>{__('Post Type', 'bit-integrations')}</b>
          <Cooltip width={250} icnSize={17} className="ml-2">
            <div className="txt-body">
              Select one of the defined WordPress post types Or custom post types for the post.
              <br />
            </div>
          </Cooltip>
        </div>
        <div>
          <select name="post_type" onChange={(e) => getCustomFields(e.target.name, e.target.value)} className="btcd-paper-inp w-5 mt-1">
            <option disabled selected>Select Post Type</option>
            {postTypes?.map((postType, key) => (
              <option key={`acf-${key * 2}`} value={postType?.id}>{postType?.title}</option>
            ))}
          </select>
          <button onClick={() => refreshPostTypes(postTypes, setPostTypes)} className="icn-btn sh-sm ml-2 mr-2 tooltip" style={{ '--tooltip-txt': `'${__('Refresh Post Types', 'bit-integrations')}'` }} type="button">&#x21BB;</button>
        </div>

        <div className="mt-3">
          <b>{__('Post Status', 'bit-integrations')}</b>
          <Cooltip width={250} icnSize={17} className="ml-2">
            <div className="txt-body">
              Select the status for the post. If published status is selected and the post date is in the future, it will automatically be changed to scheduled
              <br />
            </div>
          </Cooltip>
        </div>
        <select name="post_status" onChange={(e) => handleInput(e.target.name, e.target.value)} className="btcd-paper-inp w-5 mt-2">
          <option disabled selected>{__('Select Status', 'bit-integrations')}</option>
          <option value="publish">Publish</option>
          <option value="draft">Draft</option>
          <option value="auto-draft">Auto-Draft</option>
          <option value="private">Private</option>
          <option value="pending">Pending</option>
        </select>

        <div className="mt-3 flx">
          <b>{__('Author', 'bit-integrations')}</b>
          <Cooltip width={250} icnSize={17} className="ml-2">
            <div className="txt-body">
              Select the user to be assigned to the post.
              <br />
            </div>
          </Cooltip>
        </div>
        <div>
          <select name="post_author" onChange={(e) => handleInput(e.target.name, e.target.value)} className="btcd-paper-inp w-5 mt-2">
            <option disabled selected>{__('Select Author', 'bit-integrations')}</option>
            <option value="logged_in_user">Logged In User</option>
            {users?.map((user, key) => (
              <option key={`acf-${key * 2}`} value={user.ID}>{user.display_name}</option>
            ))}
          </select>
        </div>

        <div className="mt-3">
          <b>{__('Comment Status', 'bit-integrations')}</b>

        </div>
        <select name="comment_status" onChange={(e) => handleInput(e.target.name, e.target.value)} className="btcd-paper-inp w-5 mt-2">
          <option disabled selected>{__('Select Status', 'bit-integrations')}</option>
          <option value="open">Open</option>
          <option value="closed">Closed</option>
        </select>

        <div>
          <div className="mt-3 mb-1"><b>{__('Post Field Mapping', 'bit-integrations')}</b></div>
          <div className="btcd-hr" />
          <div className="flx flx-around mt-2 mb-2 btcbi-field-map-label">
            <div className="txt-dp"><b>{__('Form Fields', 'bit-integrations')}</b></div>
            <div className="txt-dp"><b>{__('Post Fields', 'bit-integrations')}</b></div>
          </div>
        </div>

        {postConf?.post_map?.map((itm, i) => (
          <FieldMap
            key={`analytics-m-${i + 9}`}
            i={i}
            type="post"
            field={itm}
            formFields={formFields}
            postConf={postConf}
            setPostConf={setPostConf}
            customFields={postFields}
          />
        ))}

        <div className="txt-center btcbi-field-map-button mt-2"><button onClick={() => addFieldMap('post_map', postConf.post_map.length, postConf, setPostConf)} className="icn-btn sh-sm" type="button">+</button></div>

        <button onClick={() => nextPage(2)} className="btn f-right btcd-btn-lg green sh-sm flx" type="button">
          {__('Next', 'bit-integrations')}
          <div className="btcd-icn icn-arrow_back rev-icn d-in-b" />
        </button>

      </div>
      <div className="btcd-stp-page" style={{ ...(step === 2 && { width: 900, height: 'auto', overflow: 'visible' }) }}>
        <CustomField
          formID={formID}
          formFields={formFields}
          handleInput={(e) => handleInput(e, postConf, setPostConf, formID, setIsLoading, setSnackbar)}
          postConf={postConf}
          setPostConf={setPostConf}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          setSnackbar={setSnackbar}
          acfFields={acf}
          mbFields={mb}
        />

        <button onClick={() => nextPage(3)} className="btn f-right btcd-btn-lg green sh-sm flx" type="button">
          {__('Next', 'bit-integrations')}
          <div className="btcd-icn icn-arrow_back rev-icn d-in-b" />
        </button>
      </div>

      <IntegrationStepThree
        step={step}
        saveConfig={() => saveConfig()}
        isLoading={isLoading}
        dataConf={postConf}
        setDataConf={setPostConf}
        formFields={formFields}
      />

    </div>
  )
}

export default Post
