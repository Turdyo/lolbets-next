import { Navbar } from "./Navbar";
import { Logo } from "./Logo";
import { LoginButton } from "./LoginButton";

export async function Sidebar() {
    return <div className='bg-custom-blue-200 flex flex-col w-72 shrink-0 justify-between'>
        <div>
            <Logo />
            <Navbar />
        </div>
        <LoginButton />
    </div>

}