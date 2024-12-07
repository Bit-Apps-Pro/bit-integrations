/* eslint-disable react-hooks/exhaustive-deps */
import MultiSelect from 'react-multiple-select-dropdown-lite'
import { __ } from '../../../Utils/i18nwrap'
import 'react-multiple-select-dropdown-lite/dist/index.css'

import VoxelFieldMap from './VoxelFieldMap'
import { addFieldMap } from './IntegrationHelpers'
import { getPostFields, getPosts, getPostTypes, voxelStaticFields } from './VoxelCommonFunctions'
import { COLLECTION_POST_TYPE, POST_TYPE_TASK_ARRAY, PROFILE_POST_TYPE, TASK_LIST, TASKS } from './VoxelConstants'
import Loader from '../../Loaders/Loader'
import Note from '../../Utilities/Note'

export default function VoxelIntegLayout({
  formFields,
  voxelConf,
  setVoxelConf,
  loading,
  setLoading,
  setSnackbar
}) {
  const setChanges = (val) => {
    const newConf = { ...voxelConf }
    newConf.selectedTask = val
    newConf.selectedEvent = ''

    if (val) {
      switch (val) {
        case TASKS.NEW_POST:
        case TASKS.UPDATE_POST:
          getPostTypes(newConf, setVoxelConf, loading, setLoading)

          break
        case TASKS.NEW_COLLECTION_POST:
        case TASKS.UPDATE_COLLECTION_POST:
          getPostFields(newConf, setVoxelConf, COLLECTION_POST_TYPE, loading, setLoading)

          break
        case TASKS.NEW_PROFILE:
        case TASKS.UPDATE_PROFILE:
          getPostFields(newConf, setVoxelConf, PROFILE_POST_TYPE, loading, setLoading)

          break
        case TASKS.SET_POST_VERIFIED:
        case TASKS.SET_COLLECTION_POST_VERIFIED:
        case TASKS.SET_PROFILE_VERIFIED:
          const fieldsAndFieldMap = voxelStaticFields(val)
          newConf.voxelFields = fieldsAndFieldMap.staticFields
          newConf.field_map = fieldsAndFieldMap.fieldMap

          break
      }
    } else {
      newConf.selectedPostType = ''
      newConf.field_map = []
    }

    setVoxelConf({ ...newConf })
  }

  const handleMultiSelectChange = (val, type) => {
    const newConf = { ...voxelConf }
    newConf[type] = val

    if (!val && type === 'selectedPostType') {
      newConf.voxelFields = []
      newConf.field_map = []
      newConf.posts = []
      newConf.selectedPost = ''
    }

    if (val && type === 'selectedPostType') {
      getPostFields(newConf, setVoxelConf, val, loading, setLoading)
    }

    setVoxelConf({ ...newConf })
  }

  const note =
    `<h4>${__('If you have "recurring-date, event-date, work-hours" or any kind of image or attachment fields see the instructions below:', 'bit-integrations')}</h4>
  <ul>
    <li>${__('For any kind of <strong>image, file, or other attachment,</strong> provide an <strong>attachment ID; for multiple, provide comma-separated ids.</strong>', 'bit-integrations')}</li>
    <li>${__('For <strong>Event Unit</strong> field, accepted values: <strong>day, week, month, year.</strong>', 'bit-integrations')}</li>
    <li>${__('For <strong>Work Days</strong> field, accepted values: <strong>sat, sun, mon, tue, wed, thu, fri.</strong>', 'bit-integrations')}</li>
    <li>${__('For <strong>Work Hours</strong> field, enter time ranges as start and end times, with a dash between them. For more than one range, separate them with commas. <strong>Example: 09:00-12:00 or 09:00-11:00, 12:00-14:00.</strong>', 'bit-integrations')}</li>
    <li>${__('For <strong>Work Status</strong> field, accepted values: <strong> hours, open, close, appointments_only.</strong>', 'bit-integrations')}</li>
    <li>${__('For <strong>Taxonomy</strong> field, provide taxonomy slug(s), separate with comma if multiple allowed.', 'bit-integrations')}</li>
    <li>${__('For <strong>Product & Post Relation</strong> field, provide product id and post id respectively.', 'bit-integrations')}</li>
  </ul>`

  return (
    <>
      <div>
        <div className="flx mt-3 mb-4">
          <b className="wdt-200 d-in-b">{__('Select Task:', 'bit-integrations')}</b>
          <MultiSelect
            style={{ width: '450px' }}
            options={TASK_LIST}
            className="msl-wrp-options"
            defaultValue={voxelConf?.selectedTask}
            onChange={(val) => setChanges(val)}
            singleSelect
          />
        </div>

        {(voxelConf.selectedTask === TASKS.NEW_POST || voxelConf.selectedTask === TASKS.UPDATE_POST) && (
          <div className="flx mt-3 mb-4">
            <b className="wdt-200 d-in-b">{__('Select Post Type:', 'bit-integrations')}</b>
            <MultiSelect
              style={{ width: '450px' }}
              options={voxelConf?.postTypes}
              className="msl-wrp-options"
              defaultValue={voxelConf?.selectedPostType}
              onChange={(val) => handleMultiSelectChange(val, 'selectedPostType')}
              disabled={loading.postTypes}
              singleSelect
            />
            <button
              onClick={() =>
                getPostTypes(voxelConf, setVoxelConf, loading, setLoading)
              }
              className="icn-btn sh-sm ml-2 mr-2 tooltip"
              style={{ '--tooltip-txt': `'${__('Refresh Post Types', 'bit-integrations')}'` }}
              disabled={loading.postTypes}
              type="button">
              &#x21BB;
            </button>
          </div>
        )}

        {(voxelConf.selectedTask === TASKS.UPDATE_POST || voxelConf.selectedTask === TASKS.UPDATE_COLLECTION_POST) && (
          <div className="flx mt-3 mb-4">
            <b className="wdt-200 d-in-b">{__('Select Post:', 'bit-integrations')}</b>
            <MultiSelect
              style={{ width: '450px' }}
              options={voxelConf.posts}
              className="msl-wrp-options"
              defaultValue={voxelConf?.selectedPost}
              onChange={(val) => handleMultiSelectChange(val, 'selectedPost')}
              disabled={loading.posts || loading.postTypes || loading.postFields}
              singleSelect
            />
            <button
              onClick={() =>
                getPosts(voxelConf, setVoxelConf, voxelConf.selectedPostType, loading, setLoading)
              }
              className="icn-btn sh-sm ml-2 mr-2 tooltip"
              style={{ '--tooltip-txt': `'${__('Refresh Posts', 'bit-integrations')}'` }}
              disabled={loading.posts || loading.postTypes || loading.postFields || !voxelConf.selectedPostType}
              type="button">
              &#x21BB;
            </button>
          </div>
        )}

        {POST_TYPE_TASK_ARRAY.includes(voxelConf.selectedTask) &&
          <div className="flx mt-3 mb-4">
            <b className="wdt-200 d-in-b">{__('Select Post Status:', 'bit-integrations')}</b>
            <MultiSelect
              style={{ width: '450px' }}
              options={[
                { value: 'publish', label: 'Publish' },
                { value: 'draft', label: 'Draft' },
                { value: 'pending', label: 'Pending' },
              ]}
              className="msl-wrp-options"
              defaultValue={voxelConf?.selectedPostStatus}
              onChange={(val) => handleMultiSelectChange(val, 'selectedPostStatus')}
              singleSelect
            />
          </div>}

        {(loading.postTypes || loading.postFields || loading.posts) && (
          <Loader
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: 45,
              transform: 'scale(0.5)'
            }}
          />
        )}

        <div className="mt-5">
          <b className="wdt-100">{__('Field Map', 'bit-integrations')}</b>
        </div>
        <br />
        <div className="btcd-hr mt-1" />
        <div className="flx flx-around mt-2 mb-2 btcbi-field-map-label">
          <div className="txt-dp">
            <b>{__('Form Fields', 'bit-integrations')}</b>
          </div>
          <div className="txt-dp">
            <b>{__('The Events Calendar Fields', 'bit-integrations')}</b>
          </div>
        </div>

        {voxelConf.selectedTask &&
          voxelConf?.field_map.map((itm, i) => (
            <VoxelFieldMap
              key={`rp-m-${i + 9}`}
              i={i}
              field={itm}
              voxelConf={voxelConf}
              formFields={formFields}
              setVoxelConf={setVoxelConf}
              setSnackbar={setSnackbar}
            />
          ))}

        {(voxelConf?.selectedTask && voxelConf.field_map.length !== 0) && (
          <div className="txt-center btcbi-field-map-button mt-2">
            <button
              onClick={() =>
                addFieldMap(
                  voxelConf.field_map.length,
                  voxelConf,
                  setVoxelConf,
                  false
                )
              }
              className="icn-btn sh-sm"
              type="button">
              +
            </button>
          </div>
        )}

        {(POST_TYPE_TASK_ARRAY.includes(voxelConf.selectedTask) || voxelConf.selectedTask === TASKS.NEW_PROFILE || voxelConf.selectedTask === TASKS.UPDATE_PROFILE) &&
          <Note note={note} isInstruction isHeadingNull={false} maxWidth='100%' />}
      </div>
    </>
  )
}
