import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, expect, test, vi } from 'vitest'
import Policies from '../components/Policies/Policies'

afterEach(() => {
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

test('selects a policy through the sidebar when browser scrolling is unavailable', () => {
  render(<Policies />)
  fireEvent.click(screen.getByRole('link', { name: 'Privacy Policy' }))
  expect(screen.getByRole('link', { name: 'Privacy Policy' })).toHaveClass('active')
  expect(screen.getByRole('link', { name: 'Terms of Service' })).not.toHaveClass('active')
})

test('honors a policy deep link on initial render', async () => {
  window.history.replaceState({}, '', '/policies#return-policy')
  render(<Policies />)
  await waitFor(() => expect(screen.getByRole('link', { name: 'Return Policy' })).toHaveClass('active'))
})

test('ignores an unknown policy hash', () => {
  window.history.replaceState({}, '', '/policies#unknown')
  render(<Policies />)
  expect(screen.getByRole('link', { name: 'Terms of Service' })).toHaveClass('active')
})

test('updates the highlighted section from visibility and disconnects on unmount', () => {
  let onIntersect: IntersectionObserverCallback = () => {}
  const disconnect = vi.fn()
  vi.stubGlobal('IntersectionObserver', class {
    constructor(callback: IntersectionObserverCallback) { onIntersect = callback }
    observe() {}
    disconnect = disconnect
  })
  const { unmount } = render(<Policies />)
  // jsdom has no layout; supply the browser's visibility event at its boundary.
  const section = document.getElementById('privacy-policy')!
  const bounds = section.getBoundingClientRect()
  act(() => onIntersect([
    {
      target: section,
      isIntersecting: true,
      intersectionRatio: 0.8,
      boundingClientRect: bounds,
      intersectionRect: bounds,
      rootBounds: null,
      time: 0,
    },
  ], {} as IntersectionObserver))
  expect(screen.getByRole('link', { name: 'Privacy Policy' })).toHaveClass('active')
  unmount()
  expect(disconnect).toHaveBeenCalledOnce()
})
