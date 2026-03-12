import useSWR from 'swr'
import bitsFetch from '../Utils/bitsFetch'

const useFetch = ({ payload, action, method = 'POST' }) => {
  const { data, error, mutate } = useSWR(action, uri =>
    bitsFetch(payload, Array.isArray(uri) ? uri[0] : uri, null, method)
  )
  return {
    data,
    mutate,
    isLoading: !error && !data,
    isError: error
  }
}

export default useFetch
