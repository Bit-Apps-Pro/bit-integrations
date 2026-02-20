export default function TrashIcn({ size = 15, stroke = 2 }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 30 30">
      <polyline className="svg-icn" points="4 7.68 6.44 7.68 26 7.68" />
      <path
        className="svg-icn"
        strokeWidth={stroke}
        d="M23.56,7.68V24.76a2.45,2.45,0,0,1-2.45,2.44H8.89a2.45,2.45,0,0,1-2.45-2.44V7.68m3.67,0V5.24A2.45,2.45,0,0,1,12.56,2.8h4.88a2.45,2.45,0,0,1,2.45,2.44V7.68"
      />
      <line className="svg-icn" strokeWidth={stroke} x1="12.56" y1="13.78" x2="12.56" y2="21.1" />
      <line className="svg-icn" strokeWidth={stroke} x1="17.44" y1="13.78" x2="17.44" y2="21.1" />
    </svg>
  )
}
