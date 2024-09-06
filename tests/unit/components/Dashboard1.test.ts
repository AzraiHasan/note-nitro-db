// tests/components/Dashboard.test.ts
import { describe, it, expect, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import Dashboard from '@/components/Dashboard.vue'
import { useNotesStore } from '@/stores/notes'

describe('Dashboard Component', () => {
  it('renders correctly', () => {
    const wrapper = mount(Dashboard, {
      global: {
        plugins: [createTestingPinia({
          createSpy: vi.fn,
          initialState: {
            notes: {
              notes: [
                { id: '1', title: 'Test Note', content: 'Test Content', status: 'Draft' },
              ],
            },
          },
        })],
        stubs: ['UCard', 'UButton', 'UInput', 'USelect', 'UTable', 'UBadge', 'ULink', 'StatusHandler'],
      },
    })

    expect(wrapper.find('h1').text()).toBe('Notes Dashboard')
    expect(wrapper.findAll('UCard')).toHaveLength(2)
  })

  it('filters notes correctly', async () => {
    const wrapper = mount(Dashboard, {
      global: {
        plugins: [createTestingPinia({
          createSpy: vi.fn,
          initialState: {
            notes: {
              notes: [
                { id: '1', title: 'Test Note 1', content: 'Test Content 1', status: 'Draft' },
                { id: '2', title: 'Test Note 2', content: 'Test Content 2', status: 'Completed' },
              ],
            },
          },
        })],
        stubs: ['UCard', 'UButton', 'UInput', 'USelect', 'UTable', 'UBadge', 'ULink', 'StatusHandler'],
      },
    })

    const store = useNotesStore()

    // Test searching
    await wrapper.find('input[placeholder="Search notes..."]').setValue('Test Note 1')
    await flushPromises()
    expect(wrapper.findAll('UTable-stub tr')).toHaveLength(1)
    expect(wrapper.find('UTable-stub').text()).toContain('Test Note 1')

    // Test status filtering
    await wrapper.find('select').setValue('Completed')
    await flushPromises()
    expect(wrapper.findAll('UTable-stub tr')).toHaveLength(1)
    expect(wrapper.find('UTable-stub').text()).toContain('Test Note 2')
  })

  // Add more tests for sorting, navigation, etc.
})