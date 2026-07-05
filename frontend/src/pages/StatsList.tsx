import React, { useEffect, useState } from 'react';
import { getStats, deleteStat } from '../api/client';
import { useNavigate } from 'react-router-dom';

interface Stat {
  id: number;
  name: string;
  value: number;
  description: string;
  createdAt: string;
  updatedAt: string;
}

const StatsList: React.FC = () => {
  const [stats, setStats] = useState<Stat[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getStats();
        setStats(response);
      } catch (err) {
        setError('Failed to fetch stats.');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const handleDelete = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      await deleteStat(id);
      setStats((prevStats) => prevStats.filter((stat) => stat.id !== id));
    } catch (err) {
      setError('Failed to delete stat.');
    } finally {
      setLoading(false);
    }
  };

  const filteredStats = stats.filter((stat) =>
    stat.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Stats</h1>
        <button
          onClick={() => navigate('/stats/new')}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add New
        </button>
      </div>
      <input
        type="text"
        placeholder="Search stats..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-4 p-2 border border-gray-300 rounded w-full"
      />
      {loading && <div className="text-center">Loading...</div>}
      {error && <div className="text-red-500 text-center">{error}</div>}
      <table className="table-auto w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 px-4 py-2">ID</th>
            <th className="border border-gray-300 px-4 py-2">Name</th>
            <th className="border border-gray-300 px-4 py-2">Value</th>
            <th className="border border-gray-300 px-4 py-2">Description</th>
            <th className="border border-gray-300 px-4 py-2">Created At</th>
            <th className="border border-gray-300 px-4 py-2">Updated At</th>
            <th className="border border-gray-300 px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredStats.map((stat) => (
            <tr key={stat.id}>
              <td className="border border-gray-300 px-4 py-2">{stat.id}</td>
              <td className="border border-gray-300 px-4 py-2">{stat.name}</td>
              <td className="border border-gray-300 px-4 py-2">{stat.value}</td>
              <td className="border border-gray-300 px-4 py-2">{stat.description}</td>
              <td className="border border-gray-300 px-4 py-2">{new Date(stat.createdAt).toLocaleString()}</td>
              <td className="border border-gray-300 px-4 py-2">{new Date(stat.updatedAt).toLocaleString()}</td>
              <td className="border border-gray-300 px-4 py-2">
                <button
                  onClick={() => navigate(`/stats/edit/${stat.id}`)}
                  className="bg-yellow-500 text-white px-2 py-1 rounded mr-2 hover:bg-yellow-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(stat.id)}
                  className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StatsList;