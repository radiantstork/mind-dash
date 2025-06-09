import { useEffect, useState } from 'react';
import { Table, Card, Progress, Spin } from 'antd';
import { useUserContext } from '../context/UserContext';
import './StatisticsPage.module.css';
import customFetch from '../services/custom_fetch';
import { catchAxiosError } from '../services/catch_axios_error';

type StatData = {
  user_avg: number | null;
  user_max: number | null;
  user_min: number | null;
  user_count: number;
  global_avg: number | null;
  global_max: number | null;
  global_min: number | null;
  global_count: number;
};

type StatType = {
  user: StatData
  global: StatData
  user_percentile: number | null;
}

const StatisticsPage = () => {
  const [stats, setStats] = useState<Record<string, StatType>>({});
  const [loading, setLoading] = useState(true);
  const { user } = useUserContext();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await customFetch.get('/api/user-statistics/');
        console.log(response.data);
        setStats(response.data);
        localStorage.setItem('userStats', JSON.stringify(response.data));
      } catch (err) {
        catchAxiosError(err);
      } finally {
        setLoading(false);
      }
    };

    const saved = localStorage.getItem('userStats');
    console.log(saved);
    if (saved) {
      setStats(JSON.parse(saved));
      setLoading(false);
    } else {
      fetchStats();
    }

  }, []);

  const columns = [
    {
      title: 'Metric',
      dataIndex: 'metric',
      key: 'metric',
    },
    {
      title: 'Your Stats',
      dataIndex: 'user',
      key: 'user',
    },
    {
      title: 'Global Average',
      dataIndex: 'global',
      key: 'global',
    },
    {
      title: 'Comparison',
      dataIndex: 'comparison',
      key: 'comparison',
      render: (percentile: number | null) => (
        percentile !== null ? (
          <div style={{ width: 200 }}>
            <Progress 
              percent={percentile} 
              format={() => `Top ${percentile}%`}
              status={percentile > 90 ? 'success' : percentile > 75 ? 'active' : 'normal'}
            />
          </div>
        ) : 'N/A'
      ),
    },
  ];

  // console.log(stats['visual-memory'].user);
  

  const dataSource = (testName: string) => [
    {
      key: 'max',
      metric: 'Highest Score',
      user: stats[testName].user.user_max || 'N/A',
      global: stats[testName].global.global_max || 'N/A',
      comparison: stats[testName].user_percentile,
    },
    {
      key: 'avg',
      metric: 'Average Score',
      user: stats[testName].user.user_avg ? Math.round(stats[testName].user.user_avg) : 'N/A',
      global: stats[testName].global.global_avg ? Math.round(stats[testName].global.global_avg) : 'N/A',
      comparison: null,
    },
    {
      key: 'count',
      metric: 'Games Played',
      user: stats[testName].user.user_count || 0,
      global: stats[testName].global.global_count || 0,
      comparison: null,
    },
  ];

  if (loading) {
    return <Spin size="large" />;
  }

  console.log(stats);
  console.log(stats["visual-memory"]);

  return (
    <div className="statistics-container">
      <h1>Your Performance Statistics</h1>
      <p className="welcome-message">
        Hello, {user.username}! Here's how you compare with other players.
      </p>

      {Object.keys(stats).map((testName) => (
        <Card 
          key={testName} 
          title={testName.replace(/_/g, ' ').toUpperCase()} 
          style={{ marginBottom: 24 }}
        >
          <Table
            dataSource={dataSource(testName)}
            columns={columns}
            pagination={false}
            bordered
          />
        </Card>
      ))}
    </div>
  );
};

export default StatisticsPage;