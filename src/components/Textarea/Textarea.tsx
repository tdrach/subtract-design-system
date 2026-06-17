import styles from './Textarea.module.scss'

export type TextareaProps = Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'size'> & {
  className?: string
  /** Density. `md` (default) = `$text-base`; `sm` = `$text-small` for dense panels. */
  size?: 'sm' | 'md'
}

/** Styled multi-line `<textarea>`. Vertically resizable; all native attrs pass through. */
export function Textarea({ className, size = 'md', ...props }: TextareaProps) {
  return (
    <textarea
      className={[styles.textarea, size === 'sm' ? styles.sm : styles.md, className].filter(Boolean).join(' ')}
      {...props}
    />
  )
}

export default Textarea
