import { Navbar } from "./Navbar";
import { Logo } from "./Logo";
import { LoginButton } from "./LoginButton";

export function Sidebar() {
    return <>
        <div className='bg-custom-blue-200 flex flex-col w-[82px] shrink-0 justify-between hover:w-72 transition-all group'>
            <div>
                <Logo />
                <Navbar />
            </div>
            <LoginButton />
        </div>
    </>
}