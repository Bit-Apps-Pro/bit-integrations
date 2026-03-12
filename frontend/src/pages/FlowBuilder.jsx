// eslint-disable-next-line import/no-extraneous-dependencies
import { useRecoilState } from 'recoil'
import { $flowStep, $newFlow } from '../GlobalStates'
import SelectAction from '../components/Flow/New/SelectAction'
import SelectTrigger from '../components/Flow/New/SelectTrigger'
import { useEffect } from 'react'

export default function FlowBuilder() {
  const [newFlow, setNewFlow] = useRecoilState($newFlow)
  const [flowStep, setFlowStep] = useRecoilState($flowStep)

  useEffect(() => {
    if (!newFlow?.triggered_entity && !newFlow?.triggerData) {
      setFlowStep(1)
      setNewFlow({})
    }
  }, [])

  return (
    <div className="btcd-s-wrp" style={{ height: '82vh' }}>
      <div className="flx flx-center flx-col">
        {(!newFlow?.triggered_entity || !newFlow?.triggerData || flowStep === 1) && <SelectTrigger />}
        {newFlow?.triggered_entity !== false &&
          newFlow?.triggerData &&
          !newFlow?.action &&
          flowStep === 2 && <SelectAction />}
      </div>
    </div>
  )
}
