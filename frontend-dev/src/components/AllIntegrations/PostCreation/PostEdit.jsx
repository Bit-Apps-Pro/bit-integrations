import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useRecoilState, useRecoilValue } from 'recoil'
import { $actionConf, $btcbi, $formFields, $newFlow } from '../../../GlobalStates'
import { deepCopy } from '../../../Utils/Helpers'
import { postFields } from '../../../Utils/StaticData/postField'
import bitsFetch from '../../../Utils/bitsFetch'
import { __ } from '../../../Utils/i18nwrap'
// import { postFields } from '../../../Utils/StaticData/postField'
import Cooltip from '../../Utilities/Cooltip'
import SnackMsg from '../../Utilities/SnackMsg'
import { saveIntegConfig } from '../IntegrationHelpers/IntegrationHelpers'
import IntegrationStepThree from '../IntegrationHelpers/IntegrationStepThree'
import SetEditIntegComponents from '../IntegrationHelpers/SetEditIntegComponents'
import CustomField from './CustomField'
import FieldMap from './FieldMap'
import {
  addFieldMap,
  checkMappedAcfFields,
  checkMappedJEFields,
  checkMappedMbFields,
  checkMappedPostFields,
  refreshPostTypes
} from './PostHelperFunction'
import { ProFeatureTitle } from '../IntegrationHelpers/ActionProFeatureLabels'

function Post({ allIntegURL }) {
  const [users, setUsers] = useState([])
  const [postTypes, setPostTypes] = useState([])
  const navigate = useNavigate()
  const { formID, id } = useParams()
  const [postConf, setPostConf] = useRecoilState($actionConf)
  const formFields = useRecoilValue($formFields)
  const [flow, setFlow] = useRecoilState($newFlow)
  const [isLoading, setIsLoading] = useState(false)
  const [snack, setSnackbar] = useState({ show: false })
  const [acf, setAcf] = useState({ fields: [], files: [] })
  const [mb, setMb] = useState({ fields: [], files: [] })
  const [jeCPTMeta, setJeCPTMeta] = useState({ fields: [], files: [] })
  // const [postConf, setPostConf] = useState({ ...flow.flow_details })
  const btcbi = useRecoilValue($btcbi)
  const { isPro } = btcbi

  const handleInput = (typ, val) => {
    const tmpData = { ...postConf }
    tmpData[typ] = val
    setPostConf(tmpData)
  }
  useEffect(() => {
    const tmpData = deepCopy({ ...postConf })
    bitsFetch({}, 'user/list').then(res => {
      const { data } = res
      setUsers(data)
    })

    bitsFetch({}, 'post-types/list').then(res => {
      const { data } = res
      setPostTypes(data)
    })

    bitsFetch({ post_type: postConf?.post_type }, 'customfield/list').then(res => {
      const { data } = res
      setAcf({ fields: data.acf_fields, files: data.acf_files })
      setMb({ fields: data.mb_fields, files: data.mb_files })
      setJeCPTMeta({ fields: data.je_cpt_fields, files: data.je_cpt_files })
    })
    // setLoad(false)
    setPostConf(tmpData)
  }, [])

  const getCustomFields = (typ, val) => {
    const tmpData = { ...postConf }
    tmpData[typ] = val
    bitsFetch({ post_type: val }, 'customfield/list').then(res => {
      const { data } = res
      setAcf({ fields: data.acf_fields, files: data.acf_files })
      setMb({ fields: data.mb_fields, files: data.mb_files })
      setJeCPTMeta({ fields: data.je_cpt_fields, files: data.je_cpt_files })
      if (data?.acf_fields) {
        tmpData.acf_map = data.acf_fields
          .filter(fld => fld.required)
          .map(fl => ({ formField: '', acfField: fl.key, required: fl.required }))
        if (tmpData.acf_map.length < 1) {
          tmpData.acf_map = [{}]
        }
      }
      if (data?.mb_fields) {
        tmpData.metabox_map = data.mb_fields
          .filter(fld => fld.required)
          .map(fl => ({ formField: '', metaboxField: fl.key, required: fl.required }))
        if (tmpData.metabox_map.length < 1) {
          tmpData.metabox_map = [{}]
        }
      }
      if (data?.je_cpt_fields) {
        tmpData.je_cpt_meta_map = data.je_cpt_fields
          .filter(fld => fld.required)
          .map(fl => ({ formField: '', jeCPTField: fl.key, required: fl.required }))
      }
      if (tmpData.je_cpt_meta_map.length < 1) {
        tmpData.je_cpt_meta_map = [{}]
      }
    })
    setPostConf(tmpData)
    // setLoad(false)
  }

  const saveConfig = () => {
    if (!checkMappedPostFields(postConf)) {
      setSnackbar({ show: true, msg: __('Please map mandatory fields', 'bit-integrations') })
      return
    }
    if (!checkMappedAcfFields(postConf)) {
      setSnackbar({ show: true, msg: __('Please map mandatory fields', 'bit-integrations') })
      return
    }
    if (!checkMappedMbFields(postConf)) {
      setSnackbar({ show: true, msg: __('Please map mandatory fields', 'bit-integrations') })
      return
    }
    if (!checkMappedJEFields(postConf)) {
      setSnackbar({ show: true, msg: __('Please map mandatory fields', 'bit-integrations') })
      return
    }
    setIsLoading(true)
    const resp = saveIntegConfig(flow, setFlow, allIntegURL, postConf, navigate, id, 1, setIsLoading)
    resp.then(res => {
      if (res.success) {
        setSnackbar({ show: true, msg: res.data })
        // navigate(allIntegURL)
      } else {
        setSnackbar({ show: true, msg: res.data || res })
      }
    })
  }

  return (
    <div>
      <SnackMsg snack={snack} setSnackbar={setSnackbar} />
      <div style={{ width: 900 }}>
        <div className="mt-3">
          <b>{__('Integration Name', 'bit-integrations')}</b>
        </div>
        <input
          className="btcd-paper-inp w-5 mt-1"
          onChange={e => handleInput(e.target.name, e.target.value)}
          name="name"
          value={postConf.name}
          type="text"
          placeholder={__('Integration Name...', 'bit-integrations')}
        />
        <br />
        <br />
        <SetEditIntegComponents entity={flow.triggered_entity} setSnackbar={setSnackbar} />

        <div className="mt-3 flx">
          <b>{__('Post Type', 'bit-integrations')}</b>
          <Cooltip width={250} icnSize={17} className="ml-2">
            <div className="txt-body">
              {__(
                'Select one of the defined WordPress post types Or custom post types for the post',
                'bit-integrations'
              )}
              <br />
            </div>
          </Cooltip>
        </div>
        <div>
          <select
            name="post_type"
            value={postConf?.post_type}
            onChange={e => getCustomFields(e.target.name, e.target.value)}
            className="btcd-paper-inp w-5 mt-1">
            <option disabled selected>
              {__('Select Post Type', 'bit-integrations')}
            </option>
            {postTypes?.map((postType, key) => (
              <option key={`acf-${key * 2}`} value={postType?.id}>
                {postType?.title}
              </option>
            ))}
          </select>
          <button
            onClick={() => refreshPostTypes(postTypes, setPostTypes)}
            className="icn-btn sh-sm ml-2 mr-2 tooltip"
            style={{ '--tooltip-txt': `'${__('Refresh Post Types', 'bit-integrations')}'` }}
            type="button">
            &#x21BB;
          </button>
        </div>

        <div className="mt-3">
          <b>{__('Post Status', 'bit-integrations')}</b>
          <Cooltip width={250} icnSize={17} className="ml-2">
            <div className="txt-body">
              {__(
                'Select the status for the post. If published status is selected and the post date is in the future, it will automatically be changed to scheduled',
                'bit-integrations'
              )}
              <br />
            </div>
          </Cooltip>
        </div>
        <select
          name="post_status"
          value={postConf?.post_status}
          onChange={e => handleInput(e.target.name, e.target.value)}
          className="btcd-paper-inp w-5 mt-2">
          <option disabled selected>
            {__('Select Status', 'bit-integrations')}
          </option>
          <option value="publish">{__('Publish', 'bit-integrations')}</option>
          <option value="draft">{__('Draft', 'bit-integrations')}</option>
          <option value="auto-draft">{__('Auto-Draft', 'bit-integrations')}</option>
          <option value="private">{__('Private', 'bit-integrations')}</option>
          <option value="pending">{__('Pending', 'bit-integrations')}</option>
        </select>

        <div className="mt-3 flx">
          <b>{__('Author', 'bit-integrations')}</b>
          <Cooltip width={250} icnSize={17} className="ml-2">
            <div className="txt-body">
              {__('Select the user to be assigned to the post', 'bit-integrations')}
              <br />
            </div>
          </Cooltip>
        </div>
        <div>
          <select
            name="post_author"
            value={postConf?.post_author}
            onChange={e => handleInput(e.target.name, e.target.value)}
            className="btcd-paper-inp w-5 mt-2">
            <option disabled selected>
              {__('Select Author', 'bit-integrations')}
            </option>
            <option value="logged_in_user">{__('Logged In User', 'bit-integrations')}</option>
            {users?.map((user, key) => (
              <option key={`acf-${key * 2}`} value={user.ID}>
                {user.display_name}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-3">
          <b>{__('Comment Status', 'bit-integrations')}</b>
        </div>
        <select
          name="comment_status"
          value={postConf?.comment_status}
          onChange={e => handleInput(e.target.name, e.target.value)}
          className="btcd-paper-inp w-5 mt-2">
          <option disabled selected>
            {__('Select Status', 'bit-integrations')}
          </option>
          <option value="open">{__('Open', 'bit-integrations')}</option>
          <option value="closed">{__('Closed', 'bit-integrations')}</option>
        </select>

        <div className="mt-3">
          <b>
            <ProFeatureTitle title={__('Add Post Tags', 'bit-integrations')} />
          </b>

          <Cooltip width={250} icnSize={17} className="ml-2">
            <div className="txt-body">
              {__('Use commas to separate multiple tags. Example: tag1, tag2, tag3', 'bit-integrations')}
              <br />
            </div>
          </Cooltip>
        </div>

        <input
          className="btcd-paper-inp w-5 mt-2 "
          onChange={e => handleInput(e.target.name, e.target.value)}
          name="post_tags"
          value={postConf.post_tags}
          type="text"
          placeholder={__('Add Post Tags...', 'bit-integrations')}
          disabled={!isPro}
        />

        <div>
          <div className="mt-3 mb-1">
            <b>{__('Post Field Mapping', 'bit-integrations')}</b>
          </div>
          <div className="btcd-hr" />
          <div className="flx flx-around mt-2 mb-2 btcbi-field-map-label">
            <div className="txt-dp">
              <b>{__('Form Fields', 'bit-integrations')}</b>
            </div>
            <div className="txt-dp">
              <b>{__('Post Fields', 'bit-integrations')}</b>
            </div>
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

        <div className="txt-center btcbi-field-map-button mt-2">
          <button
            onClick={() => addFieldMap('post_map', postConf.post_map.length, postConf, setPostConf)}
            className="icn-btn sh-sm"
            type="button">
            +
          </button>
        </div>
      </div>
      <div>
        <CustomField
          formID={formID}
          formFields={formFields}
          handleInput={e => handleInput(e, postConf, setPostConf, formID, setIsLoading, setSnackbar)}
          postConf={postConf}
          setPostConf={setPostConf}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          setSnackbar={setSnackbar}
          acfFields={acf}
          mbFields={mb}
          jeCPTFields={jeCPTMeta}
        />
      </div>
      <IntegrationStepThree
        edit
        saveConfig={saveConfig}
        isLoading={isLoading}
        dataConf={postConf}
        setDataConf={setPostConf}
        formFields={formFields}
      />
    </div>
  )
}

export default Post
