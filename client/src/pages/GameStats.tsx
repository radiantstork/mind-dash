import { useEffect, useState } from 'react';
import axios from 'axios';
import { Line, Bar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

interface ScoreData {
  date: string;
  score: number;
}

interface DistributionData {
  bin: string;
  count: number;
}

// interface ApiResponse {
//   data: ScoreData[] | DistributionData[];
//   user_score?: number;
// }

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
          axios.get<ScoreData[]>(`http://localhost:8000/api/${gameName}/user-score-history/`),
          axios.get<{ distribution: DistributionData[]; user_score?: number }>(
            `http://localhost:8000/api/${gameName}/score-distribution/`
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

  if (loading) return <div>Loading statistics...</div>;
  if (error) return <div className="error-message">{error}</div>;

  const historyChartData = {
    labels: userScores.map(item => item.date),
    datasets: [
      {
        label: 'Your Scores',
        data: userScores.map(item => item.score),
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
        fill: false
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
            ? 'rgba(255, 99, 132, 0.7)'
            : 'rgba(54, 162, 235, 0.7)'
        ),
      }
    ]
  };

  return (
    <div className="stats-container">
      <div className="chart-container">
        <h3>Your Score History</h3>
        {userScores.length > 0 ? (
          <Line data={historyChartData} />
        ) : (
          <p>No score history available</p>
        )}
      </div>
      <div className="chart-container">
        <h3>Score Distribution</h3>
        {distribution.length > 0 ? (
          <Bar data={distributionChartData} />
        ) : (
          <p>No distribution data available</p>
        )}
      </div>
    </div>
  );
};

export default GameStats;