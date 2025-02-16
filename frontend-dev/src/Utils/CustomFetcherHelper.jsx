import { create } from 'mutative'
import bitsFetch from './bitsFetch'

export default function CustomFetcherHelper(
  isLoadingRef,
  entityId,
  controller,
  setIsLoading,
  removeAction,
  removeMethod = 'POST',
  key = 'triggered_entity_id'
) {
  const removeTestData = () => {
    if (!entityId) {
      return
    }

    bitsFetch({ [key]: entityId }, removeAction, null, removeMethod)
  }

  const stopFetching = () => {
    controller.abort()
    setIsLoading(false)
    isLoadingRef.current = false

    removeTestData()
  }

  return { stopFetching }
}

const resetActionHookFlowData = setFlow => {
  setFlow(prevFlow =>
    create(prevFlow, draftFlow => {
      delete draftFlow?.triggerDetail?.tmp
      delete draftFlow?.triggerDetail?.data
    })
  )
}

const startFetching = (
  isLoadingRef,
  setShowResponse,
  setPrimaryKey,
  setFlow,
  setIsLoading,
  isEdit = false
) => {
  setIsLoading(true)
  isLoadingRef.current = true
  setShowResponse(false)
  setPrimaryKey(undefined)
  resetFlowData(setFlow, isEdit)
}

const resetFlowData = (setFlow, isEdit = false) => {
  setFlow(prevFlow =>
    create(prevFlow, draftFlow => {
      const property = isEdit ? 'flow_details' : 'triggerDetail'

      delete draftFlow[property].data
    })
  )
}

export { startFetching, resetFlowData, resetActionHookFlowData }
