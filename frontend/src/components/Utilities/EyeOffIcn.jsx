/* eslint-disable max-len */
export default function EyeOffIcn({ className, width, height, strokeColor }) {
  return (
    <svg
      className={className}
      width={width}
      height={height}
      viewBox="0 0 21 21"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <g clipPath="url(#clip0)">
        <path
          d="M12.2663 12.2667C12.0375 12.5123 11.7615 12.7093 11.4548 12.8459C11.1481 12.9826 10.8171 13.056 10.4814 13.062C10.1457 13.0679 9.81231 13.0061 9.50102 12.8804C9.18972 12.7547 8.90694 12.5675 8.66955 12.3301C8.43215 12.0927 8.245 11.81 8.11927 11.4987C7.99353 11.1874 7.93178 10.8539 7.9377 10.5183C7.94363 10.1826 8.0171 9.85154 8.15374 9.54487C8.29038 9.23821 8.48739 8.96221 8.73301 8.73333M15.4497 15.45C14.0252 16.5358 12.2906 17.1374 10.4997 17.1667C4.66634 17.1667 1.33301 10.5 1.33301 10.5C2.36958 8.56825 3.80729 6.88051 5.54967 5.55L15.4497 15.45ZM8.74967 4.03333C9.32328 3.89907 9.91056 3.83195 10.4997 3.83333C16.333 3.83333 19.6663 10.5 19.6663 10.5C19.1605 11.4463 18.5572 12.3373 17.8663 13.1583L8.74967 4.03333Z"
          stroke={`${strokeColor}` || '#808080'}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M1.33301 1.33331L19.6663 19.6666"
          stroke={`${strokeColor}` || '#808080'}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip0">
          <rect width="20" height="20" fill="white" transform="translate(0.5 0.5)" />
        </clipPath>
      </defs>
    </svg>
  )
}
