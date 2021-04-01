import * as React from 'react'
import { Title, Level } from 'rbx'
import styles from '~/styles/components/title.module.scss'

type DobbleTitleProps = {
  text: string
}

export const DobbleTitle: React.FC<DobbleTitleProps> = ({ text, children }) => (
  <>
    <Level breakpoint="mobile">
      <Level.Item align='left'><Title className={styles.title} size={3}>{ text }</Title></Level.Item>
      <Level.Item align='right'>
        { children }
      </Level.Item>
    </Level>
  </>
)
