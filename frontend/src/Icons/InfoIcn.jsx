export default function InfoIcn({ size = 30, stroke = 2 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 30 30">
      <ellipse
        className="svg-icn"
        strokeWidth={stroke}
        strokeMiterlimit="10"
        cx="15"
        cy="15"
        rx="11"
        ry="11.09"
      />
      <ellipse className="svg-icn" strokeWidth={2} strokeMiterlimit="10" cx="15" cy="11" rx="1" ry="1" />
      <line
        className="svg-icn"
        strokeWidth={stroke - 0.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        x1="15"
        y1="18"
        x2="15"
        y2="21.72"
      />
    </svg>
  )
}
