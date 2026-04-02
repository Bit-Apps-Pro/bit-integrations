/* eslint-disable max-len */
export default function ClaudeIcn({ size, color = '#D97745', className }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className}>
      <rect width="24" height="24" rx="5" fill={color} />
      <g stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round">
        <path d="M12 4V6.3" />
        <path d="M12 17.7V20" />
        <path d="M4 12H6.3" />
        <path d="M17.7 12H20" />
        <path d="M6.6 6.6L8.2 8.2" />
        <path d="M15.8 15.8L17.4 17.4" />
        <path d="M17.4 6.6L15.8 8.2" />
        <path d="M8.2 15.8L6.6 17.4" />
        <path d="M9.1 4.8L9.9 7" />
        <path d="M14.9 4.8L14.1 7" />
        <path d="M4.8 9.1L7 9.9" />
        <path d="M19.2 9.1L17 9.9" />
        <path d="M4.8 14.9L7 14.1" />
        <path d="M19.2 14.9L17 14.1" />
      </g>
      <circle cx="12" cy="12" r="1.8" fill="#FFFFFF" />
    </svg>
  )
}
