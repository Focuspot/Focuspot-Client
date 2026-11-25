interface BackButtonProps {
  onClick: () => void
}

function BackButton({ onClick }: BackButtonProps): React.JSX.Element {
  return (
    <button
      onClick={onClick}
      aria-label="뒤로"
      className="flex h-9 w-9 items-center justify-center rounded-full border border-cream-300 bg-white text-ink-soft shadow-card transition hover:text-clay-dark"
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path
          d="M10 3L5 8L10 13"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  )
}

export default BackButton
