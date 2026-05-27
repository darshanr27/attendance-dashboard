import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { punchIn, punchOut, getMyRecord } from '../api/attendance.api';
import { logoutUser } from '../api/auth.api';
import axiosInstance from '../api/axiosInstance';
import toast from 'react-hot-toast';
import Spinner from  '../components/Spinner';

function EmployeeDashboard() {
    const [user, setUser] = useState(null);
    const [record, setRecord] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [userRes, recordRes] = await Promise.all([
                    axiosInstance.get('/auth/me'),
                    getMyRecord()
                ]);
                setUser(userRes.data);
                setRecord(recordRes.data);
            } catch (error) {
                toast.error('Failed to load data');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handlePunchIn = async () => {
        try {
            const res = await punchIn();
            setRecord(res.data);
            toast.success('Punched in successfully');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Punch in failed');
        }
    };

    const handlePunchOut = async () => {
        try {
            const res = await punchOut();
            setRecord(res.data);
            toast.success('Punched out successfully');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Punch out failed');
        }
    };

    const handleLogout = async () => {
        try {
            await logoutUser();
            navigate('/login');
        } catch (error) {
            toast.error('Logout failed');
        }
    };


    if (loading) return <Spinner />

    return (
        <div className='min-h-screen bg-gray-100 p-6'>
            <div className='max-w-md mx-auto'>

                {/* Header */}
                <div className='flex items-center justify-between mb-6'>
                    <h1 className='text-2xl font-bold text-gray-800'>
                        Welcome, {user?.name}
                    </h1>
                    <button
                        onClick={handleLogout}
                        className='text-sm text-red-500 hover:underline'
                    >
                        Logout
                    </button>
                </div>

                {/* Attendance Card*/}
                <div className='bh-white rounded-xl shadow-md p-6 flex flex-col gap-4'>
                    {record ? (
                        <>
                            {/* Status Badge */}
                            <div className={`text-center py-2 rounded-lg font-semibold text-white ${record.status === 'on_time' ? 'bg-green-500' : 'bg-red-500'}`}>
                                {record.status === 'on_time' ? '🟢 On Time' : '🔴 Late'}
                            </div>

                            {/* Login Time */}
                            <div className='text-gray-600 text-sm'>
                                <span className='font-semibold'>Logged in at:</span>
                                {new Date(record.login_time).toLocaleTimeString()}
                            </div>

                            {/* Logout Time or Punch Out Button */}
                            {record.logout_time ? (
                                <div className='text-gray-600 text-sm'>
                                    <span className='font-semibold'>Logged out at: </span>
                                    {new Date(record.logout_time).toLocaleTimeString()}
                                </div>
                            ): (
                                <button
                                    onClick={handlePunchOut}
                                    className='bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition'
                                >
                                    Punch Out
                                </button>
                            )}
                        </>
                    ) : (
                        <>
                            <p className='text-gray-500 text-center'>You have not punched in today.</p>
                            <button
                                onClick={handlePunchIn}
                                className='bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition'
                            >
                                Punch In
                            </button>
                        </>
                    )}
                </div>

            </div>
        </div>
    )
}

export default EmployeeDashboard;