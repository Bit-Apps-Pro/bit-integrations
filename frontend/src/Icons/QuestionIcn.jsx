export default function QuestionIcn({ size, stroke = 2 }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 30 30">
      <ellipse
        fill="none"
        stroke="currentColor"
        strokeMiterlimit="10"
        strokeWidth={stroke}
        cx="15"
        cy="15"
        rx="12.75"
        ry="12.85"
      />
      <path
        fill="none"
        stroke="currentColor"
        strokeMiterlimit="10"
        strokeWidth={stroke}
        strokeLinecap="round"
        d="M11.3,10.73v0a3.58,3.58,0,0,1,1-2.53l.25-.25a3.56,3.56,0,0,1,5,0h0a3.56,3.56,0,0,1,0,5.05l-1.43,1.43a3.85,3.85,0,0,0-1.13,2.75v2.4"
      />
      <line
        fill="none"
        stroke="currentColor"
        strokeMiterlimit="10"
        strokeWidth={stroke}
        strokeLinecap="round"
        x1="15"
        y1="23.12"
        x2="15"
        y2="23.12"
      />
    </svg>
  )
}
