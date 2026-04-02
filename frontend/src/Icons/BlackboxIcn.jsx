/* eslint-disable max-len */
export default function BlackboxIcn({ size, color = '#0A0A0A', className }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className}>
      <rect width="24" height="24" rx="4" fill={color} />
      <path
        d="M12 4.2L18.2 7.8V16.2L12 19.8L5.8 16.2V7.8Z"
        fill="none"
        stroke="#FFFFFF"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path d="M12 7.1L15.7 9.2V13.5L12 15.6L8.3 13.5V9.2Z" fill={color} />
    </svg>
  )
}
