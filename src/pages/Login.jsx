import Form from "../components/Form"
import { Link } from "react-router-dom"

function Login() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
                <h1 className="text-3xl font-bold text-center text-gray-800">Login to Store</h1>
                <Form route="/api/token/" method="login" />
                <div className="text-center mt-4">
                    <p className="text-gray-600">
                        Don't have an account?{" "}
                        <Link to="/register" className="text-blue-500 hover:text-blue-700">
                            Register
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Login