// src/components/common/ProtectedRoute.jsx
export default function ProtectedRoute({ children }) {
    // Auth removed: always allow in local/dev mode
    return children;
}
