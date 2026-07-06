import { Suspense } from 'react'
import LoginPage from './_login'

export const dynamic = 'force-dynamic'

export default function Page() {
  return (
    <Suspense>
      <LoginPage />
    </Suspense>
  )
}
