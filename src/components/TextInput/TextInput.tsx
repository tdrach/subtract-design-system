import styles from './TextInput.module.scss'

export type TextInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  className?: string
}

export function TextInput({ className, ...props }: TextInputProps) {
  return (
    <input
      className={[styles.input, className].filter(Boolean).join(' ')}
      {...props}
    />
  )
}

// Named default export for backwards compat
export default TextInput
