import { useState } from "react";
import { useNavigate ,  Link} from "react-router-dom";
import Input from "../components/input"
import ProfilePhotoSelector from "../components/ProfilePhotoSelector"
import { validateEmail } from "../util/validation";
import axiosConfig from "../util/axiosConfig";
import { API_ENDPOINTS } from "../util/apiEndpoints";
import { LoaderCircle } from "lucide-react";
import uploadProfileImage from "../util/uploadProfileImage";

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

        if(!fullname.trim()){
            setError("Please enter your name");
            setIsLoading(false);
            return;
        }
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
        console.log(fullname, email, password);
        setError("");
        try{
            if(profilePhoto){

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
            })
            if (response.status === 201){
                toast.success("Profile Created successfully.");
                //console.log("Profile Created Successfully");
                navigateFunciton("/login");
            }
        }catch(err) {
            console.error('something went wrong', err);
            setError(err.message);
        }finally{
            setIsLoading(false);
        }
    }

    return(
            <div className="h-screen w-full relative flex items-center justify-center overflow-hidden">
                
                <div className="relative z-10 w-full max-w-lg px-6">
                    <div className="bg-gradient-to-br from-blue-600 to-indigo-800 bg-opacity-95 backdrop-blur-sm rounded-lg shadow-2xl p-8">
                        <h3 className="text-2xl font-semibold text-white text-center mb-2">
                            Create an account
                        </h3>
                        <p className="text-sm text-white text-center mb-8">
                            Create an account
                        </p>
                        <form onSubmit={handleSubmit} className="space-y-4"> 
                            <div className="flex justify-center mb-6">
                                <ProfilePhotoSelector image = {profilePhoto} setImage = {setProfilePhoto}/>
                                
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
                                <Input
                                value={fullname}
                                onChange={(e) => setFullName(e.target.value)}
                                label="Full Name"
                                placeholder="Enter full name"
                                type="text"
                                />
                                <Input
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                label="Email Address"
                                placeholder="email@email.com"
                                type="text"
                                />
                                <div className="col-span-2">
                                <Input
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    label="Password"
                                    placeholder="***********"
                                    type="password"
                                    />
                                </div>

                            </div>
                            {error && (
                                <p className="text-red-800 text-sm text-center bg-red-50 p-2 rounded">
                                    {error}
                                </p>
                            )}
                            <button disabled={isLoading} className="w-full py-3 text-lg font-semibold rounded-lg bg-white text-blue-700 hover:bg-blue-50 shadow-md transition duration-200" type="submit">
                                {isLoading ? (
                                    <>
                                        <LoaderCircle className="animate-spin w-5 h-5"/>
                                        Signing up...
                                    </>
                                ) : (
                                    "SIGN UP"
                                )}
                            </button>
                            <p className="text-sm text-white text-center mt-6">
                                Already have an account?
                                <Link to="/login" className="font-medium text-blue-200 hover:text-white underline transition-colors duration-200">Login</Link>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
            
            
    )
}

export default Signup;