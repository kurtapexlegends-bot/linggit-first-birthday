import { Sun } from "lucide-react";
import { useRef, type PointerEvent } from "react";

interface UnsealEnvelopeProps {
  opening: boolean;
  opened: boolean;
  onOpen: () => void;
}

export function UnsealEnvelope({ opening, opened, onOpen }: UnsealEnvelopeProps) {
  const drag = useRef<{ id: number; x: number; y: number }>();
  const moved = useRef(false);

  function startDrag(event: PointerEvent<HTMLButtonElement>) {
    if (!event.isPrimary || event.button !== 0) return;
    drag.current = { id: event.pointerId, x: event.clientX, y: event.clientY };
    moved.current = false;
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function updateDrag(event: PointerEvent<HTMLButtonElement>) {
    const start = drag.current;
    if (start?.id !== event.pointerId) return;
    const lift = start.y - event.clientY;
    if (Math.abs(lift) > 7 || Math.abs(start.x - event.clientX) > 7) moved.current = true;
    if (!moved.current) return;
    event.currentTarget.dataset.dragging = "true";
    event.currentTarget.style.setProperty("--pull", `${Math.max(0, Math.min(lift, 74))}px`);
  }

  function endDrag(event: PointerEvent<HTMLButtonElement>, cancelled = false) {
    const start = drag.current;
    if (start?.id !== event.pointerId) return;
    drag.current = undefined;
    delete event.currentTarget.dataset.dragging;
    event.currentTarget.style.removeProperty("--pull");
    if (!cancelled && start.y - event.clientY >= 52) {
      moved.current = true;
      onOpen();
    }
  }

  return (
    <div className="envelope-stage">
      <button
        className="envelope"
        type="button"
        aria-label="Unseal the envelope"
        data-open={opening || opened}
        disabled={opening || opened}
        tabIndex={-1}
        onPointerDown={startDrag}
        onPointerMove={updateDrag}
        onPointerUp={(event) => endDrag(event)}
        onPointerCancel={(event) => endDrag(event, true)}
        onLostPointerCapture={(event) => endDrag(event, true)}
        onClick={() => {
          if (!moved.current) onOpen();
          moved.current = false;
        }}
      >
        <span className="envelope-back" />
        <span className="envelope-letter" aria-hidden="true"><Sun size={29} /> You’re invited!</span>
        <span className="envelope-pocket" />
        <span className="envelope-flap" />
        <span className="envelope-seal"><Sun aria-hidden="true" strokeWidth={1.55} /></span>
        {opening && (
          <span className="envelope-sparks" aria-hidden="true">
            <i /><i /><i /><i /><i /><i />
          </span>
        )}
      </button>
    </div>
  );
}
