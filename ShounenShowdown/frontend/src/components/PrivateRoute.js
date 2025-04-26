import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const PrivateRoute = ({ element }) => {
    const { user, loading  } = useAuth();

    if (loading) {
        return <div>Loading...</div>;
    }

    return user ? element : <Navigate to="/login" />;
};

export default PrivateRoute;