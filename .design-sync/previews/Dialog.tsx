import { Dialog, DialogContent, DialogHeader, DialogBody, DialogClose, Button } from '@subtract/ds'

export function Confirmation() {
  return (
    <Dialog defaultOpen>
      <DialogContent>
        <DialogHeader title="Delete project?" />
        <DialogBody>
          <p style={{ margin: 0, color: 'var(--ink-light)', lineHeight: 1.5 }}>
            This permanently deletes “Gridfinity build-plate” and all of its
            contents. This action cannot be undone.
          </p>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 20 }}>
            <DialogClose asChild>
              <Button variant="gray">Cancel</Button>
            </DialogClose>
            <Button variant="primary">Delete</Button>
          </div>
        </DialogBody>
      </DialogContent>
    </Dialog>
  )
}
