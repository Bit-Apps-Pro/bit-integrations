export default function EyeIcn({ width, height, strokeColor = 'currentColor' }) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 25 25"
      fill="none"
      stroke={strokeColor}
      xmlns="http://www.w3.org/2000/svg">
      <g clipPath="url(#clip0)">
        <path
          d="M1.5 12.5C1.5 12.5 5.5 4.5 12.5 4.5C19.5 4.5 23.5 12.5 23.5 12.5C23.5 12.5 19.5 20.5 12.5 20.5C5.5 20.5 1.5 12.5 1.5 12.5Z"
          stroke={`${strokeColor}` || '#808080'}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M12.5 15.5C14.1569 15.5 15.5 14.1569 15.5 12.5C15.5 10.8431 14.1569 9.5 12.5 9.5C10.8431 9.5 9.5 10.8431 9.5 12.5C9.5 14.1569 10.8431 15.5 12.5 15.5Z"
          stroke={`${strokeColor}` || '#808080'}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip0">
          <rect width="24" height="24" fill="white" transform="translate(0.5 0.5)" />
        </clipPath>
      </defs>
    </svg>
  )
}
