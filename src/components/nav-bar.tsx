import Link from 'next/link'
import { useRouter } from 'next/router'
import { Navbar } from 'rbx'
import { FC, ReactNode, useEffect, useState } from 'react'
import styles from 'src/styles/components/nav-bar.module.scss'
import { User } from '~/types/api'
import { GlobalState } from '../services/state'
import { loginUrl } from '../util'

const ActiveLink: FC<{ href: string; children: ReactNode }> = ({
  href,
  children
}) => {
  const { pathname } = useRouter()

  const className = pathname.startsWith(href) ? 'has-text-weight-bold' : ''

  return (
    <Link href={href} passHref>
      <Navbar.Item className={className}>{children}</Navbar.Item>
    </Link>
  )
}

const UserNav = ({ user }: { user: User }) => (
  <Navbar.Menu>
    <Navbar.Segment align='end'>
      <ActiveLink href='/leagues'>Leagues</ActiveLink>
      <ActiveLink href='/help'>Help</ActiveLink>
      <ActiveLink href='/about'>About</ActiveLink>
      {user.auth_id ? (
        <ActiveLink href='/logout'>Sign Out</ActiveLink>
      ) : (
        <ActiveLink href={loginUrl(location.pathname)}>Sign In</ActiveLink>
      )}
      <Navbar.Item as='span' className='has-text-weight-semibold'>
        {user.name}
      </Navbar.Item>
    </Navbar.Segment>
  </Navbar.Menu>
)

export const NavBar: FC = () => {
  const { user } = GlobalState.useContainer()
  const router = useRouter()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const closeNav = () => setOpen(false)

    router.events.on('routeChangeComplete', closeNav)

    return () => {
      router.events.off('routeChangeComplete', closeNav)
    }
  }, [router])

  return (
    <Navbar color='primary' className={styles.navbar} managed active={open}>
      <Navbar.Brand>
        <Link href='/' passHref>
          <Navbar.Item className={styles.logo}>Dobble</Navbar.Item>
        </Link>
        {user && <Navbar.Burger onClick={() => setOpen(!open)} />}
      </Navbar.Brand>
      {user && <UserNav user={user} />}
    </Navbar>
  )
}
