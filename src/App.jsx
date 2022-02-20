import styles from './App.module.css';
import Canvas from '@components/Canvas'
import Toolbar from './components/tool/Toolbar';
import { createSignal } from 'solid-js';

function App() {
  const [toolCon, setToolCon] = createSignal(null)
  const [savecnt, setSavecnt] = createSignal(0)
  function toolChangeHandler(e, v) {
    setToolCon(v)
  }
  function saveHanlder() {
    setSavecnt(savecnt() + 1)
  }
  return (
    <div class={styles.app}>
      <Show when={toolCon()}>
        <Canvas
        width={1980 * 2}
        height={1080 * 2}
        toolCon={toolCon}
        download={savecnt}
        ></Canvas>
      </Show>
      <Toolbar
      onChange={toolChangeHandler}
      onSave={saveHanlder}
      ></Toolbar>
    </div>
  );
}

export default App;
