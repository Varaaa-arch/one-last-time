import StudioLoader from "@/components/loaders/StudioLoader";
import CustomCursor from "@/components/ui/CustomCursor";

// import HeroIntro from "@/components/sections/02_HeroIntro"
// import WhatIRealized from "@/components/sections/03_WhatIRealized"
// import MemoryUniverse from "@/components/sections/04_MemoryUniverse"
// import MainLetter from "@/components/sections/05_MainLetter"
// import FinalScene from "@/components/sections/06_FinalScene"

export default function Home() {
  return (
    <>
      {/* GLOBAL LOADER */}
      <StudioLoader />
      <CustomCursor />

      {/* MAIN WEBSITE */}
      <main className="relative w-full overflow-hidden bg-[#f3f1ec] text-black">
        
        {/* HERO
        <HeroIntro />

        {/* STORY */}
        {/* <WhatIRealized /> */}

        {/* MEMORY */}
        {/* <MemoryUniverse /> */}

        {/* LETTER */}
        {/* <MainLetter /> */}

        {/* ENDING */}
        {/* <FinalScene /> */} 
      </main>
    </>
  )
}