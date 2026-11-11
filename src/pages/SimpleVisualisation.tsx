import { useEffect, useState } from "react"
import PressButton from "../components/PressButton"

function SimpleVisualisationPage() {
  const [numberChosenInput, setNumberChosenInput] = useState<string>("1234")
  
  useEffect(() => {}, [])

  return (
  <div className="flex w-full min-h-screen max-h-screen flex-col p-5 items-center justify-center">
    <input value={numberChosenInput} onChange={ e => {
        const value = e.target.value
        const numberValue = Number(value)
        if (Number.isNaN(numberValue) || numberValue < 0 || value.length > 4)
        {return}
        setNumberChosenInput(value)
        }} inputMode="numeric" pattern="[0-9]*" className="w-min"/>

    <PressButton className="mt-10" noRelease>Visualise</PressButton>
  </div>
  )
}

export default SimpleVisualisationPage