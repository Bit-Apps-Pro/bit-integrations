export default function PlaceholderIcon({ size, text }) {
  const loaderStyle = {
    display: 'flex',
    height: '85%',
    justifyContent: 'center',
    alignItems: 'center'
  }
  return (
    <div style={loaderStyle}>
      <svg width="32" height="32" viewBox="0 0 24 24">
        <path
          fill="currentColor"
          d="M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-4.86 8.86l-3 3.87L9 13.14L6 17h12l-3.86-5.14z"
        />
      </svg>
    </div>
  )
}
