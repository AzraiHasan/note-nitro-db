// tests/unit/components/Dashboard.test.ts
import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
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
                { id: '1', title: 'Test Note', status: 'Draft', updatedAt: new Date() }
              ]
            }
          }
        })]
      }
    })

    expect(wrapper.find('h1').text()).toBe('Notes Dashboard')
    expect(wrapper.findAll('UCard').length).toBeGreaterThan(0)
  })

  it('filters notes correctly', async () => {
    const wrapper = mount(Dashboard, {
      global: {
        plugins: [createTestingPinia({
          createSpy: vi.fn,
          initialState: {
            notes: {
              notes: [
                { id: '1', title: 'Draft Note', status: 'Draft', updatedAt: new Date() },
                { id: '2', title: 'In Progress Note', status: 'In Progress', updatedAt: new Date() }
              ]
            }
          }
        })]
      }
    })

    const store = useNotesStore()

    await wrapper.find('select').setValue('Draft')
    expect(wrapper.findAll('UTable tbody tr').length).toBe(1)

    await wrapper.find('select').setValue('All')
    expect(wrapper.findAll('UTable tbody tr').length).toBe(2)
  })
})