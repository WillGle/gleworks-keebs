import { render, screen } from '@testing-library/react'
import { expect, test } from 'vitest'
import Footer from '../components/Footer'

test('keeps the newsletter placeholder and contact information', () => {
  render(<Footer />)
  expect(screen.getByPlaceholderText('Email')).toHaveAttribute('type', 'email')
  expect(screen.getByText('hello.gleworks@gmail.com')).toBeInTheDocument()
})

test('links each policy to its section', () => {
  render(<Footer />)
  for (const [name, hash] of [
    ['Terms of Service', 'term-of-service'],
    ['Privacy Policy', 'privacy-policy'],
    ['Return Policy', 'return-policy'],
  ]) {
    expect(screen.getByRole('link', { name })).toHaveAttribute('href', `/policies#${hash}`)
  }
})

test('opens social profiles without granting access to the original window', () => {
  const { container } = render(<Footer />)
  const links = container.querySelectorAll('a[target="_blank"]')
  expect(links).toHaveLength(2)
  links.forEach((link) => expect(link).toHaveAttribute('rel', 'noopener noreferrer'))
})
