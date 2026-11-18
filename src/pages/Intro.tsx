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
      An algorithm that is pretty magical, with which all 4 digit numbers (with at least 1 different digit) will end up as the exact same number if the algorithm is repeated multiple times <br/><br/> Same thing with 3 digit nubmers. But there is no other number of digits that does that (gives the same end result for all numbers of the same number of digits)
    </p>
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