import { Button } from 'rbx'
import { FC, useCallback, useState } from 'react'

type CopyButtonProps = {
  label: string
  path?: string
  title?: string
}

export const CopyButton: FC<CopyButtonProps> = ({
  label,
  path,
  title = 'Dobble'
}) => {
  const [copied, setCopied] = useState(false)

  const copyCode = useCallback(() => {
    let mounted = true
    const url = new URL(path ?? location.pathname, location.href).toString()

    if (navigator['share'] !== undefined) {
      try {
        navigator.share({ title, url })
      } catch (e) {
        console.error(e)
      }
    } else {
      navigator.clipboard.writeText(url)
      setCopied(true)

      setTimeout(() => mounted && setCopied(false), 1000)
    }

    return () => (mounted = false)
  }, [path, title])

  return (
    <Button size='small' color='light' onClick={copyCode}>
      {copied
        ? '✅ Copied'
        : `📝 ${'share' in navigator ? `Share ${label}` : `Copy ${label}`}`}
    </Button>
  )
}
