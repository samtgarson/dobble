import { Navbar } from "rbx"
import React, { FC } from "react"
import { GlobalState } from "../services/state"
import styles from 'src/styles/components/nav-bar.module.scss'
import Link from "next/link"

export const NavBar: FC = () => {
  const { user } = GlobalState.useContainer()

  return (
    <Navbar color='primary' className={styles.navbar}>
      <Navbar.Brand>
        <Link href="/">
          <Navbar.Item className={styles.logo}>Dobble</Navbar.Item>
        </Link>
        <Navbar.Burger />
      </Navbar.Brand>
      { user &&
        <Navbar.Menu>
          <Navbar.Segment align='end'>
            <Navbar.Item>{ user.name }</Navbar.Item>
          </Navbar.Segment>
        </Navbar.Menu>
      }
    </Navbar>
  )
}
