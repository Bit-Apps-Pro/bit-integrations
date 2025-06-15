/* eslint-disable no-param-reassign */

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useRecoilState, useRecoilValue } from 'recoil'
import { $actionConf, $formFields, $newFlow } from '../../../GlobalStates'
import { __ } from '../../../Utils/i18nwrap'
import SnackMsg from '../../Utilities/SnackMsg'
import SetEditIntegComponents from '../IntegrationHelpers/SetEditIntegComponents'
import { saveActionConf } from '../IntegrationHelpers/IntegrationHelpers'
import IntegrationStepThree from '../IntegrationHelpers/IntegrationStepThree'
import VoxelIntegLayout from './VoxelIntegLayout'
import toast from 'react-hot-toast'
import { checkMappedFields, handleInput } from './VoxelCommonFunctions'
import { POST_TYPE_TASK_ARRAY, TASKS } from './VoxelConstants'

function EditVoxel({ allIntegURL }) {
  const navigate = useNavigate()
  const [flow, setFlow] = useRecoilState($newFlow)
  const [voxelConf, setVoxelConf] = useRecoilState($actionConf)
  const [isLoading, setIsLoading] = useState(false)
  const [loading, setLoading] = useState({
    auth: false,
    PostTypes: false,
    postFields: false,
    posts: false,
  })
  const [snack, setSnackbar] = useState({ show: false })
  const formField = useRecoilValue($formFields)

  const saveConfig = () => {
    if (!voxelConf.selectedTask) {
      toast.error(__('Please select a task!', 'bit-integrations'))
      return
    }

    if ((voxelConf.selectedTask === TASKS.NEW_POST || voxelConf.selectedTask === TASKS.UPDATE_POST) && !voxelConf.selectedPostType) {
      toast.error(__('Please select a post type!', 'bit-integrations'))
      return
    }

    if (POST_TYPE_TASK_ARRAY.includes(voxelConf.selectedTask) && !voxelConf.selectedPostStatus) {
      toast.error(__('Please select a post status!', 'bit-integrations'))
      return
    }

    if ((voxelConf.selectedTask === TASKS.UPDATE_POST || voxelConf.selectedTask === TASKS.UPDATE_COLLECTION_POST) && !voxelConf.selectedPost) {
      toast.error(__('Please select a post!', 'bit-integrations'))
      return
    }

    if (!checkMappedFields(voxelConf)) {
      toast.error(__('Please map mandatory fields!', 'bit-integrations'))
      return
    }

    saveActionConf({
      flow,
      allIntegURL,
      conf: voxelConf,
      navigate,
      edit: 1,
      setLoading,
      setSnackbar
    })
  }

  return (
    <div style={{ width: 900 }}>
      <SnackMsg snack={snack} setSnackbar={setSnackbar} />

      <div className="flx mt-3">
        <b className="wdt-200 d-in-b">{__('Integration Name:', 'bit-integrations')}</b>
        <input
          className="btcd-paper-inp w-5"
          onChange={(e) => handleInput(e, voxelConf, setVoxelConf)}
          name="name"
          defaultValue={voxelConf.name || ''}
          type="text"
          placeholder={__('Integration Name...', 'bit-integrations')}
        />
      </div>
      <br />

      <SetEditIntegComponents entity={flow.triggered_entity} setSnackbar={setSnackbar} />
      <VoxelIntegLayout
        formID={flow.triggered_entity_id}
        formFields={formField}
        handleInput={(e) =>
          handleInput(e, voxelConf, setVoxelConf, setLoading, setSnackbar)
        }
        voxelConf={voxelConf}
        setVoxelConf={setVoxelConf}
        loading={loading}
        setLoading={setLoading}
        setSnackbar={setSnackbar}
      />

      <IntegrationStepThree
        edit
        saveConfig={saveConfig}
        disabled={false}
        isLoading={isLoading}
        dataConf={voxelConf}
        setDataConf={setVoxelConf}
        formFields={formField}
      />
      <br />
    </div>
  )
}

export default EditVoxel
