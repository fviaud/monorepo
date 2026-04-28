import * as React from "react"

interface SwitchProps extends React.InputHTMLAttributes<HTMLInputElement> {
  checked: boolean
  onCheckedChange: (checked: boolean) => void
}

export function Switch({ checked, onCheckedChange, ...props }: SwitchProps) {
  return (
    <label
      style={{
        display: "inline-flex",
        alignItems: "center",
        cursor: "pointer",
      }}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onCheckedChange(e.target.checked)}
        style={{ display: "none" }}
        {...props}
      />
      <span
        style={{
          width: 40,
          height: 20,
          background: checked ? "#4ade80" : "#e5e7eb",
          borderRadius: 9999,
          position: "relative",
          transition: "background 0.2s",
        }}
      >
        <span
          style={{
            position: "absolute",
            left: checked ? 20 : 0,
            top: 0,
            width: 20,
            height: 20,
            background: "white",
            borderRadius: "50%",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            transition: "left 0.2s",
          }}
        />
      </span>
    </label>
  )
}
