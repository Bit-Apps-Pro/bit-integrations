import bitsFetch from '../../../../Utils/bitsFetch'
import { __ } from '../../../../Utils/i18nwrap'

export const getFluentFluentBookingFields = (setFlowData, value) => {
  const loadTags = bitsFetch(
    { id: value },
    'fluentBooking/get/fields',
    null,
    'POST',
  ).then((result) => {
    if (result && result.success) {
      setFlowData(result.data, 'fields')

      return 'Fetched fields successfully'
    }

    return 'Fields fetching failed. please try again'
  })
}
