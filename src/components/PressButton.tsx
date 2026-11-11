import { useEffect, useRef, useState } from "react"

export default function PressButton({
  children,
  className = '',
  onClick,
  noRelease = false,
  ...props
}: React.ComponentProps<"button"> & {noRelease?: boolean}) {
  const [pressed, setPressed] = useState(false)
  const buttonRef = useRef<HTMLDivElement | null>(null)
  const releaseTimer = useRef<number>(-1)
  const clickTimer = useRef<number>(-1)
  const duration = 200;

  const press = () => {
    clearTimeout(releaseTimer.current)
    setPressed(true)
  }

  const release = () => {
    if (noRelease) {return}
    clearTimeout(releaseTimer.current)
    releaseTimer.current = window.setTimeout(() => setPressed(false), duration)
  }

  const handleClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (!onClick) {return}
    clickTimer.current = window.setTimeout(() => onClick(e), duration)
  }

  useEffect(() => {
    clearTimeout(releaseTimer.current)
    clearTimeout(clickTimer.current)
  }, [])

  return (<div className={`press-button-wrap ${className}`} ref={buttonRef}>
    <button
      className={`press-button ${pressed ? " pressed" : ""}`}
      onPointerDown={press}
      onPointerUp={release}
      onPointerLeave={release}
      onPointerCancel={release}
      onClick={handleClick}
      {...props}
    >
      {children}
    </button>
  </div>)
}