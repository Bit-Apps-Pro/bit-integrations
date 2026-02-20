export default function BackIcn({ size = 14, stroke = 3, className }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 30 30">
      <polyline
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={stroke}
        points="26 15.2 4 15.2 12.38 23.69 4 15.2 12.77 6.31"
      />
    </svg>
  )
}
