import { vi, describe, it, expect, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import TimePerceptionTest from './TimePerceptionTest';
import '@testing-library/jest-dom';

// Mocks for dependencies

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

// Mock child components and services
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
      <button onClick={onGameEnd} data-testid="game-end-button">Submit Score</button>
    </div>
  ),
}));

vi.mock('../../components/OtherTests/OtherTests.tsx', () => ({
  default: () => <div data-testid="other-tests-component" />,
}));

vi.mock('../../services/catch_axios_error.ts', () => ({
  catchAxiosError: mockCatchAxiosError,
}));

vi.mock('../../services/custom_fetch.ts', () => ({
  default: mockCustomFetch,
}));

vi.mock('../../context/UserContext.tsx', () => ({
  useUserContext: mockUseUserContext,
}));


describe('TimePerceptionTest', () => {
  let mockDateNow: ReturnType<typeof vi.spyOn>;
  let mockMathRandom: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    vi.clearAllMocks();
    // Mock Date.now() for deterministic time calculations
    mockDateNow = vi.spyOn(Date, 'now');
    // Mock Math.random() for deterministic waitTime
    mockMathRandom = vi.spyOn(Math, 'random');

    // Default authenticated state for context
    mockUseUserContext.mockReturnValue({
      user: { isAuthenticated: true, id: '123', username: 'testuser' },
    });
  });

  afterEach(() => {
    mockDateNow.mockRestore();
    mockMathRandom.mockRestore();
  });

  // --- Initial Render ---
  it('renders IntroScreen in idle state initially', () => {
    render(<TimePerceptionTest />);
    expect(screen.getByTestId('intro-screen')).toBeInTheDocument();
    expect(screen.getByText('Time Perception Test')).toBeInTheDocument();
    expect(screen.getByText('How accurately can you estimate time without a watch?')).toBeInTheDocument();
    expect(screen.queryByTestId('results-screen')).not.toBeInTheDocument();
    expect(screen.queryByText(/seconds/i)).not.toBeInTheDocument();
  });

  // --- Start Test (Idle -> Running) ---
  it('transitions to running state on first click and displays wait time', async () => {
    mockMathRandom.mockReturnValue(0.5); // (0.5 * 6) + 5 = 3 + 5 = 8 seconds
    mockDateNow.mockReturnValue(10000); // Set an initial time

    render(<TimePerceptionTest />);
    
    const testArea = screen.getByTestId('test-area');
    fireEvent.click(testArea);

    await waitFor(() => {
      expect(screen.queryByTestId('intro-screen')).not.toBeInTheDocument();
      expect(screen.getByText('8 seconds')).toBeInTheDocument();
      expect(screen.getByText('Click when the time is up')).toBeInTheDocument();
    });
  });

  // --- End Test (Running -> Over) ---
  it('transitions to over state on second click and displays results', async () => {
    let now = 10000;
    mockDateNow.mockImplementation(() => now);
    
    render(<TimePerceptionTest />);
    const testArea = screen.getByTestId('test-area');
    
    fireEvent.click(testArea); // Start
    
    now = 18500;

    fireEvent.click(testArea); // End test

    await waitFor(() => {
      expect(screen.queryByText('8 seconds')).not.toBeInTheDocument();
      expect(screen.getByTestId('results-screen')).toBeInTheDocument();
      expect(screen.getByText(/You estimated: 8.50 seconds/i)).toBeInTheDocument();
    });
  });

  // --- Restart Test ---
  it('restarts the test when restart button is clicked', async () => {
    mockMathRandom.mockReturnValue(0.5); // waitTime = 8 seconds
    mockDateNow.mockReturnValueOnce(10000); // Start time
    mockDateNow.mockReturnValueOnce(18500); // End time

    render(<TimePerceptionTest />);
    const testArea = screen.getByTestId('test-area');

    fireEvent.click(testArea); // Start
    fireEvent.click(testArea); // End

    // Ensure we are in results screen
    await waitFor(() => {
      expect(screen.getByTestId('results-screen')).toBeInTheDocument();
    });

    const restartButton = screen.getByTestId('restart-button');
    fireEvent.click(restartButton);

    await waitFor(() => {
      expect(screen.getByTestId('intro-screen')).toBeInTheDocument();
      expect(screen.queryByTestId('results-screen')).not.toBeInTheDocument();
    });
  });

  // --- handleGameEnd: Authenticated User ---
it('restarts the test when restart button is clicked', async () => {
    mockDateNow.mockReturnValueOnce(1); // Buffer 1
    mockMathRandom.mockReturnValue(0.5); // waitTime = 8 seconds
    mockDateNow.mockReturnValueOnce(10000); // 1st critical: Start time
    mockDateNow.mockReturnValueOnce(18500); // 2nd critical: End time

    render(<TimePerceptionTest />);
    const testArea = screen.getByTestId('test-area');

    fireEvent.click(testArea); // Start (consumes 1st critical mock)
    fireEvent.click(testArea); // End (consumes 2nd critical mock)

    await waitFor(() => {
      expect(screen.getByTestId('results-screen')).toBeInTheDocument();
    });

    const restartButton = screen.getByTestId('restart-button');
    fireEvent.click(restartButton);

    await waitFor(() => {
      expect(screen.getByTestId('intro-screen')).toBeInTheDocument();
      expect(screen.queryByTestId('results-screen')).not.toBeInTheDocument();
    });
  });

  // --- handleGameEnd: Unauthenticated User ---
  it('does NOT call customFetch.post when unauthenticated and game ends', async () => {
    mockUseUserContext.mockReturnValue({
      user: { isAuthenticated: false },
    });
    mockMathRandom.mockReturnValue(0.5); // waitTime = 8 seconds
    mockDateNow.mockReturnValueOnce(10000); // Start time
    mockDateNow.mockReturnValueOnce(18500); // End time

    render(<TimePerceptionTest />);
    const testArea = screen.getByTestId('test-area');

    fireEvent.click(testArea); // Start
    fireEvent.click(testArea); // End

    await waitFor(() => {
      expect(screen.getByTestId('results-screen')).toBeInTheDocument();
    });

    const submitButton = screen.getByTestId('game-end-button');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockCustomFetch.post).not.toHaveBeenCalled();
      expect(mockCatchAxiosError).not.toHaveBeenCalled();
    });
  });

  // --- handleGameEnd: Error Handling ---
  it('calls catchAxiosError if customFetch.post fails', async () => {
    mockUseUserContext.mockReturnValue({
      user: { isAuthenticated: true, id: '123', username: 'testuser' },
    });
    const mockError = new Error('Network error');
    mockCustomFetch.post.mockRejectedValue(mockError);
    mockMathRandom.mockReturnValue(0.5); // waitTime = 8 seconds
    mockDateNow.mockReturnValueOnce(10000); // Start time
    mockDateNow.mockReturnValueOnce(18500); // End time

    render(<TimePerceptionTest />);
    const testArea = screen.getByTestId('test-area');

    fireEvent.click(testArea); // Start
    fireEvent.click(testArea); // End

    await waitFor(() => {
      expect(screen.getByTestId('results-screen')).toBeInTheDocument();
    });

    const submitButton = screen.getByTestId('game-end-button');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockCustomFetch.post).toHaveBeenCalledTimes(1);
      expect(mockCatchAxiosError).toHaveBeenCalledTimes(1);
      expect(mockCatchAxiosError).toHaveBeenCalledWith(mockError);
    });
  });
});