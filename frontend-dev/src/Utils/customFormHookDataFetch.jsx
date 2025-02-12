import { create } from 'mutative'
import bitsFetch from './bitsFetch'

const removeTestData = (triggered_entity_id, removeAction, removeMethod = 'post') => {
  if (!triggered_entity_id) {
    return
  }

  bitsFetch({ triggered_entity_id: triggered_entity_id }, removeAction, null, removeMethod)
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

const stopFetching = (
  controller,
  triggered_entity_id,
  isLoadingRef,
  removeAction,
  removeMethod,
  setIsLoading
) => {
  controller.abort()
  setIsLoading(false)
  isLoadingRef.current = false

  removeTestData(triggered_entity_id, removeAction, removeMethod)
}

const resetFlowData = (setFlow, isEdit = false) => {
  setFlow(prevFlow =>
    create(prevFlow, draftFlow => {
      const property = isEdit ? 'flow_details' : 'triggerDetail'

      delete draftFlow[property].data
    })
  )
}

export { removeTestData, startFetching, stopFetching, resetFlowData }
