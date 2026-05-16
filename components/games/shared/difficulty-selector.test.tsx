import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { DifficultySelector } from './difficulty-selector'

// Mocking the Button component if it's too complex or relies on other things,
// but usually it's fine to just render it if dependencies are available.
// However, since we want "unit" tests, mocking is safer if we just want to test DifficultySelector logic.
// In this case, I'll let it render naturally to ensure it's functional.

describe('DifficultySelector', () => {
  const mockOnChange = vi.fn()
  const options = ['Easy', 'Intermediate', 'Hard']

  it('renders all difficulty options', () => {
    render(<DifficultySelector value="Easy" onChange={mockOnChange} options={options} />)
    
    options.forEach(option => {
      expect(screen.getByText(option)).toBeDefined()
    })
  })

  it('calls onChange with the correct value when an option is clicked', () => {
    render(<DifficultySelector value="Easy" onChange={mockOnChange} options={options} />)
    
    const intermediateButton = screen.getByText('Intermediate')
    fireEvent.click(intermediateButton)
    
    expect(mockOnChange).toHaveBeenCalledWith('Intermediate')
  })

  it('highlights the selected option', () => {
    const { rerender } = render(<DifficultySelector value="Easy" onChange={mockOnChange} options={options} />)
    
    // Check if "Easy" button has specific classes (though testing classes is fragile, 
    // it confirms the logic of `value === opt`).
    // A better way is to check the variant prop if we mock the Button.
    
    const easyButton = screen.getByText('Easy')
    expect(easyButton.className).toContain('bg-primary')
    
    rerender(<DifficultySelector value="Hard" onChange={mockOnChange} options={options} />)
    
    const hardButton = screen.getByText('Hard')
    expect(hardButton.className).toContain('bg-primary')
  })
})
