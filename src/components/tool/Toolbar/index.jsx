import style from './index.module.css'
import Erease from '../Erease';
import EreaseAll from '../EreaseAll';
import ColorPicker from '../ColorPicker';
import Savebar from '../Savebar';
import { createSignal, onMount } from 'solid-js';
import { colorgroup } from './color';

function Toolbar(props) {
  let initColorIndex = 8
  const tooltype = ['erease', 'ereaseAll', 'colorPicker']
  const [colorcards, setColorcards] = createSignal(colorgroup)
  const [current, setCurrent] = createSignal(tooltype[2])
  const [currentColor, setCurrentColor] = createSignal(colorcards()[initColorIndex])
  function activeHandler(e, type) {
    setCurrent(type)
    props.onChange?.(e, {name: 'type', value: type})
    switch (type) {
      case tooltype[2]: 
        props.onChange?.(e, {name: 'color', value: currentColor()})
        break;
    }
  }
  function colorHandler(e, colorIndex) {
    setCurrentColor(colorcards()[colorIndex()])
    props.onChange?.(e, {name: 'color', value: currentColor()})
  }
  function handlerDownload() {
    props.onSave?.()
  }
  onMount(() => {
    activeHandler(null, current())
    colorHandler(null, () => initColorIndex)
  })
  return (
    <section class={style.tool_bar}>
      <ul class={style.tool_bar_ul}>
        <li onClick={(e) => {activeHandler(e, tooltype[0])}} classList={{[style.active_li]: current() === tooltype[0]}}> <Erease></Erease> </li>
        <li onClick={(e) => {activeHandler(e, tooltype[1])}} classList={{[style.active_li]: current() === tooltype[1]}}> <EreaseAll></EreaseAll> </li>
        <li onClick={(e) => {activeHandler(e, tooltype[2])}} classList={{[style.active_li]: current() === tooltype[2]}}> <ColorPicker></ColorPicker> </li>
      </ul>
      <Show when={current() === tooltype[2]}>
        <ul 
        class={`${style.tool_bar_ul} ${style.tool_bar_ul_colorcard}`}
        >
          <For each={colorcards()}>
            {(item, index) => (<li 
            onClick={(e) => {colorHandler(e, index)}}
            classList={{
              [style.li_color_active]: currentColor().name === item.name
            }}>
              <span style={{background: item.color}}></span>
            </li>)}
          </For>
        </ul>
      </Show>
      <Savebar
      onClick={handlerDownload}
      ></Savebar>
    </section>
  )
}

export default Toolbar;