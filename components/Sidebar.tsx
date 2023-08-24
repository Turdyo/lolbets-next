import { Navbar } from "./Navbar";
import { Logo } from "./Logo";
import { LoginButton } from "./LoginButton";

export function Sidebar() {
    return <>
        <div className='bg-custom-blue-200 flex flex-col w-16 shrink-0 justify-between hover:w-64 transition-all group'>
            <div>
                <Logo />
                <Navbar />
            </div>
            <LoginButton />
        </div>
    </>
}