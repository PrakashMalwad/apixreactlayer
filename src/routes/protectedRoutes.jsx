import { Navigate } from "react-router-dom";
import PropTypes from "prop-types";

function ProtectedRoute({ children }) {
  const isLoggedIn = !!localStorage.getItem("token"); // Ensure consistent storage

  // Redirect to login if the user is not authenticated
  return isLoggedIn ? children : <Navigate to="/" replace />;
}

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired, // Fix: Allow React elements, not just strings
};

export default ProtectedRoute;
