import { create } from 'mutative'
import bitsFetch from './bitsFetch'

const removeTestData = (entityId, removeAction, removeMethod = 'POST', key = 'triggered_entity_id') => {
  if (!entityId) {
    return
  }

  bitsFetch({ [key]: entityId }, removeAction, null, removeMethod)
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
  entityId,
  isLoadingRef,
  removeAction,
  removeMethod,
  setIsLoading,
  key = 'triggered_entity_id'
) => {
  controller.abort()
  setIsLoading(false)
  isLoadingRef.current = false

  removeTestData(entityId, removeAction, removeMethod, key)
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
