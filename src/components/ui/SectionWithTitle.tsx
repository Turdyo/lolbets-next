import { ParentProps } from "solid-js";
import { twMerge } from "tailwind-merge";
import { PropsClass } from "~/lib/types";

export function SectionWithTitle(props: PropsClass<ParentProps<{ title: string }>>) {
    return <div class={twMerge(
        "flex flex-col w-full h-full bg-custom-blue-500 rounded-xl ",
        props.class
    )}>
        <div class="rounded-t-lg p-4 text-lg font-semibold">
            {props.title}
        </div>
        <div class="overflow-auto">
            {props.children}
        </div>
    </div>
}