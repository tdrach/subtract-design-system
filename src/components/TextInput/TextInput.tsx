import styles from './TextInput.module.scss'

export type TextInputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> & {
  className?: string
  /**
   * Visual density. `md` (default) = 44px / `$text-base`, for forms and primary
   * surfaces. `sm` = 28px / `$text-small`, for dense panels (inspectors, toolbars).
   */
  size?: 'sm' | 'md'
}

export function TextInput({ className, size = 'md', ...props }: TextInputProps) {
  return (
    <input
      className={[styles.input, size === 'sm' ? styles.sm : styles.md, className].filter(Boolean).join(' ')}
      {...props}
    />
  )
}

// Named default export for backwards compat
export default TextInput
