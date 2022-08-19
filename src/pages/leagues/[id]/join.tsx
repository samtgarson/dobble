import { GetServerSideProps } from 'next'
import { DataClient } from '~/src/services/data-client'
import { loginUrl } from '~/src/util'
import FiveHundred from '../../500'

export default FiveHundred

export const getServerSideProps: GetServerSideProps = async ({
  req,
  query
}) => {
  const client = new DataClient()
  const user = await client.getUserFromCookie(req)

  if (!user)
    return {
      redirect: {
        permanent: false,
        destination: loginUrl(req.url)
      }
    }

  try {
    const { id } = query as { id: string }

    const league = await client.getLeague(id)
    if (!league) return { notFound: true }

    if (!league.members.find((m) => m.user.id == user.id)) {
      await client.joinLeague(user.id, id as string)
    }

    return {
      redirect: {
        permanent: false,
        destination: `/leagues/${id}`
      }
    }
  } catch (e) {
    return { props: {} }
  }
}
