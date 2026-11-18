import { useNavigate } from "react-router"; 
import { writeLocalStorage } from "../utils";
import PressButton from "../components/PressButton";

function IntroPage() {
  const navigate = useNavigate();

  return (
  <div className='flex w-full min-h-screen max-h-screen flex-col justify-between items-center p-5'>
    <div className="w-full flex justify-center">
      <h1>Kaprekar's Routine</h1>
    </div>
    <p className="text-[1.2rem] md:text-[2rem] md:max-w-2xl text-center">
      An algorithm that is pretty magical, with which all 4 digit numbers (with at least 1 different digit) will end up as the exact same number if the algorithm is repeated multiple times, same thing with 3 digit nubmers. But there is no other number of digits that it will give the same end result for all numbers of the same number of digits.
    </p>
    <ol className="list-decimal text-[1.2rem] ml-4 md:text-[2rem] md:ml-8 space-y-4" start={0} hidden>
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
        }} noRelease className="relative">Try yourself</PressButton>
    </div>
  </div>
  )
}

export default IntroPage