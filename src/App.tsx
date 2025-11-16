import { useCallback, useLayoutEffect, useRef, useState } from 'react'
import './App.css'

function useIsOverflowing<T extends HTMLElement>(callback?: (isOverflowing: boolean) => void) {
  const ref = useRef<T>(null);
  const [isOverflowing, setIsOverflowing] = useState(false);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const check = () => {
      const newIsOverflowing = el.scrollWidth > el.clientWidth;
      setIsOverflowing((prev) => {
        if (prev === newIsOverflowing) return prev;
        callback?.(newIsOverflowing);
        return newIsOverflowing;
      })
    };

    check();

    const resizeObserver = new ResizeObserver(check);
    resizeObserver.observe(el);

    const mutationObserver = new MutationObserver(check);
    mutationObserver.observe(el, {
      childList: true,
      subtree: true,
      characterData: true,
    });

    return () => {
      resizeObserver.disconnect()
      mutationObserver.disconnect()
    }
  }, [callback]);

  return { ref, isOverflowing };
}

const TRIGGER_WIDTH_PX = 600;

// buffer ensures that if there is an extra small chip that gets added to the end that happens to be smaller than the "+ more chips" chip,
// we do not have the "+ more chips" chip get cut off or resort to visually truncating/removing multiple chips previously added at once.
const BUFFER_WIDTH_PX = 100;

function App() {
  const [value, setValue] = useState<string[]>(['Chip 1'])
  const [lastValueBeforeOverflow, setLastValueBeforeOverflow] = useState(Infinity)

  const addChip = () => {
    setValue([...value, `Chip ${value.length + 1}`])
  }

  const removeChip = () => {
    setValue(value.slice(0, value.length - 1))
  }

  const cb = useCallback((overflowing: boolean) => {
    if (!overflowing) return setLastValueBeforeOverflow(Infinity);
    setLastValueBeforeOverflow(value.length - 1)
  }, [value.length])

  const { ref, isOverflowing } = useIsOverflowing<HTMLDivElement>(cb)

  const numberOfOverflowingChips = value.length - lastValueBeforeOverflow

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <div style={{ display: 'flex', gap: '8px' }}>
        <button onClick={addChip}>add chip</button>
        <button onClick={removeChip}>remove chip</button>
      </div>
      <div style={{ width: `${TRIGGER_WIDTH_PX}px`, backgroundColor: 'blue', overflow: 'hidden' }}>
        <div ref={ref} style={{ width: `${TRIGGER_WIDTH_PX - BUFFER_WIDTH_PX}px`, padding: '8px', display: 'flex', gap: '4px', backgroundColor: isOverflowing ? 'red' : 'green' }}>
          {
            value.slice(0, lastValueBeforeOverflow).map((v) => <button key={v} style={{ whiteSpace: 'nowrap' }}>{v}</button>)
          }
          {
            isOverflowing && numberOfOverflowingChips > 0 && (
              <button style={{ whiteSpace: 'nowrap' }}>+{numberOfOverflowingChips}</button>
            )
          }
        </div>
      </div>
      <div>
        Is Overflowing: {isOverflowing ? 'true' : 'false'}
      </div>
    </div>
  )
}

export default App
