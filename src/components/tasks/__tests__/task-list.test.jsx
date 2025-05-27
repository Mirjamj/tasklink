import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import { TaskList } from '../task-list'

// Mock the Task component used inside TaskList to simplify the test
jest.mock('../task', () => ({
  Task: ({ task }) => <div>{task.title}</div>
}))

// Test suite for TaskList component
describe('TaskList', () => {
  it('renders a list of tasks', () => {
    const tasks = [
      { id: '1', title: 'Task One' },
      { id: '2', title: 'Task Two' },
    ]

    // Render TaskList with sample tasks and a mock completion handler
    render(<TaskList tasks={tasks} handleComplete={jest.fn()} />)

    // Assert that task titles are rendered in the document
    expect(screen.getByText('Task One')).toBeInTheDocument()
    expect(screen.getByText('Task Two')).toBeInTheDocument()
  })
})
