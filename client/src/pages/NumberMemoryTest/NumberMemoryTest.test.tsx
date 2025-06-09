import { vi, describe, it, expect, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import NumberMemoryTest from './NumberMemoryTest';
import '@testing-library/jest-dom';

// --- Mocks for external dependencies ---

// Mock child components
vi.mock('../../components/TestArea/TestArea.tsx', () => ({
  default: ({ children, onClick, clickable }: any) => (
    <div data-testid="test-area" onClick={clickable ? onClick : undefined}>
      {children}
    </div>
  ),
}));

vi.mock('../../components/IntroScreen/IntroScreen.tsx', () => ({
  default: ({ title, description }: any) => (
    <div data-testid="intro-screen">
      <h1>{title}</h1>
      <p>{description}</p>
    </div>
  ),
}));

vi.mock('../../components/ResultsScreen/ResultsScreen.tsx', () => ({
  default: ({ description, handleRestart, onGameEnd }: any) => (
    <div data-testid="results-screen">
      <p>{description}</p>
      <button onClick={handleRestart} data-testid="restart-button">Restart</button>
      <button onClick={onGameEnd} data-testid="submit-score-button">Submit Score</button>
    </div>
  ),
}));

vi.mock('../../components/Hearts/Hearts.tsx', () => ({
  default: ({ heartsLeft }: { heartsLeft: number }) => (
    <div data-testid="hearts-component">Hearts: {heartsLeft}</div>
  ),
}));

vi.mock('../../components/SubmitButton/SubmitButton.tsx', () => ({
  default: ({ onClick }: { onClick: () => void }) => (
    <button onClick={onClick} data-testid="submit-button">Submit</button>
  ),
}));

vi.mock('../../components/OtherTests/OtherTests.tsx', () => ({
  default: () => <div data-testid="other-tests-component" />,
}));

// Mock API services

const { mockCustomFetch, mockCatchAxiosError, mockUseUserContext } = vi.hoisted(() => {
  return {
    mockCustomFetch: {
      get: vi.fn(),
      post: vi.fn(),
    },
    mockCatchAxiosError: vi.fn(),
    mockUseUserContext: vi.fn()
  }
});

vi.mock('../../services/custom_fetch.ts', () => ({
  default: mockCustomFetch,
}));

vi.mock('../../services/catch_axios_error.ts', () => ({
  catchAxiosError: mockCatchAxiosError,
}));

// Mock UserContext
vi.mock('../../context/UserContext.tsx', () => ({
  useUserContext: mockUseUserContext,
}));

// No need to import SpyInstance directly; use vi.SpyInstance for typing
describe('NumberMemoryTest', () => {
  let mockMathRandom: ReturnType<typeof vi.spyOn>;;
  let mockDateNow: ReturnType<typeof vi.spyOn>;;

  beforeEach(() => {
    // Enable fake timers to control setTimeout
    vi.useFakeTimers();
    // Clear all mocks before each test
    vi.clearAllMocks();

    // Mock Math.random for deterministic number generation
    mockMathRandom = vi.spyOn(Math, 'random')
      .mockReturnValue(0.5); // Always returns '5' for single digit, or '555...' for longer

    // Mock Date.now() for `created_at` in handleGameEnd
    mockDateNow = vi.spyOn(Date, 'now');

    // Default authenticated state for context
    mockUseUserContext.mockReturnValue({
      user: { isAuthenticated: true, id: 'user123', username: 'testuser' },
    });
  });

  afterEach(() => {
    // Restore real timers after each test
    vi.runOnlyPendingTimers(); // Ensure all pending timers are run
    vi.useRealTimers();
    // Restore original Math.random and Date.now()
    mockMathRandom.mockRestore();
    mockDateNow.mockRestore();
  });

  // --- 1. Initial Render (idle status) ---
  it('renders IntroScreen in idle state initially', () => {
    render(<NumberMemoryTest />);
    expect(screen.getByTestId('intro-screen')).toBeInTheDocument();
    expect(screen.getByText('Number Memory Test')).toBeInTheDocument();
    expect(screen.getByText('What is the longest number that you can remember?')).toBeInTheDocument();
    expect(screen.getByTestId('test-area')).toBeInTheDocument(); // TestArea should be clickable
    expect(screen.queryByText(/What was the number\?/i)).not.toBeInTheDocument();
    expect(screen.queryByTestId('results-screen')).not.toBeInTheDocument();
  });
});