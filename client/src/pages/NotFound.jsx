import { useNavigate } from 'react-router-dom';

function NotFound() {
    return (
        <div className='min-h-screen flex flex-col items-center justify-center gap-4'>
            <h1 className='text-4xl font-bold text-gray-800'>404</h1>
            <p className='text-gray-500'>Page not found</p>
            <a href="/login" className='text-blue-500 hover:underline'>Back to Login</a>
        </div>
    );
}

export default NotFound;