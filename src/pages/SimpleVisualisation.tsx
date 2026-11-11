import { useEffect, useState } from "react"
import PressButton from "../components/PressButton"
import { sleep } from "../utils"

function SimpleVisualisationPage() {
  const DIGITS = 4;

  const [numberChosen, setNumberChosen] = useState<string>("1234")
  const [running, setRunning] = useState<boolean>(false)
  const [animationStage, setAnimationStage] = useState<number>(-1)

  async function animate() {
    // number inputted moves up
    setAnimationStage(0)
    await sleep(1000)

    // duplication of the number moves down
    setAnimationStage(1)
  } 

  return (
  <div className={`flex w-full min-h-screen max-h-screen flex-col p-5 items-center justify-center gap-40`}>
    <h3 className="fades-away" hidden={running}>Enter any 4 digit number</h3>
    <div className="absolute inline-block font-mono text-[3rem] leading-none h-17 transition-[top] duration-700" style={{top: running ? "2rem" : "46.5%"}}>
      <input value={numberChosen} onChange={ e => {
          const value = e.target.value
          const numberValue = Number(value)
          if (Number.isNaN(numberValue) || numberValue < 0)
          {return}
          setNumberChosen(value)
          }} inputMode="numeric" pattern="[0-9]*" className="fades-away tracking-[0.3rem] text-center text-transparent w-40 px-0 py-0 border-0"
        maxLength={DIGITS} hidden={running} />
      
      <div aria-hidden className="pointer-events-none inset-0 absolute flex items-center justify-center gap-[0.3rem]">
        {Array.from({ length: DIGITS }, (_, i) => (
          i < numberChosen.length &&
          <span
            key={i}
            className="inline-block w-[1ch] text-center"
          >
            {numberChosen[i]}
          </span>
        ))}
      </div>
    </div>

    <PressButton className="fades-away" noRelease hidden={running} onClick={() => {
      setTimeout(() => {
        setRunning(true)
        animate()
      }, 501)
      document.querySelectorAll(".fades-away").forEach((e) => {
        e.classList.add("fading")
      })
      setNumberChosen("0".repeat(DIGITS-numberChosen.length)+numberChosen)
      }}>Visualise</PressButton>

    {/* animation part */}
    { running &&
    <>
    </>
    }
  </div>
  )
}

export default SimpleVisualisationPage