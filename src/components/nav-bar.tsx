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
        <Link href="/" passHref>
          <Navbar.Item className={styles.logo}>Dobble</Navbar.Item>
        </Link>
        { user && <Navbar.Burger /> }
      </Navbar.Brand>
      { user &&
        <Navbar.Menu>
          <Navbar.Segment align='end'>
            <Link passHref href="/help"><Navbar.Item>Help</Navbar.Item></Link>
            <Link passHref href="/about"><Navbar.Item>About</Navbar.Item></Link>
            { user.auth_id
               ? <Link passHref href="/logout"><Navbar.Item>Sign Out</Navbar.Item></Link>
               : <Link passHref href={`/login?redirect=${location.pathname}`}><Navbar.Item>Sign In</Navbar.Item></Link>
            }
            <Navbar.Item as='span' className='has-text-weight-semibold'>{ user.name }</Navbar.Item>
          </Navbar.Segment>
        </Navbar.Menu>
      }
    </Navbar>
  )
}
