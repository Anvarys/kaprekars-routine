import { useNavigate } from "react-router"; 
import { writeLocalStorage } from "../utils";
import PressButton from "../components/PressButton";

function IntroPage() {
  const navigate = useNavigate();

  return (
  <div className='flex w-full min-h-screen max-h-screen flex-col justify-between p-5'>
    <div className="w-full flex justify-center">
      <h1>Kaprekar's Routine</h1>
    </div>
    <ol className="list-decimal text-[1.2rem] ml-4 md:text-[2rem] md:ml-8 space-y-4" start={0}>
      <li>Choose any 4 digit number with at least 2 different digits</li>
      <li>Create the largest possible number with the digits from the number by ordering it's digits from biggest to smallest</li>
      <li>Create the smallest possible number with the digits from the number by ordering it's digits from smallest to biggest</li>
      <li>Substract the smaller number from the bigger number</li>
      <li>Repeat from step 1 with the newly obtained number</li>
    </ol>
    <div className="flex w-full justify-center mb-10">
      <PressButton onClick={() => {
        writeLocalStorage("showIntro", false)
        writeLocalStorage("lastPage", "/visualisation/simple")
        navigate("/visualisation/simple")
        }} noRelease>Try yourself</PressButton>
    </div>
  </div>
  )
}

export default IntroPage