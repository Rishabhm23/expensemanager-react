import { useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Input from "../components/input";
import axios from "axios";
import axiosConfig from "../util/axiosConfig";
import { validateEmail } from "../util/validation";
import { API_ENDPOINTS } from "../util/apiEndpoints";
import { AppContext } from "../context/AppContext";
import { LoaderCircle, Wallet, TrendingUp, Shield } from "lucide-react";
import toast from "react-hot-toast";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const { setUser } = useContext(AppContext);
    const navigateFunciton = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        setIsLoading(true);
        if (!validateEmail(email)) {
            setError("Please enter a valid email address");
            setIsLoading(false);
            return;
        }
        if (!password.trim()) {
            setError("Please enter your password");
            setIsLoading(false);
            return;
        }

        setError("");
        try {
            const response = await axiosConfig.post(API_ENDPOINTS.LOGIN, {
                email,
                password,
            });
            const { token, user } = response.data;
            if (token) {
                localStorage.setItem("token", token);
                setUser(user);
                navigateFunciton("/dashboard");
            }
        } catch (err) {
            if (err.response && err.response.data.message) {
                console.error(err.response.data.message);
                setError(err.response.data.message);
            } else {
                console.error('something went wrong', err);
                setError(err.message);
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full bg-gradient-to-br from-purple-50 via-white to-purple-50 flex">
            {/* Left Side - Branding & Features */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-purple-600 via-purple-700 to-purple-800 p-12 flex-col justify-between relative overflow-hidden">
                {/* Decorative circles */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500 rounded-full blur-3xl opacity-20 -mr-48 -mt-48"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-900 rounded-full blur-3xl opacity-20 -ml-48 -mb-48"></div>
                
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center">
                            <Wallet className="w-7 h-7 text-purple-600" />
                        </div>
                        <h1 className="text-3xl font-bold text-white">ExpenseManager</h1>
                    </div>
                    
                    <h2 className="text-4xl font-bold text-white mb-4 leading-tight">
                        Take Control of<br />Your Finances
                    </h2>
                    <p className="text-purple-100 text-lg mb-12">
                        Track expenses, manage budgets, and achieve your financial goals with ease.
                    </p>

                    {/* Features */}
                    <div className="space-y-6">
                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 bg-purple-500 bg-opacity-30 rounded-lg flex items-center justify-center flex-shrink-0">
                                <TrendingUp className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h3 className="text-white font-semibold mb-1">Smart Analytics</h3>
                                <p className="text-purple-200 text-sm">Get insights into your spending patterns with detailed reports</p>
                            </div>
                        </div>
                        
                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 bg-purple-500 bg-opacity-30 rounded-lg flex items-center justify-center flex-shrink-0">
                                <Shield className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h3 className="text-white font-semibold mb-1">Secure & Private</h3>
                                <p className="text-purple-200 text-sm">Your financial data is encrypted and protected</p>
                            </div>
                        </div>
                    </div>
                </div>

                <p className="text-purple-200 text-sm relative z-10">
                    © 2025 ExpenseManager. All rights reserved.
                </p>
            </div>

            {/* Right Side - Login Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
                <div className="w-full max-w-md">
                    {/* Mobile Logo */}
                    <div className="lg:hidden flex items-center gap-3 mb-8 justify-center">
                        <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center">
                            <Wallet className="w-6 h-6 text-white" />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-800">ExpenseManager</h1>
                    </div>

                    <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                        <div className="mb-8">
                            <h2 className="text-3xl font-bold text-gray-800 mb-2">
                                Welcome Back
                            </h2>
                            <p className="text-gray-500">
                                Sign in to continue managing your expenses
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <Input
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                label="Email Address"
                                placeholder="you@example.com"
                                type="email"
                            />
                            <Input
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                label="Password"
                                placeholder="Enter your password"
                                type="password"
                            />

                            <div className="flex items-center justify-between text-sm">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500" />
                                    <span className="text-gray-600">Remember me</span>
                                </label>
                                <a href="#" className="text-purple-600 hover:text-purple-700 font-medium">
                                    Forgot password?
                                </a>
                            </div>

                            {error && (
                                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                                    {error}
                                </div>
                            )}

                            <button
                                disabled={isLoading}
                                className="w-full py-3 px-4 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
                                type="submit"
                            >
                                {isLoading ? (
                                    <>
                                        <LoaderCircle className="animate-spin w-5 h-5" />
                                        <span>Signing in...</span>
                                    </>
                                ) : (
                                    <span>Sign In</span>
                                )}
                            </button>
                        </form>

                        <div className="mt-6 text-center">
                            <p className="text-gray-600 text-sm">
                                Don't have an account?{" "}
                                <Link
                                    to="/signup"
                                    className="text-purple-600 hover:text-purple-700 font-semibold hover:underline transition-colors"
                                >
                                    Create Account
                                </Link>
                            </p>
                        </div>
                    </div>

                    {/* Trust Badges */}
                    <div className="mt-8 flex items-center justify-center gap-6 text-xs text-gray-400">
                        <div className="flex items-center gap-1">
                            <Shield className="w-3 h-3" />
                            <span>Secure Login</span>
                        </div>
                        <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                        <span>256-bit Encryption</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;