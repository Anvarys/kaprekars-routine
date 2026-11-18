import { useEffect, useRef, useState } from "react"
import PressButton from "../components/PressButton"
import { sleep, nextClick, readLocalStorage, writeLocalStorage } from "../utils"
import { Checkbox } from "../components/Checkbox"

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
  const [DIGITS, setDigits] = useState<number>(readLocalStorage("digits", 4))
  let defaultNumber = Array.from({length: DIGITS}, (_, i) => (i+1)%10).join("")

  const [numberChosen, setNumberChosen] = useState<string>(defaultNumber)
  const [resultNumber, setResultNumber] = useState<Array<number>>(Array.from({length: DIGITS}, () => -1))
  const [running, setRunning] = useState<boolean>(false)
  const [animationStage, _setAnimationStage] = useState<number>(-1)
  const [data, setData] = useState<DataType>(getInitData())
  const [awaitingClick, setAwaitingClick] = useState<boolean>(false)
  const [infoStr, setInfoStr] = useState<string>("")
  const [wrongInput, setWrongInput] = useState<boolean>(false)
  const [speedUp, setSpeedUp] = useState<number>(1)
  const [hasRanOnce, setHasRanOnce] = useState(readLocalStorage("hasRanOnce", false))
  const [skipInfo, setSkipInfo] = useState(readLocalStorage("skipInfo", false))
  const routineStepRef = useRef<number>(0)
  const speedUpRef = useRef<number>(1)
  const numberChosenRef = useRef<string>(defaultNumber)

  useEffect(() => {
    writeLocalStorage("hasRanOnce", hasRanOnce)
  }, [hasRanOnce])

  useEffect(() => {
    writeLocalStorage("skipInfo", skipInfo)
  }, [skipInfo])

  useEffect(() => {
    numberChosenRef.current = numberChosen
  }, [numberChosen])

  useEffect(() => {
    writeLocalStorage("digits", DIGITS)
  }, [DIGITS])

  async function setAnimationStage(value: number) {
    _setAnimationStage(value)
    return await sleep(10)
  }

  function s(value: number) {
    return Math.round(value * speedUpRef.current)
  }

  function sr(value: number) {
    console.log(Math.round(value * speedUp))
    return Math.round(value * speedUp)
  }

  function getInitData() {
    const ndata: DataType = {bigger: [], smaller: [], result: []}
    for (let digit = 0; digit < DIGITS; digit++) {
      ndata.bigger.push({
        baseX: digit,
        x: digit,
        y: -0.3
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
    if ((force == true || routineStepRef.current == 0) && !skipInfo) {
      console.log(routineStepRef.current)
      setInfoStr(str)
      setAwaitingClick(true)
      await nextClick()
      setAwaitingClick(false)
    }
  }

  async function animate() {
    setData(getInitData())

    setAnimationStage(0)

    if (routineStepRef.current == 0) {
      await sleep(1000)
      setAnimationStage(1)
      await sleep(400)
    }

    await sleep(s(100))

    await showInfo("1. Creating the biggest number by choosing the biggest digits first")

    // make the bigger number
    await setAnimationStage(2)
    await sleep(30)

    const decreasing = numStrToIndexedArray(numberChosenRef.current).toSorted((a, b) => b[0]-a[0])
    let biggerNumber = 0
    for (let i = 0; i < DIGITS; i++) {
      const id = decreasing[i][1]
      biggerNumber += decreasing[i][0] * 10 ** (DIGITS-i-1)
      changeNumberProp("bigger", id, "number-blue", s(800))
      moveNumber("bigger", id, {x: i, y: 1})
      changeNumberProp("smaller", id, "number-blue")
      moveNumber("smaller", id, {x: i, y: 1})
      await sleep(s(700))
    }

    console.log(biggerNumber)

    await showInfo("2. Creating the smallest number by choosing the smallest digits first")
    // make the smaller number
    await setAnimationStage(3)
    await sleep(30)

    const increasing = Array.from(decreasing).toReversed()
    let smallerNumber = 0
    for (let i = 0; i < DIGITS; i++) {
      const id = increasing[i][1]
      smallerNumber += increasing[i][0] * 10 ** (DIGITS-i-1)
      changeNumberProp("smaller", id, "number-red", s(800))
      moveNumber("smaller", id, {x: i, y: 2})
      await sleep(s(700))
    }

    console.log(smallerNumber)

    await showInfo("3. Subtracting the smaller number from the bigger number")

    // subtraction
    await setAnimationStage(4)

    const rawResult = String(biggerNumber - smallerNumber)
    const result = "0".repeat(DIGITS-rawResult.length)+rawResult
    setResultNumber(numStrToArray(result))

    await sleep(s(800))

    for (let i = DIGITS-1; i > -1; i--) {
      changeNumberProp("result", i, "text", s(500), 1, 0)
      await sleep(s(400))
    }

    if (numberChosenRef.current == result) {
      await showInfo("The result equals the input. The End", true)
      speedUpRef.current = 1
      setRunning(false)
      setAnimationStage(-1)
      routineStepRef.current = 0
      await sleep(300)
      document.querySelectorAll(".faded").forEach((e) => {
        e.classList.remove("faded")
      })
      setHasRanOnce(true)
      return
    }

    await showInfo("4. Repeating until the result equals the input")

    setAnimationStage(5)

    await sleep(s(400))

    for (let i = 0; i < DIGITS; i++) {
      changeNumberProp("smaller", increasing[i][1], "text", s(800), 0, 10)
      await sleep(s(100))
    }

    for (let i = 0; i < DIGITS; i++) {
      changeNumberProp("bigger", decreasing[i][1], "text", s(800), 0, 10)
      await sleep(s(100))
    }

    setAnimationStage(6)

    await sleep(s(300))

    for (let i = 0; i < DIGITS; i++) {
      moveNumber("result", i, {y: -0.3})
    }

    await sleep(s(800))

    routineStepRef.current += 1
    speedUpRef.current *= 0.8
    setSpeedUp(speedUpRef.current)
    setNumberChosen(result)
    animate()
  }

  return (
  <div className={`flex w-full min-h-screen max-h-screen flex-col p-5 items-center justify-center`}>
    <h3 className="fades duration-700 absolute top-[35%]" hidden={running}>Enter any {DIGITS} digit number with at least 2 different digits</h3>
    <div className="fixed inline-block font-mono text-[3rem] leading-none h-17 justify-center transition-all duration-700 z-10" style={{top: running ? "2rem" : "45%"}}>
      <input value={numberChosen} onChange={ e => {
          const value = e.target.value
          const numberValue = Number(value)
          if (Number.isNaN(numberValue) || numberValue < 0)
          {return}
          setNumberChosen(value)
          }} inputMode="numeric" pattern="[0-9]*" className={`fades tracking-[0.3rem] text-center text-transparent px-0 py-0 border-0 duration-700 ${wrongInput ? "border-red-400" : "border-(--input)"}`}
        maxLength={DIGITS} hidden={running} style={{width: `calc(10rem + (1ch + 0.3rem) * ${DIGITS-4})`}}/>
      
      <div aria-hidden 
      className="pointer-events-none inset-0 absolute flex items-center justify-center z-100 transition-all" 
      style={{
        gap: animationStage < 1 && routineStepRef.current == 0 ? "0.3rem" : "2rem",
        transitionDuration: animationStage >= 5 || routineStepRef.current == 0 ? `${sr(800)}ms` : "0ms",
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

    { hasRanOnce &&
    <div className="fixed top-[calc(45%+5rem)] flex flex-col gap-2">
      <Checkbox 
        label="Skip explanations"
        checked={skipInfo}
        onChange={e => setSkipInfo(e.target.checked)}
        className="fades special-checkbox"
        hidden={running}
      />
      <Checkbox 
        label="3 digits"
        checked={DIGITS == 3}
        onChange={e => {
          const digits = e.target.checked ? 3 : 4
          setDigits(digits)
          defaultNumber = Array.from({length: digits}, (_, i) => (i+1)%10).join("")
          setNumberChosen(defaultNumber)
          setResultNumber(Array.from({length: digits}, () => -1))
          numberChosenRef.current = defaultNumber
        }}
        className="fades special-checkbox"
        hidden={running}
      />
    </div>
    }

    <PressButton className="fades duration-700 fixed" hidden={running} 
      style={{top: `${hasRanOnce ? 65 : 60}%`}}
      onClick={() => {
      const formattedNumber = "0".repeat(DIGITS-numberChosen.length)+numberChosen
      if ((new Set(formattedNumber)).size <= 1) {
        setWrongInput(true)
        return;
      }
      setWrongInput(false)

      setTimeout(() => {
        setRunning(true)
        routineStepRef.current = 0
        animate()
      }, 501)
      document.querySelectorAll(".fades").forEach((e) => {
        e.classList.add("faded")
      })
      setNumberChosen(formattedNumber)
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
          className={`fixed flex bg-amber-100 transition-all h-2 top-[calc(2.625rem+5rem*3)] rounded-xl`}
          style={{
            transform: `translateX(calc((-1ch - 2rem)*${DIGITS/2}))`,
            width: animationStage == 4 ? `calc((1ch + 2rem)*${DIGITS})` : "0px",
            transitionDuration: `${sr(700)}ms`
          }}
          ></div>
          <div 
          className={`fixed flex bg-teal-500 transition-all h-2 top-[calc(2.625rem+5rem*2)] rounded-xl`}
          style={{
            transform: `translateX(calc((-1ch - 2rem)*${DIGITS/2+0.5}))`,
            width: animationStage == 4 ? `2rem` : "0px",
            transitionDuration: `${sr(400)}ms`
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