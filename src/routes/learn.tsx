import { createFileRoute } from '@tanstack/react-router'
import { QuranReaderView } from '../components/quran-reader-view'

export const Route = createFileRoute('/')({
  component: Index,
})

function Index() {
  return <QuranReaderView />
}
