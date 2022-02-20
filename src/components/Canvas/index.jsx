import { createEffect, createMemo, createSignal, onMount } from 'solid-js'
import style from './index.module.css'

function Canvas(props) {
  const {children, toolCon, download, ...other} = props
  let canvas
  let ctx
  let aEle
  const CLEAR_COLOR = '#fff'
  const [isDown, setisDown] = createSignal(false)
  const [position, setPosition] = createSignal({x: undefined, y: undefined})
  const [penColor, setPenColor] = createSignal('#333')
  const taskQue = []
  const memoToolCon = createMemo(() => {
    // console.log(toolCon())
    switch (toolCon().name){
      case 'color':
        setPenColor(toolCon().value.color)
        changeCanvasColor(penColor())
        break;
      case 'type' :
        if(toolCon().value === 'erease') {
          setPenColor(CLEAR_COLOR)
          changeCanvasColor(penColor())
        } else if(toolCon().value === 'ereaseAll') {
          clearAll()
        }
        break;
    }
    return toolCon()
  })
  createEffect(() => {
    if(download() > 0) {
      let href = canvas.toDataURL('image/png')
      downloadURI(href, `canvas_${Math.floor(Math.random() * 10000)}.png`)
      URL.revokeObjectURL(href)
    }
  })
  function downloadURI(uri, name) {
    let link = document.createElement("a");
    link.download = name;
    link.href = uri;
    aEle.appendChild(link);
    link.click();
    aEle.removeChild(link);
  }
  function changeCanvasColor(color) {
    if(!ctx) {
      taskQue.push(() => {
        ctx.strokeStyle = color
        ctx.fillStyle = color
      })
    } else {
      ctx.strokeStyle = color
      ctx.fillStyle = color
    }
  }
  function penDown(e) {
    const {x, y} = position()
    setisDown(true)
    setPosition({x: e.offsetX, y: e.offsetY})
    ctx.beginPath()
    ctx.moveTo(x, y)
    ctx.closePath()
  }
  function penUp() {
    const {x, y} = position()
    setisDown(false)
    ctx.closePath()
    ctx.moveTo(x, y)
    
  }
  function penMove(e) {
    const {pointerType, pressure} = e
    if((!isPen(pointerType)) || (!isDown())) return
    // drawLine(e, ctx)
    drawCicle(e, ctx)
  }
  function isPen(pointerType) {
    return pointerType === 'pen'
  }
  function drawLine(e, ctx, width = 20) {
    ctx.beginPath()
    const {x, y} = position()
    ctx.moveTo(x, y)
    setPosition({x: e.offsetX, y: e.offsetY})
    ctx.lineWidth = 20 * e.pressure
    const updateP = position()
    ctx.lineTo(updateP.x, updateP.y)
    ctx.stroke();
    ctx.closePath()
  }
  function clearAll() {
    changeCanvasColor(CLEAR_COLOR)
    ctx.fillRect(0, 0, props.width, props.height)
    changeCanvasColor(penColor())
  }
  function drawCicle(e, ctx, width = 10) {
    drawLine(e, ctx, width * 2)
    ctx.beginPath()
    const {x, y} = position()
    ctx.moveTo(x, y)
    setPosition({x: e.offsetX, y: e.offsetY})
    ctx.arc(e.offsetX, e.offsetY, width * e.pressure, 0, Math.PI * 2)
    ctx.fill()
    ctx.closePath()

  }
  onMount(() => {
    ctx = canvas.getContext('2d')
    while(taskQue.length > 0) {
      taskQue.shift()()
    }
  })
  return (
    <div 
    class={style.canvas_container}
    style={{
      width: `${props.width/2}px`,
      height: `${props.height/2}px`
    }}
    >
      <canvas
      class={style.canvas_container_item}
      {...other}
      ref={canvas}
      onPointerMove={penMove}
      onPointerDown={penDown}
      onPointerUp={penUp}
      >
        {children}
      </canvas>
      <Portal mount={document.getElementById('plugin')}>
        <a style={{
          width: '0px',
          height: '0px',
          opacity: 0
        }}
        ref={aEle}
        ></a>
      </Portal>
    </div>
  )
}

export default Canvas;