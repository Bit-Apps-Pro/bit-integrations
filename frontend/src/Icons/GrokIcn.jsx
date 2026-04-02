/* eslint-disable max-len */
export default function GrokIcn({ size, color = '#0F172A', className }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className}>
      <circle cx="12" cy="12" r="11" fill={color} />
      <path d="M16.9 6.7A7.1 7.1 0 1 0 16.9 17.3" fill="none" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M7.1 16.9L16.9 7.1" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}
