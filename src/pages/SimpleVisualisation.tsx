import { useEffect, useRef, useState } from "react"
import PressButton from "../components/PressButton"
import { sleep, nextClick } from "../utils"

type DataType = {
  bigger: DataItem[],
  smaller: DataItem[],
  result: DataItem[]
}

type DataItem = {
  baseX: number,
  x: number,
  y: number,
  duration?: number,
  color?: string,
  opacity?: number
  blur?: number
}

type Move = {x?: number, y?: number, dx?: number, dy?: number}

function SimpleVisualisationPage() {
  const DIGITS = 4;

  const [numberChosen, setNumberChosen] = useState<string>("1234")
  const [resultNumber, setResultNumber] = useState<Array<number>>([-1,-1,-1,-1])
  const [running, setRunning] = useState<boolean>(false)
  const [animationStage, _setAnimationStage] = useState<number>(-1)
  const [data, setData] = useState<DataType>(getInitData())
  const [awaitingClick, setAwaitingClick] = useState<boolean>(false)
  const [infoStr, setInfoStr] = useState<string>("")
  const routineStepRef = useRef<number>(0)
  const numberChosenRef = useRef<string>("1234")

  async function setAnimationStage(value: number) {
    _setAnimationStage(value)
    return await sleep(10)
  }

  function getInitData() {
    const ndata: DataType = {bigger: [], smaller: [], result: []}
    for (let digit = 0; digit < DIGITS; digit++) {
      ndata.bigger.push({
        baseX: digit,
        x: digit,
        y: -.3
      })
      ndata.smaller.push({
        baseX: digit,
        x: digit,
        y: 1
      })
      ndata.result.push({
        baseX: digit,
        x: digit,
        y: 3,
        opacity: 0,
        blur: 10
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

  function changeNumberProp(array: keyof DataType, id: number, new_color?: string, duration?: number, opacity?: number, blur?: number) {
    setData(prev => ({
      ...prev,
      [array]: prev[array].map((item, i) => {
        if (i != id) {return item}
        return {
          ...item,
          color: new_color,
          duration: duration,
          opacity: opacity,
          blur: blur
        }
      })
    }))
  }

  function numStrToIndexedArray(str: string) {
    const array: [number, number][] = []
    for (let i = 0; i < str.length; i++) {
      array.push([Number.parseInt(str[i]), i])
    }
    return array
  }

  function numStrToArray(str: string) {
    const array: number[] = []
    for (let i = 0; i < str.length; i++) {
      array.push(Number.parseInt(str[i]))
    }
    return array
  }

  async function showInfo(str: string, force?: boolean) {
    if (force == true || routineStepRef.current == 0) {
      console.log(routineStepRef.current)
      setInfoStr(str)
      setAwaitingClick(true)
      await nextClick()
      setAwaitingClick(false)
    }
  }

  useEffect(() => {
    numberChosenRef.current = numberChosen
  }, [numberChosen])

  async function animate() {
    setData(getInitData())

    setAnimationStage(0)

    if (routineStepRef.current == 0)
    await sleep(1000)

    // increase gap between numbers
    setAnimationStage(1)
    await sleep(500)

    await showInfo("1. Creating the biggest number by choosing the biggest digits first")

    // make the bigger number
    await setAnimationStage(2)
    const decreasing = numStrToIndexedArray(numberChosenRef.current).toSorted((a, b) => b[0]-a[0])
    let biggerNumber = 0
    for (let i = 0; i < DIGITS; i++) {
      const id = decreasing[i][1]
      biggerNumber += decreasing[i][0] * 10 ** (DIGITS-i-1)
      changeNumberProp("bigger", id, "number-blue", 800)
      moveNumber("bigger", id, {x: i, y: 1})
      changeNumberProp("smaller", id, "number-blue")
      moveNumber("smaller", id, {x: i, y: 1})
      await sleep(700)
    }

    console.log(biggerNumber)

    await showInfo("2. Creating the smallest number by choosing the smallest digits first")
    // make the smaller number
    await setAnimationStage(3)
    await sleep(50)

    const increasing = Array.from(decreasing).toReversed()
    let smallerNumber = 0
    for (let i = 0; i < DIGITS; i++) {
      const id = increasing[i][1]
      smallerNumber += increasing[i][0] * 10 ** (DIGITS-i-1)
      changeNumberProp("smaller", id, "number-red", 800)
      moveNumber("smaller", id, {x: i, y: 2})
      await sleep(700)
    }

    console.log(smallerNumber)

    await showInfo("3. Subtracting the smaller number from the bigger number")

    // subtraction
    await setAnimationStage(4)

    const result = String(biggerNumber - smallerNumber)
    setResultNumber(numStrToArray("0".repeat(DIGITS-result.length)+result))

    await sleep(800)

    for (let i = DIGITS-1; i > -1; i--) {
      changeNumberProp("result", i, "text", 500, 1, 0)
      await sleep(400)
    }

    if (numberChosenRef.current == result) {
      await showInfo("The result equals the input. The End", true)
      setRunning(false)
      setAnimationStage(-1)
      routineStepRef.current = 0
      await sleep(300)
      document.querySelectorAll(".faded").forEach((e) => {
        e.classList.remove("faded")
      })
      return
    }

    await showInfo("4. Repeating until the result equals the input")

    setAnimationStage(5)

    await sleep(400)

    for (let i = 0; i < DIGITS; i++) {
      changeNumberProp("smaller", increasing[i][1], "text", 800, 0, 10)
      await sleep(100)
    }

    for (let i = 0; i < DIGITS; i++) {
      changeNumberProp("bigger", decreasing[i][1], "text", 800, 0, 10)
      await sleep(100)
    }

    setAnimationStage(6)

    await sleep(300)

    for (let i = 0; i < DIGITS; i++) {
      moveNumber("result", i, {y: -0.3})
    }

    await sleep(800)

    routineStepRef.current += 1
    setNumberChosen(String(result))
    animate()
  }

  return (
  <div className={`flex w-full min-h-screen max-h-screen flex-col p-5 items-center justify-center gap-40`}>
    <h3 className="fades duration-700" hidden={running}>Enter any 4 digit number</h3>
    <div className="fixed inline-block font-mono text-[3rem] leading-none h-17 justify-center transition-all duration-700 z-10" style={{top: running ? "2rem" : "45%"}}>
      <input value={numberChosen} onChange={ e => {
          const value = e.target.value
          const numberValue = Number(value)
          if (Number.isNaN(numberValue) || numberValue < 0)
          {return}
          setNumberChosen(value)
          }} inputMode="numeric" pattern="[0-9]*" className="fades tracking-[0.3rem] text-center text-transparent w-40 px-0 py-0 border-0 duration-700"
        maxLength={DIGITS} hidden={running} />
      
      <div aria-hidden 
      className="pointer-events-none inset-0 absolute flex items-center justify-center z-100 transition-all" 
      style={{
        gap: animationStage < 1 && routineStepRef.current == 0 ? "0.3rem" : "2rem",
        transitionDuration: animationStage >= 5 || routineStepRef.current == 0 ? "800ms" : "0ms",
        opacity: animationStage >= 6 ? "0" : "1",
        filter: `blur(${animationStage >= 6 ? "10" : "0"}px)`
      }}
      >
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

    <PressButton className="fades duration-700" noRelease hidden={running} onClick={() => {
      setTimeout(() => {
        setRunning(true)
        routineStepRef.current = 0
        animate()
      }, 501)
      document.querySelectorAll(".fades").forEach((e) => {
        e.classList.add("faded")
      })
      setNumberChosen("0".repeat(DIGITS-numberChosen.length)+numberChosen)
      }}>Visualise</PressButton>

    {/* animation part */}
    { running &&
    <div className="absolute text-[3rem] leading-none">
      { animationStage >= 2 &&
        <div aria-hidden className="font-mono pointer-events-none inset-0 fixed flex justify-center gap-8 top-10.5">
        {Array.from(data.bigger, (v, i) => (
          <span
            key={i}
            className="relative inline-block w-[1ch] text-center transition-all test"
            style={{
              transform: `translateX(calc((-1ch - 2rem)*${v.baseX-v.x}))  translateY(calc((5rem)*${v.y+0.3}))`,
              color: `var(--${v.color ?? "text"}`,
              opacity: `${v.opacity ?? 1}`,
              filter: `blur(${v.blur ?? 0}px)`,
              transitionDuration: `${v.duration ?? 500}ms`
            }}
          >
            {numberChosen[i]}
          </span>
        ))}
        </div>
      }
      { animationStage >= 3 &&
        <div aria-hidden className="font-mono pointer-events-none inset-0 fixed flex justify-center gap-8 top-10.5">
        {Array.from(data.smaller, (v, i) => (
          <span
            key={i}
            className="relative inline-block w-[1ch] text-center transition-all"
            style={{
              transform: `translateX(calc((-1ch - 2rem)*${v.baseX-v.x}))  translateY(calc((5rem)*${v.y+0.3}))`,
              color: `var(--${v.color ?? "text"}`,
              opacity: `${v.opacity ?? 1}`,
              filter: `blur(${v.blur ?? 0}px)`,
              transitionDuration: `${v.duration ?? 500}ms`
            }}
          >
            {numberChosen[i]}
          </span>
        ))}
        </div>
      }
      { animationStage >= 4 &&
        <div aria-hidden className="font-mono pointer-events-none inset-0 fixed flex justify-center gap-8 top-10.5">
        {Array.from(data.result, (v, i) => (
          <span
            key={i}
            className="relative inline-block w-[1ch] text-center transition-all test"
            style={{
              transform: `translateX(calc((-1ch - 2rem)*${v.baseX-v.x}))  translateY(calc((5rem)*${v.y+0.3}))`,
              color: `var(--${v.color ?? "text"}`,
              opacity: `${v.opacity ?? 1}`,
              filter: `blur(${v.blur ?? 0}px)`,
              transitionDuration: `${v.duration ?? 500}ms`
            }}
          >
            {resultNumber[i] ?? " "}
          </span>
        ))}
        </div>
      }
      { animationStage >= 3 &&
        <div>
          <div 
          className={`fixed flex bg-amber-100 transition-all duration-700 h-2 top-[calc(2.625rem+5rem*3)] rounded-xl`}
          style={{
            transform: `translateX(calc((-1ch - 2rem)*${DIGITS/2}))`,
            width: animationStage == 4 ? `calc((1ch + 2rem)*${DIGITS})` : "0px"
          }}
          ></div>
          <div 
          className={`fixed flex bg-teal-500 transition-all duration-400 h-2 top-[calc(2.625rem+5rem*2)] rounded-xl`}
          style={{
            transform: `translateX(calc((-1ch - 2rem)*${DIGITS/2+0.5}))`,
            width: animationStage == 4 ? `2rem` : "0px"
          }}
          ></div>
        </div>
      }
      {
        <div className={`fixed left-0 top-[65vh] flex w-full h-full justify-center fades duration-400 ${awaitingClick ? "" : "faded"} text-[1.5rem] md:text-[2rem] leading-10`}>
          <p className="max-w-2xl text-center">
            {infoStr}
          </p>
        </div>
      }
      <div className={`fixed left-0 top-[85vh] flex w-full h-full justify-center fades ${awaitingClick ? "" : "faded"} text-xl leading-10 duration-400`}>
        <p className="max-w-2xl text-center text-neutral-500">
          click {window.innerWidth > 1024 && "any key"} to continue
        </p>
      </div>
    </div>
    }
  </div>
  )
}

export default SimpleVisualisationPage