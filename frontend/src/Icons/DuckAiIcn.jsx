/* eslint-disable max-len */
export default function DuckAiIcn({ size, color = '#DE5833', className }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className}>
      <circle cx="12" cy="12" r="11" fill={color} />
      <circle cx="12" cy="12" r="9.2" fill="#FFFFFF" />
      <path
        d="M7.1 13.1C7.5 10.7 9.6 9 12.1 9C14.2 9 16.1 10 17.2 11.5C16.5 11.3 15.6 11.4 14.9 11.8C14.1 11.3 13.2 11.1 12.3 11.1C10.5 11.1 8.8 11.8 7.1 13.1Z"
        fill="#FFFFFF"
        stroke="#1F2937"
        strokeWidth="0.7"
        strokeLinejoin="round"
      />
      <circle cx="14.2" cy="10.5" r="0.8" fill="#111827" />
      <path d="M15.2 13.2H19.4C18.7 14.8 17.4 15.8 15.8 15.8C15.2 15.8 14.5 15.6 14 15.2Z" fill="#F97316" />
      <path d="M9.1 17.8L10.8 15.7L12.5 17.8Z" fill="#16A34A" />
      <path d="M12.1 17.8L13.8 15.7L15.5 17.8Z" fill="#16A34A" />
    </svg>
  )
}
