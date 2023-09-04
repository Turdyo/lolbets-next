import { JSXElement, ParentProps } from "solid-js";
import { twMerge } from "tailwind-merge";
import { PropsClass } from "~/lib/types";

export function SectionWithTitle(props: PropsClass<ParentProps<{ title: JSXElement }>>) {
  return <div class={twMerge(
    "flex flex-col w-full h-full bg-custom-blue-500 rounded-xl",
    props.class
  )}>
    <div class="rounded-t-lg p-4 text-lg font-semibold text-custom-white-100">
      {props.title}
    </div>
    <div class="overflow-auto h-full">
      {props.children}
    </div>
  </div>
}