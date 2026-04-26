import styles from './TextInput.module.scss'

export interface TextInputProps {
  value?: string
  defaultValue?: string
  placeholder?: string
  disabled?: boolean
  type?: 'text' | 'email' | 'password' | 'search' | 'url' | 'date'
  name?: string
  id?: string
  autoFocus?: boolean
  className?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void
}

export default function TextInput({ className, ...props }: TextInputProps) {
  return (
    <input
      className={[styles.input, className].filter(Boolean).join(' ')}
      {...props}
    />
  )
}
