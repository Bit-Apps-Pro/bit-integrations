/* eslint-disable max-len */
export default function AiSparkleIcn({
  size = 18,
  color = 'currentColor',
  background = 'transparent',
  className
}) {
  return (
    <svg viewBox="0 0 256 256" width={size} height={size} className={className} aria-hidden="true">
      {background !== 'transparent' && background !== 'none' && (
        <rect x="0" y="0" width="256" height="256" rx="0" fill={background} />
      )}
      <path
        d="M128 8L165 89L248 128L165 167L128 248L91 167L8 128L91 89Z
           M128 40L145 102L208 128L145 154L128 216L111 154L48 128L111 102Z"
        fill={color}
        fillRule="evenodd"
        clipRule="evenodd"
      />
      <path
        d="M0 -24C0 -12 12 0 24 0C12 0 0 12 0 24C0 12 -12 0 -24 0C-12 0 0 -12 0 -24Z"
        transform="translate(38 56)"
        fill={color}
      />
      <path
        d="M0 -24C0 -12 12 0 24 0C12 0 0 12 0 24C0 12 -12 0 -24 0C-12 0 0 -12 0 -24Z"
        transform="translate(205 205)"
        fill={color}
      />
    </svg>
  )
}
