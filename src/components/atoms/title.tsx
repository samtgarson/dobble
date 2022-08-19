import { Title } from 'rbx'
import { TitleVariables } from 'rbx/elements/title/title'
import * as React from 'react'
import styles from '~/styles/components/title.module.scss'

type DobbleTitleProps = {
  text: string
  size?: TitleVariables['sizes']
  children?: React.ReactNode
}

export const DobbleTitle: React.FC<DobbleTitleProps> = ({
  text,
  children,
  size = 3
}) => (
  <>
    <Title className={styles.title} size={size}>
      {text}
    </Title>
    <div className={styles.corner}>{children}</div>
  </>
)
