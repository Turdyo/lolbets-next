import Image from "next/image";
import Link from "next/link";
import logo from '@/public/lolbets-logo.png'
import { PropsWithClassName } from "@/lib/types/common";
import { twMerge } from "tailwind-merge";

export function Logo({ className }: PropsWithClassName) {
    return <>
        <Link className={twMerge('flex items-center gap-6 m-2 self-center cursor-pointer', className)} href={"/"}>
            <Image src={logo} alt="Logo" width={48} height={48} />
            <h1 className='text-4xl font-bold opacity-0 group-hover:opacity-100 transition-all'>LOLBETS</h1>
        </Link>
    </>
}