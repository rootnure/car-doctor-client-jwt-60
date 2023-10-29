import PropTypes from 'prop-types';
import { AuthContext } from '../providers/AuthProvider';
import { Navigate, useLocation } from 'react-router-dom';
import { useContext } from 'react';


const PrivateRoute = ({ children }) => {
    const { user, loading } = useContext(AuthContext);
    const location = useLocation();

    if (loading) {
        return <span className="loading loading-bars loading-lg"></span>;
    }

    if (user?.email) {
        return children;
    }

    return <Navigate to="/login" state={location.pathname} replace></Navigate>

};

PrivateRoute.propTypes = {
    children: PropTypes.node.isRequired
}

export default PrivateRoute;