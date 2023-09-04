import { JSX, ParentProps, Show, createSignal } from "solid-js"
import { twMerge } from "tailwind-merge"
import { PropsClass } from "~/lib/types"


export function Modal(props: PropsClass<ParentProps<{
  fallBack: JSX.Element
  title?: JSX.Element
  onClose?: () => void
}>>) {
  const [show, setShow] = createSignal<boolean>(false)
  return <>
    <button onclick={() => setShow(true)}>{props.fallBack}</button>
    <Show when={show()}>
      <div
        class="fixed inset-0 z-20 bg-background/80 backdrop-blur-sm"
        onclick={() => {
          props.onClose && props.onClose()
          setShow(false)
        }}
      />
      <div class={twMerge("absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 bg-custom-blue-200 border border-gray-700 w-full max-w-lg rounded-lg p-6", props.class)} >
        <Cross
          class="absolute top-4 right-4 opacity-70 hover:opacity-100 transition-opacity cursor-pointer"
          onclick={() => {
            props.onClose && props.onClose()
            setShow(false)
          }}
        />
        <div class="text-lg font-semibold">{props.title}</div>
        {props.children}
      </div>
    </Show>
  </>
}

function Cross(props: JSX.SVGElementTags["svg"]) {
  return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4" {...props}>
    <line x1="18" x2="6" y1="6" y2="18"></line>
    <line x1="6" x2="18" y1="6" y2="18"></line>
  </svg>
}