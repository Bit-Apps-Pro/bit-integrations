export default function CloseIcn({ size, stroke = 4, className }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      width={size}
      height={size}
      viewBox="0 0 30 30">
      <line className="svg-icn" strokeWidth={stroke} x1="4" y1="3.88" x2="26" y2="26.12" />
      <line className="svg-icn" strokeWidth={stroke} x1="26" y1="3.88" x2="4" y2="26.12" />
    </svg>
  )
}
