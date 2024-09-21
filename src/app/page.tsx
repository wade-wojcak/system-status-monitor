import { HomeContainer } from './components/home'

/**
 * Metadata response type.
 *
 * @typedef {Object} MetadataResponse
 * @property {string} title - The page title.
 * @property {string} description - The page description.
 */
export type MetadataResponse = {
  title: string
  description: string
}

/**
 * Generates metadata for the home page.
 *
 * @returns {MetadataResponse} - An object containing the page title and description.
 */
export function generateMetadata() {
  const metadataResponse: MetadataResponse = {
    title: 'CPU Load Monitor',
    description: 'Monitor average CPU usage on your local machine.',
  }

  return metadataResponse
}

/**
 * Page component for the home page.
 *
 * @returns {JSX.Element} - The JSX element to be rendered.
 */
export default function HomePage() {
  return <HomeContainer />
}
