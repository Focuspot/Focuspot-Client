import logo from '../assets/focuspot-icon.svg'

interface LogoProps {
  size?: number
  className?: string
}

function Logo({ size = 88, className = '' }: LogoProps): React.JSX.Element {
  return (
    <img
      src={logo}
      alt="FocusPot"
      width={size}
      height={size}
      className={className}
      draggable={false}
    />
  )
}

export function Wordmark({ className = '' }: { className?: string }): React.JSX.Element {
  return (
    <p className={`font-extrabold tracking-tight text-ink ${className}`}>
      Focus<span className="text-clay">Pot</span>
    </p>
  )
}

export default Logo
