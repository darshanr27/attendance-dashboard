import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../api/auth.api';
import toast from 'react-hot-toast';

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await loginUser(email, password);
            const { role } = res.data;
            toast.success('Login successful');
            if (role === 'admin') navigate('/admin');
            else navigate('/employee');
        } catch(err) {
            toast.error(err.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className='min-h-screen flex items-center justify-center bg-gray-100'>
            <div className='bg-white p-8 rounded-x1 shadow-md w-full max-w-sm'>
                <h1 className='text-2x1 font-bold text-center md-6 text-gray-800'>
                    Attendance Portal
                </h1>
                <form onSubmit={handleLogin} className="flex flex-col gap-4">
                    <input
                        type="email" 
                        placeholder='Email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className='border rounded-1g px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400'
                        required
                    />
                    <input
                        type="password"
                        placeholder='Password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        required
                    />
                    <button
                        type='submit'
                        disabled={loading}
                        className='bg-blue-600 text-white py-2 rounded-lg hover:bg=blue-700 transition disabled:opacity-50'
                    >
                        {loading ? 'Logging in...':'Login'}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default LoginPage;