import { Show, createSignal } from "solid-js"

export function Modal() {
  const [show, setShow] = createSignal<boolean>(false)
  return <>
    <Show when={show()} fallback={<div onclick={() => setShow(true)}>OPEN MODAL</div>}>
    <div class="fixed inset-0 z-20 bg-background/80 backdrop-blur-sm transition-all ease-in-out" onclick={() => setShow((prev) => !prev)}></div>
      <div>
        <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 bg-custom-blue-200 border border-gray-600 w-52 h-52 rounded-lg">
          TEST MODAL
        </div>
      </div>
    </Show>
  </>
}