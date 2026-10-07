import { render, screen } from '@testing-library/react'
import { describe, expect, test, vi } from 'vitest'
import Archive from '../components/Archive/Archive'

describe('Archive', () => {
  test('renders all 19 photographs with descriptions and lazy loading', () => {
    render(<Archive />)
    const images = screen.getAllByRole('img')
    expect(images).toHaveLength(19)
    expect(new Set(images.map((image) => image.getAttribute('src'))).size).toBe(19)
    images.forEach((image) => {
      expect(image.getAttribute('alt')?.trim()).toBeTruthy()
      expect(image).toHaveAttribute('loading', 'lazy')
    })
  })

  test('renders without duplicate React keys', () => {
    const errors = vi.spyOn(console, 'error').mockImplementation(() => {})
    try {
      render(<Archive />)
      const duplicateKeys = errors.mock.calls.filter((args) =>
        args.some((arg) => String(arg).includes('same key'))
      )
      expect(duplicateKeys).toHaveLength(0)
    } finally {
      errors.mockRestore()
    }
  })
})
