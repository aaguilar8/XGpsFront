import { Navigate } from "react-router-dom";

const PrivateRoute = ({children}) => {

    function isLoged(){
        const token=window.localStorage.getItem('token');
        return token ? true : false;
    }

    return (isLoged())
        ? children
        : <Navigate to='/'/>
}

export default PrivateRoute;