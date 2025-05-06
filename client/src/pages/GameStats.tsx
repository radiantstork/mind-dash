import { useEffect, useState } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import customFetch from "../services/custom_fetch.ts";
import "../Charts.css"
Chart.register(...registerables);

interface ScoreData {
  date: string;
  score: number;
}

interface DistributionData {
  bin: string;
  count: number;
}

const GameStats = ({ gameName }: { gameName: string }) => {
  const [userScores, setUserScores] = useState<ScoreData[]>([]);
  const [distribution, setDistribution] = useState<DistributionData[]>([]);
  const [userScore, setUserScore] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [historyRes, distRes] = await Promise.all([
          customFetch.get<ScoreData[]>(`/api/user-score-history/?game=${gameName}`),
          customFetch.get<{ distribution: DistributionData[]; user_score?: number }>(
            `/api/score-distribution/?game=${gameName}`
          )
        ]);

        setUserScores(historyRes.data || []);
        setDistribution(distRes.data.distribution || []);
        setUserScore(distRes.data?.user_score ?? null);
      } catch (err) {
        console.error('Error fetching stats:', err);
        setError('Failed to load game statistics');
        setUserScores([]);
        setDistribution([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [gameName]);

  // Chart configuration
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: '#f8f3f3'
        }
      },
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: '#f8f3f3'
        }
      }
    }
  };

  const historyChartData = {
    labels: userScores.map(item => item.date),
    datasets: [
      {
        label: 'Your Scores',
        data: userScores.map(item => item.score),
        borderColor: 'rgb(100, 220, 220)',
        backgroundColor: 'rgba(100, 220, 220, 0.2)',
        tension: 0.4,
        fill: true,
        pointBackgroundColor: '#fff',
        pointBorderColor: 'rgb(100, 220, 220)',
        pointHoverRadius: 6
      }
    ]
  };

  const distributionChartData = {
    labels: distribution.map(item => item.bin),
    datasets: [
      {
        label: 'Players',
        data: distribution.map(item => item.count),
        backgroundColor: distribution.map(item =>
          userScore !== null && item.bin.includes(userScore.toString())
            ? 'rgba(255, 120, 150, 0.7)'
            : 'rgba(100, 220, 220, 0.7)'
        ),
        borderColor: 'rgba(255, 255, 255, 0.3)',
        borderWidth: 1
      }
    ]
  };

  const getBinStartValue = (bin: string): number => {
  if (!bin) return 0;
  const start = bin.split('-')[0];
  return parseInt(start, 10) || 0;
};

  if (loading) return (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <p>Loading statistics...</p>
    </div>
  );

  if (error) return (
    <div className="error-container">
      <p className="error-message">{error}</p>
    </div>
  );

  return (
    <div className="game-stats-container">
      <h2 className="stats-title">Game Statistics</h2>

      <div className="stats-grid">
        <div className="stat-card">
          <h3 className="stat-title">Your Score History</h3>
          <div className="chart-wrapper">
            {userScores.length > 0 ? (
              <Line
                data={historyChartData}
                options={chartOptions}
                height={300}
              />
            ) : (
              <p className="no-data">No score history available</p>
            )}
          </div>
        </div>

        <div className="stat-card">
          <h3 className="stat-title">Score Distribution</h3>
          <div className="chart-wrapper">
            {distribution.length > 0 ? (
              <Bar
                data={distributionChartData}
                options={chartOptions}
                height={300}
              />
            ) : (
              <p className="no-data">No distribution data available</p>
            )}
          </div>
        </div>

        {userScore !== null && (
          <div className="stat-card highlight-card">
            <h3 className="stat-title">Your High Score</h3>
            <div className="high-score-value">{userScore}</div>
            <p className="high-score-label">
              {userScore >= getBinStartValue(distribution[distribution.length - 1]?.bin)
  ? "🏆 Top tier performance!"
  : "Keep practicing!"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GameStats;