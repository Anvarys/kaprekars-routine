import { useEffect, useState } from "react"
import PressButton from "../components/PressButton"
import { sleep } from "../utils"

type DataType = {
  bigger: DataItem[]
}

type DataItem = {
  baseX: number,
  x: number,
  y: number,
  duration?: number,
  color?: string
}

type Pointer = {
  id: number,
  chars: number,
  x: number,
  y: number,
  char?: string,
  duration?: number,
  color?: number
}

type Move = {x?: number, y?: number, dx?: number, dy?: number}

function SimpleVisualisationPage() {
  const DIGITS = 4;

  const [numberChosen, setNumberChosen] = useState<string>("1234")
  const [running, setRunning] = useState<boolean>(false)
  const [animationStage, setAnimationStage] = useState<number>(-1)
  const [data, setData] = useState<DataType>(getInitData())
  const [pointers, setPointers] = useState<Pointer[]>([
    {
      id: 0,
      chars: 4,
      x: 1,
      y: 0,
    }
  ])

  function getInitData() {
    const ndata: DataType = {bigger: []}
    for (let digit = 0; digit < DIGITS; digit++) {
      ndata.bigger.push({
        baseX: digit,
        x: digit,
        y: 0
      })
    }

    return ndata
  }

  function moveNumber(array: keyof DataType, id: number, move: Move) {
    setData(prev => ({
      ...prev,
      [array]: prev[array].map((item, i) => {
        if (i != id) {return item}
        return {
          ...item,
          x: move.x ?? item.x + (move.dx ?? 0),
          y: move.y ?? item.y + (move.y ?? 0)
        }
      })
    }))
  }

  function changeNumberProp(array: keyof DataType, id: number, new_color?: string, duration?: number) {
    setData(prev => ({
      ...prev,
      [array]: prev[array].map((item, i) => {
        if (i != id) {return item}
        return {
          ...item,
          color: new_color,
          duration: duration
        }
      })
    }))
  }

  function movePointer(id: number, x: number, y: number, new_color?: string, duration?: number) {
    setPointers(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        x: x,
        y: y,
        color: new_color,
        duration: duration
      } as Pointer
    }))
  }

  function numStrToArray(str: string) {
    const array: [number, number][] = []
    for (let i = 0; i < str.length; i++) {
      array.push([Number.parseInt(str[i]), i])
    }
    return array
  }

  async function animate() {
    // number inputted moves up
    setAnimationStage(0)
    await sleep(800)

    // increase gap between numbers
    setAnimationStage(1)
    await sleep(500)

    // show info
    setAnimationStage(2)
    await sleep(5000)

    // make the bigger number
    setAnimationStage(3)
    const decreasing = numStrToArray(numberChosen).toSorted((a, b) => b[0]-a[0])
    for (let i = 0; i < DIGITS; i++) {
      const id = decreasing[i][1]
      const distance = (Math.abs(id-i)+1)**0.5
      moveNumber("bigger", id, {x: i, y: 1})
      changeNumberProp("bigger", id, "number-blue", distance * 400)
      await sleep(distance * 400 - 50)
    }
  } 

  return (
  <div className={`flex w-full min-h-screen max-h-screen flex-col p-5 items-center justify-center gap-40`}>
    <h3 className="fades" hidden={running}>Enter any 4 digit number</h3>
    <div className="fixed inline-block font-mono text-[3rem] leading-none h-17 justify-center transition-all duration-700 z-10" style={{top: running ? "2rem" : "45%"}}>
      <input value={numberChosen} onChange={ e => {
          const value = e.target.value
          const numberValue = Number(value)
          if (Number.isNaN(numberValue) || numberValue < 0)
          {return}
          setNumberChosen(value)
          }} inputMode="numeric" pattern="[0-9]*" className="fades tracking-[0.3rem] text-center text-transparent w-40 px-0 py-0 border-0"
        maxLength={DIGITS} hidden={running} />
      
      <div aria-hidden className="pointer-events-none inset-0 absolute flex items-center justify-center z-100 transition-all duration-500" style={{gap: animationStage < 1 ? "0.3rem" : "2rem"}}>
        {Array.from({ length: DIGITS }, (_, i) => (
          i < numberChosen.length &&
          <span
            key={i}
            className="inline-block w-[1ch] text-center transition-all"
          >
            {numberChosen[i]}
          </span>
        ))}
      </div>
    </div>

    <PressButton className="fades" noRelease hidden={running} onClick={() => {
      setTimeout(() => {
        setRunning(true)
        animate()
      }, 501)
      document.querySelectorAll(".fades").forEach((e) => {
        e.classList.add("fading")
      })
      setNumberChosen("0".repeat(DIGITS-numberChosen.length)+numberChosen)
      }}>Visualise</PressButton>

    {/* animation part */}
    { running &&
    <div className="absolute font-mono text-[3rem] leading-none">
      { animationStage >= 2 &&
        <div aria-hidden className="pointer-events-none inset-0 fixed flex justify-center gap-8 top-10.5">
        {Array.from({ length: DIGITS }, (_, i) => (
          <span
            key={i}
            className="relative inline-block w-[1ch] text-center transition-all test"
            style={{
              transform: `translateX(calc((-1ch - 2rem)*${data.bigger[i].baseX-data.bigger[i].x}))  translateY(calc((6rem)*${data.bigger[i].y}))`,
              color: `var(--${data.bigger[i].color ?? "text"}`,
              transitionDuration: `${data.bigger[i].duration ?? 500}ms`
            }}
          >
            {numberChosen[i]}
          </span>
        ))}
        </div>
      }
      { pointers.length > 0 &&
        <div aria-hidden className="pointer-events-none inset-0 fixed flex justify-center top-10.5">
        {Array.from(pointers, (p) => (
          <span
            key={p.id}
            className="absolute inline-block w-[1ch] text-center transition-all test"
            style={{
              transform: `translateX(calc((-1ch - 2rem)*${p.chars/2.0-p.x - (p.chars+1)%2/2.0}))  translateY(calc((6rem)*${p.y}))`,
              color: `var(--${p.color ?? "text"}`,
              transitionDuration: `${p.duration ?? 500}ms`
            }}
          >
            {p.char ?? "_"}
          </span>
        ))}
        </div>
      }
      { animationStage >= 1 && animationStage <= 3 &&
        <div className="fades">

        </div>
      }
    </div>
    }
  </div>
  )
}

export default SimpleVisualisationPage