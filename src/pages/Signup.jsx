import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Input from "../components/input";
import ProfilePhotoSelector from "../components/ProfilePhotoSelector";
import { validateEmail } from "../util/validation";
import axiosConfig from "../util/axiosConfig";
import { API_ENDPOINTS } from "../util/apiEndpoints";
import { LoaderCircle, Wallet, PieChart, Bell, Lock } from "lucide-react";
import uploadProfileImage from "../util/uploadProfileImage";
import toast from "react-hot-toast";

const Signup = () => {
    const [fullname, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const navigateFunciton = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [profilePhoto, setProfilePhoto] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        let profileImageUrl = "";
        setIsLoading(true);

        if (!fullname.trim()) {
            setError("Please enter your name");
            setIsLoading(false);
            return;
        }
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
        console.log(fullname, email, password);
        setError("");
        try {
            if (profilePhoto) {
                const imageUrl = await uploadProfileImage(profilePhoto);
                profileImageUrl = imageUrl || "";
            }
            console.log("profileImageUrl");
            console.log(profileImageUrl);
            const response = await axiosConfig.post(API_ENDPOINTS.REGISTERL, {
                fullname,
                email,
                password,
                profileImageUrl
            });
            if (response.status === 201) {
                toast.success("Profile Created successfully.");
                navigateFunciton("/login");
            }
        } catch (err) {
            console.error('something went wrong', err);
            setError(err.message);
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
                        Start Your Financial<br />Journey Today
                    </h2>
                    <p className="text-purple-100 text-lg mb-12">
                        Join thousands of users who are taking control of their finances with smart expense tracking.
                    </p>

                    {/* Features */}
                    <div className="space-y-6">
                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 bg-purple-500 bg-opacity-30 rounded-lg flex items-center justify-center flex-shrink-0">
                                <PieChart className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h3 className="text-white font-semibold mb-1">Visual Reports</h3>
                                <p className="text-purple-200 text-sm">Beautiful charts and graphs to understand your spending</p>
                            </div>
                        </div>
                        
                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 bg-purple-500 bg-opacity-30 rounded-lg flex items-center justify-center flex-shrink-0">
                                <Bell className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h3 className="text-white font-semibold mb-1">Smart Reminders</h3>
                                <p className="text-purple-200 text-sm">Never miss a bill or budget limit again</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 bg-purple-500 bg-opacity-30 rounded-lg flex items-center justify-center flex-shrink-0">
                                <Lock className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h3 className="text-white font-semibold mb-1">Bank-Level Security</h3>
                                <p className="text-purple-200 text-sm">Your data is protected with industry-standard encryption</p>
                            </div>
                        </div>
                    </div>
                </div>

                <p className="text-purple-200 text-sm relative z-10">
                    © 2025 ExpenseManager. All rights reserved.
                </p>
            </div>

            {/* Right Side - Signup Form */}
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
                                Create Account
                            </h2>
                            <p className="text-gray-500">
                                Start managing your expenses in minutes
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Profile Photo Selector */}
                            <div className="flex justify-center mb-2">
                                <ProfilePhotoSelector image={profilePhoto} setImage={setProfilePhoto} />
                            </div>

                            {/* Form Fields */}
                            <Input
                                value={fullname}
                                onChange={(e) => setFullName(e.target.value)}
                                label="Full Name"
                                placeholder="John Doe"
                                type="text"
                            />
                            
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
                                placeholder="Create a strong password"
                                type="password"
                            />

                            {/* Terms and Conditions */}
                            <div className="flex items-start gap-2 text-sm">
                                <input 
                                    type="checkbox" 
                                    id="terms" 
                                    className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500 mt-0.5" 
                                    required
                                />
                                <label htmlFor="terms" className="text-gray-600">
                                    I agree to the{" "}
                                    <a href="#" className="text-purple-600 hover:text-purple-700 font-medium">
                                        Terms of Service
                                    </a>{" "}
                                    and{" "}
                                    <a href="#" className="text-purple-600 hover:text-purple-700 font-medium">
                                        Privacy Policy
                                    </a>
                                </label>
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
                                        <span>Creating Account...</span>
                                    </>
                                ) : (
                                    <span>Create Account</span>
                                )}
                            </button>
                        </form>

                        <div className="mt-6 text-center">
                            <p className="text-gray-600 text-sm">
                                Already have an account?{" "}
                                <Link
                                    to="/login"
                                    className="text-purple-600 hover:text-purple-700 font-semibold hover:underline transition-colors"
                                >
                                    Sign In
                                </Link>
                            </p>
                        </div>
                    </div>

                    {/* Trust Badge */}
                    <div className="mt-8 text-center">
                        <p className="text-xs text-gray-400">
                            By signing up, you'll have access to all features instantly
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signup;