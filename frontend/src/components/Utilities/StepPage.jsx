export default function Step(props) {
  const { style, step, stepNo } = props
  return (
    <div className="btcd-stp-page mt-2" style={{ ...(step === stepNo && style) }}>
      {props.children}
    </div>
  )
}
