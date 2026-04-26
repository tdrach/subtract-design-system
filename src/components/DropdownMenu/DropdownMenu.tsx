'use client'

import * as Radix from '@radix-ui/react-dropdown-menu'
import styles from './DropdownMenu.module.scss'

export const DropdownMenu = Radix.Root
export const DropdownMenuTrigger = Radix.Trigger

export function DropdownMenuContent({
  children,
  align = 'end',
  ...props
}: Radix.DropdownMenuContentProps) {
  return (
    <Radix.Portal>
      <Radix.Content align={align} className={styles.content} sideOffset={4} {...props}>
        {children}
      </Radix.Content>
    </Radix.Portal>
  )
}

export function DropdownMenuItem({
  children,
  destructive,
  onSelect,
  ...props
}: Radix.DropdownMenuItemProps & { destructive?: boolean }) {
  return (
    <Radix.Item
      className={`${styles.item} ${destructive ? styles.destructive : ''}`}
      onSelect={onSelect}
      {...props}
    >
      {children}
    </Radix.Item>
  )
}

export function DropdownMenuSeparator() {
  return <Radix.Separator className={styles.separator} />
}
