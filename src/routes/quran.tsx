import { createFileRoute } from '@tanstack/react-router'
import { QuranReaderView } from '../components/quran-reader-view'

export const Route = createFileRoute('/quran')({
  component: QuranRoute,
})

function QuranRoute() {
  return <QuranReaderView />
}
