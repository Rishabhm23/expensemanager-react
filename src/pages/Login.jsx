import { useContext, useState } from "react";
import { useNavigate ,  Link} from "react-router-dom";
import Input from "../components/input"
import axios from "axios";
import axiosConfig from "../util/axiosConfig";
import { validateEmail } from "../util/validation";
import { API_ENDPOINTS } from "../util/apiEndpoints";
import { AppContext } from "../context/AppContext";
import { LoaderCircle } from "lucide-react";

const Login = () => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const {setUser} = useContext(AppContext);
    const navigateFunciton = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        setIsLoading(true);
        if(!validateEmail(email)){
            setError("Please enter a valid email address");
            setIsLoading(false);
            return;
        }
        if(!password.trim()){
            setError("Please enter your password");
            setIsLoading(false);
            return;
        }

        setError("");
        try{
            const response = await axiosConfig.post(API_ENDPOINTS.LOGIN, {
                email,
                password,
            });
            const {token, user} = response.data;
            if(token){
                localStorage.setItem("token",token);
                setUser(user);
                navigateFunciton("/dashboard");
            }
        }catch(err){
            if(err.response && err.response.data.message){
                console.error(err.response.data.message);
                setError(err.response.data.message);
            }else{
            console.error('something went wrong', err);
            setError(err.message);}
        }finally{
            setIsLoading(false);
        }
    }

    return(
            <div className="h-screen w-full relative flex items-center justify-center overflow-hidden">
                
                <div className="relative z-10 w-full max-w-lg px-6">
                    <div className="bg-gradient-to-br from-blue-600 to-indigo-800 bg-opacity-95 backdrop-blur-sm rounded-lg shadow-2xl p-8">
                        <h3 className="text-2xl font-semibold text-white text-center mb-2">
                            Welcome Back
                        </h3>
                        <p className="text-sm text-white text-center mb-8">
                            Please enter your email to login
                        </p>
                            
                        <form onSubmit={handleSubmit} className="space-y-4">
                            
                            <Input
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            label="Email Address"
                            placeholder="email@email.com"
                            type="text"
                            />
                            <Input
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                label="Password"
                                placeholder="***********"
                                type="password"
                            />
                            {error && (
                                <p className="text-red-800 text-sm text-center bg-red-50 p-2 rounded">
                                    {error}
                                </p>
                            )}
                            <button disabled={isLoading} className="w-full py-3 text-lg font-semibold rounded-lg bg-white text-blue-700 hover:bg-blue-50 shadow-md transition duration-200" type="submit">
                                {isLoading ? (
                                    <>
                                        <LoaderCircle className="animate-spin w-5 h-5"/>
                                        Logging up...
                                    </>
                                ):(
                                    "LOGIN"
                                )}
                            </button>
                            <p className="text-sm text-white text-center mt-6">
                                Don't have an account?
                                <Link to="/signup" className="font-medium text-blue-200 hover:text-white underline transition-colors duration-200">SignUp</Link>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
            
            
    )
}

export default Login;