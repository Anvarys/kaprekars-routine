import { forwardRef, useId, type InputHTMLAttributes } from "react";

type CheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
  label: string;
};

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, id, className, ...props }, ref) => {
    const autoId = useId();
    const inputId = id ?? autoId;
    const cn = className ?? ""
    return (
      <label
        htmlFor={inputId}
        className={"inline-flex cursor-pointer select-none items-center gap-3 text-slate-700 dark:text-slate-200 " + cn}
      >
        <span className="relative grid size-6 place-items-center">
          <input
            ref={ref}
            id={inputId}
            type="checkbox"
            className={`peer absolute inset-0 size-6 cursor-pointer appearance-none rounded-md border-2 border-slate-400
              transition-all duration-200 ease-out
              hover:border-(--text)
              checked:border-transparent checked:bg-(--input)
              checked:shadow-lg checked:shadow-indigo-500/40
              focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500
              active:scale-90
              disabled:cursor-not-allowed disabled:opacity-50 ` + cn}
            {...props}
          />
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth={3}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className={`pointer-events-none relative size-4
                       [stroke-dasharray:24] [stroke-dashoffset:24]
                       transition-[stroke-dashoffset] duration-300 ease-out
                       peer-checked:[stroke-dashoffset:0] peer-checked:delay-100` + cn}
          >
            <path d="M5 12.5l4.5 4.5L19 7" />
          </svg>
        </span>
        <span>{label}</span>
      </label>
    );
  }
);

Checkbox.displayName = "Checkbox";