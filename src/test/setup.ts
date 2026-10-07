// Shared cleanup so each test starts with empty browser storage and mocks.
import '@testing-library/jest-dom'
import { cleanup } from '@testing-library/react'
import { afterEach, vi } from 'vitest'

afterEach(() => {
  cleanup()
  localStorage.clear()
  sessionStorage.clear()
  vi.clearAllMocks()
  window.history.replaceState({}, '', '/')
})
