import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function Select({
  value,
  onChange,
  options,
  placeholder = "Select…",
  disabled = false,
  className = "",
}) {
  const buttonRef = useRef(null);
  const listRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [rect, setRect] = useState(null);

  const selected = useMemo(
    () => options.find((o) => String(o.value) === String(value)) || null,
    [options, value]
  );

  const updateRect = () => {
    const el = buttonRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setRect({
      left: r.left,
      top: r.top,
      bottom: r.bottom,
      width: r.width,
      height: r.height,
    });
  };

  useEffect(() => {
    if (!open) return;
    updateRect();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onScroll = () => updateRect();
    const onResize = () => updateRect();
    window.addEventListener("scroll", onScroll, true);
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("scroll", onScroll, true);
      window.removeEventListener("resize", onResize);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e) => {
      const btn = buttonRef.current;
      const list = listRef.current;
      const target = e.target;
      if (!btn || !list || !(target instanceof Node)) return;
      if (btn.contains(target) || list.contains(target)) return;
      setOpen(false);
    };
    document.addEventListener("pointerdown", onDoc, true);
    return () => document.removeEventListener("pointerdown", onDoc, true);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const idx = options.findIndex((o) => String(o.value) === String(value));
    setActiveIndex(idx >= 0 ? idx : 0);
    queueMicrotask(() => listRef.current?.focus());
  }, [open, options, value]);

  const selectValue = (nextValue) => {
    onChange?.(String(nextValue));
    setOpen(false);
  };

  const onButtonKeyDown = (e) => {
    if (disabled) return;
    if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setOpen(true);
    }
  };

  const onListKeyDown = (e) => {
    if (e.key === "Escape") {
      e.preventDefault();
      setOpen(false);
      buttonRef.current?.focus();
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => clamp((i < 0 ? 0 : i) + 1, 0, options.length - 1));
      return;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => clamp((i < 0 ? 0 : i) - 1, 0, options.length - 1));
      return;
    }
    if (e.key === "Home") {
      e.preventDefault();
      setActiveIndex(0);
      return;
    }
    if (e.key === "End") {
      e.preventDefault();
      setActiveIndex(options.length - 1);
      return;
    }
    if (e.key === "Enter") {
      e.preventDefault();
      const opt = options[activeIndex];
      if (opt) selectValue(opt.value);
    }
  };

  const menu = open && rect
    ? createPortal(
        <div
          ref={listRef}
          tabIndex={-1}
          role="listbox"
          aria-activedescendant={activeIndex >= 0 ? `select-opt-${activeIndex}` : undefined}
          onKeyDown={onListKeyDown}
          className="fixed z-[10050] outline-none"
          style={{
            left: rect.left,
            top: rect.bottom + 8,
            width: rect.width,
            maxHeight: "min(320px, calc(100vh - 24px))",
          }}
        >
          <div className="glass-panel rounded-[18px] overflow-hidden">
            <div className="max-h-[320px] overflow-auto p-1">
              {options.map((opt, idx) => {
                const isActive = idx === activeIndex;
                const isSelected = String(opt.value) === String(value);
                return (
                  <button
                    key={String(opt.value)}
                    id={`select-opt-${idx}`}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    onMouseEnter={() => setActiveIndex(idx)}
                    onClick={() => selectValue(opt.value)}
                    className={`w-full text-left rounded-[14px] px-4 py-3 text-sm transition ${
                      isActive
                        ? "bg-black/10 dark:bg-white/10"
                        : "bg-transparent"
                    } ${isSelected ? "font-semibold" : "font-medium"} text-[color:var(--fg)]`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>,
        document.body
      )
    : null;

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        disabled={disabled}
        onClick={() => {
          if (disabled) return;
          setOpen((v) => !v);
        }}
        onKeyDown={onButtonKeyDown}
        className={`w-full rounded-2xl border border-white/15 bg-white/65 dark:bg-white/5 px-5 py-3 text-sm outline-none transition focus:border-white/30 text-[color:var(--fg)] flex items-center justify-between gap-3 ${className}`}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className={`min-w-0 truncate ${selected ? "" : "text-[color:var(--muted)]"}`}>
          {selected ? selected.label : placeholder}
        </span>
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`shrink-0 transition ${open ? "rotate-180" : ""}`}
        >
          <path
            d="M6 9L12 15L18 9"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      {menu}
    </>
  );
}

export { Select };
