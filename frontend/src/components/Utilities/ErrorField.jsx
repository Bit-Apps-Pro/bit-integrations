export default function ErrorField({ error }) {
  return error ? <div className="mt-1 mb-2 error-msg">{error}</div> : ''
}
