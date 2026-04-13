import { forwardRef, useEffect, useRef } from 'react'
import TableCheckBox from '../TableCheckBox'

const IndeterminateCheckbox = forwardRef(function IndeterminateCheckbox(
  { indeterminate, ...rest },
  ref
) {
  const defaultRef = useRef()
  const resolvedRef = ref || defaultRef

  useEffect(() => {
    if (resolvedRef.current) {
      resolvedRef.current.indeterminate = indeterminate
    }
  }, [resolvedRef, indeterminate])

  return <TableCheckBox refer={resolvedRef} rest={rest} />
})

export default IndeterminateCheckbox
