import MultiSelect from 'react-multiple-select-dropdown-lite'
import 'react-multiple-select-dropdown-lite/dist/index.css'
import { useRecoilState } from 'recoil'
import { $newFlow } from '../../../GlobalStates'
import { __ } from '../../../Utils/i18nwrap'

const WPJobManagerHelper = ({ flow, setFlowData, edit = false }) => {
  const id = !edit ? flow?.triggerData?.formID : flow.triggered_entity_id
  const [newFlow, setNewFlow] = useRecoilState($newFlow)
  const triggerData = !edit ? newFlow?.triggerData : flow.flow_details

  return (
    <div>
      {(id === 'wp_job_manager-1' ||
        id === 'wp_job_manager-4' ||
        id === 'wp_job_manager-5' ||
        id === 'wp_job_manager-8' ||
        id === 'wp_job_manager-10') && (
        <div className={edit ? 'flx mt-3' : ''}>
          <b className={edit ? 'wdt-200 d-in-b' : 'wdt-200 d-in-b mt-3 mb-3'}>
            {__('Select Job Type:', 'bit-integrations')}
          </b>
          <MultiSelect
            className="msl-wrp-options"
            defaultValue={triggerData?.selectedJobType}
            options={triggerData?.jobTypes}
            onChange={(val) => setFlowData(val, 'selectedJobType')}
            singleSelect
            style={{ width: '100%', minWidth: 300, maxWidth: 400 }}
          />
        </div>
      )}
      {(id === 'wp_job_manager-2' ||
        id === 'wp_job_manager-3' ||
        id === 'wp_job_manager-6' ||
        id === 'wp_job_manager-7' ||
        id === 'wp_job_manager-11') && (
        <div className={edit ? 'flx mt-3' : ''}>
          <b className={edit ? 'wdt-200 d-in-b' : 'wdt-200 d-in-b mt-3 mb-3'}>
            {__('Select Job:', 'bit-integrations')}
          </b>
          <MultiSelect
            className="msl-wrp-options"
            defaultValue={triggerData?.selectedJob}
            options={triggerData?.jobList}
            onChange={(val) => setFlowData(val, 'selectedJob')}
            singleSelect
            style={{ width: '100%', minWidth: 300, maxWidth: 400 }}
          />
        </div>
      )}
      {(id === 'wp_job_manager-9' || id === 'wp_job_manager-10') && (
        <div className={edit ? 'flx mt-3' : ''}>
          <b className={edit ? 'wdt-200 d-in-b' : 'wdt-200 d-in-b mt-3 mb-3'}>
            Select Application Status:
          </b>
          <MultiSelect
            className="msl-wrp-options"
            defaultValue={triggerData?.selectedStatus}
            options={triggerData?.statusList}
            onChange={(val) => setFlowData(val, 'selectedStatus')}
            singleSelect
            style={{ width: '100%', minWidth: 300, maxWidth: 400 }}
          />
        </div>
      )}
    </div>
  )
}

export default WPJobManagerHelper
