// Smoke tests for the main route shell and a few public pages.
import { fireEvent, render, screen } from '@testing-library/react'
import App from '../App'

const renderAtRoute = (route = '/home') => {
  window.history.pushState({}, 'Test page', route)
  return render(<App />)
}

test('renders the landing page', () => {
  renderAtRoute('/home')
  expect(
    screen.getByRole('heading', {
      name: 'Masterpiece comes with immaculate craftsmanship',
    })
  ).toBeInTheDocument()
})

test('redirects the root URL to the landing page', async () => {
  renderAtRoute('/')
  expect(await screen.findByRole('heading', {
    name: 'Masterpiece comes with immaculate craftsmanship',
  })).toBeInTheDocument()
  expect(window.location.pathname).toBe('/home')
})

test('navigates from the landing page to service and back home', async () => {
  renderAtRoute('/home')
  fireEvent.click(screen.getByRole('link', { name: 'Service' }))
  expect(await screen.findByRole('heading', { name: 'Commissions are temporarily closed' })).toBeInTheDocument()
  fireEvent.click(screen.getByRole('link', { name: 'Back home' }))
  expect(screen.getByRole('heading', {
    name: 'Masterpiece comes with immaculate craftsmanship',
  })).toBeInTheDocument()
})

test('renders the not found page for unknown routes', async () => {
  renderAtRoute('/unknown')
  expect(await screen.findByRole('heading', { name: 'Page not found' })).toBeInTheDocument()
  expect(
    screen.getByText(/We couldn't find the page you were looking for/i)
  ).toBeInTheDocument()
  const links = screen.getAllByRole('link', { name: 'clicking here' })
  expect(links[0]).toHaveAttribute('href', '/home')
  expect(links[1]).toHaveAttribute('href', '/archive')
})

test('renders the temporarily closed service page', async () => {
  renderAtRoute('/service')
  expect(await screen.findByRole('heading', { name: 'Commissions are temporarily closed' })).toBeInTheDocument()
  expect(screen.queryByText(/Keyboard Build Service/i)).not.toBeInTheDocument()
})

test('renders the policies page with anchor navigation', async () => {
  renderAtRoute('/policies')

  expect(await screen.findByRole('heading', { name: 'Terms of Service' })).toBeInTheDocument()
  expect(screen.getByRole('heading', { name: 'Privacy Policy' })).toBeInTheDocument()
  expect(screen.getByRole('heading', { name: 'Return Policy' })).toBeInTheDocument()

  const privacyLinks = screen.getAllByRole('link', { name: 'Privacy Policy' })
  expect(privacyLinks.some((link) => link.getAttribute('href') === '#privacy-policy')).toBe(true)
})
