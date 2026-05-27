import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllRecords } from '../api/attendance.api';
import { logoutUser } from '../api/auth.api';
import axiosInstance from '../api/axiosInstance';
import toast from 'react-hot-toast';
import Spinner from '../components/Spinner';

function AdminDashboard() {
  const [user, setUser] = useState(null);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ date: '', user_id: '' });
  const [employees, setEmployees] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInitial = async () => {
      try {
        const [userRes, recordsRes, empRes] = await Promise.all([
          axiosInstance.get('/auth/me'),
          getAllRecords(),
          axiosInstance.get('/admin/employees')
        ]);
        setUser(userRes.data);
        setRecords(recordsRes.data);
        setEmployees(empRes.data);
      } catch (err) {
        toast.error('Failed to load data');
      } finally {
        setLoading(false);
      }
    };
    fetchInitial();
  }, []);

  const handleFilter = async () => {
    try {
      const activeFilters = {};
      if (filters.date) activeFilters.date = filters.date;
      if (filters.user_id) activeFilters.user_id = filters.user_id;
      const res = await getAllRecords(activeFilters);
      setRecords(res.data);
    } catch (err) {
      toast.error('Failed to filter records');
    }
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      navigate('/login');
    } catch (err) {
      toast.error('Logout failed');
    }
  };

  if (loading) return <Spinner />

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Admin Dashboard — {user?.name}
          </h1>
          <button
            onClick={handleLogout}
            className="text-sm text-red-500 hover:underline"
          >
            Logout
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-6 flex gap-4 items-end flex-wrap">
          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-600 font-medium">Date</label>
            <input
              type="date"
              value={filters.date}
              onChange={(e) => setFilters({ ...filters, date: e.target.value })}
              className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-600 font-medium">Employee</label>
            <select
              value={filters.user_id}
              onChange={(e) => setFilters({ ...filters, user_id: e.target.value })}
              className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="">All Employees</option>
              {employees.map(emp => (
                <option key={emp.id} value={emp.id}>{emp.name}</option>
              ))}
            </select>
          </div>
          <button
            onClick={handleFilter}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition"
          >
            Apply Filter
          </button>
          <button
            onClick={() => {
              setFilters({ date: '', user_id: '' });
              getAllRecords().then(res => setRecords(res.data));
            }}
            className="text-sm text-gray-500 hover:underline"
          >
            Clear
          </button>
        </div>

        {/* Records */}
        <div className="bg-white rounded-xl shadow-md overflow-x-auto">
          {records.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No records found</p>
          ) : (
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-600 uppercase text-xs">
                  <th className="px-4 py-3 text-left">Employee</th>
                  <th className="px-4 py-3 text-left">Date</th>
                  <th className="px-4 py-3 text-left">Login</th>
                  <th className="px-4 py-3 text-left">Logout</th>
                  <th className="px-4 py-3 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {records.map(rec => (
                  <tr
                    key={rec.id}
                    style={{ backgroundColor: rec.status === 'on_time' ? '#f0fdf4' : '#fff1f2' }}
                  >
                    <td className="px-4 py-2 font-medium text-gray-800">{rec.name}</td>
                    <td className="px-4 py-2 text-gray-600">{new Date(rec.date).toLocaleDateString('en-IN')}</td>
                    <td className="px-4 py-2 text-gray-600">{new Date(rec.login_time).toLocaleTimeString()}</td>
                    <td className="px-4 py-2 text-gray-600">{rec.logout_time ? new Date(rec.logout_time).toLocaleTimeString() : '—'}</td>
                    <td className="px-4 py-2">
                      <span
                        style={{ backgroundColor: rec.status === 'on_time' ? '#16a34a' : '#dc2626' }}
                        className="px-2 py-1 rounded-full text-xs font-semibold text-white"
                      >
                        {rec.status === 'on_time' ? 'On Time' : 'Late'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

      </div>
    </div>
  );
}

export default AdminDashboard;