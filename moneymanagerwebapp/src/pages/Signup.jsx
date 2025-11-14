import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import Input from "../components/Input";
import axiosConfig from "../Util/axiosConfig";
import { API_ENDPOINTS } from "../Util/apiEndpoints";
import { LoaderCircle } from "lucide-react";
import ProfilePhotoSelector from "../components/ProfilePhotoSelector";
import uploadProfileImage from "../Util/uploadProfileImage";
import { validateEmail } from "../Util/validation";
import { toast } from "react-toastify";

const Signup = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isloading, setIsLoading] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState(null);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    let profileImageUrl = "";

    // Validations
    if (!fullName.trim()) {
      setError("Please enter your Full Name");
      setIsLoading(false);
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid Emaiol address");
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
      // Upload image if selected
      if (profilePhoto) {
        const imageUrl = await uploadProfileImage(profilePhoto);
        profileImageUrl = imageUrl || "";
      }

      // Send API Request
      const response = await axiosConfig.post(API_ENDPOINTS.REGISTER, {
        fullName,
        email: email.toLowerCase(),
        password,
        profileImageUrl,
      });

      if (response.status === 201) {
        toast.success("Profile created successfully");
        navigate("/login");
      }
    } catch (error) {
      console.error("Something went wrong", error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen w-full relative flex items-center justify-center overflow-hidden">
      <img
        src={assets.login_bg}
        alt="Background"
        className="absolute inset-0 w-full h-full object-cover filter blur-sm"
      />

      <div className="relative z-10 w-full max-w-lg px-6">
        <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-lg shadow-2xl p-8 max-h-[90vh] overflow-auto">
          <h3 className="text-2xl font-semibold text-black text-center mb-2">
            Create an Account
          </h3>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 md:grid-cols-2 gap-4">

              <div className="flex justify-center mb-6 col-span-2">
                <ProfilePhotoSelector
                  image={profilePhoto}
                  setImage={setProfilePhoto}
                />
              </div>

              <div className="col-span-2">
                <Input
                  value={fullName}
                  onChange={(value) => {
                    setFullName(value);
                    setError("");
                  }}
                  label="Full Name"
                  placeholder="Enter full name"
                  type="text"
                />
              </div>

              <div className="col-span-2">
                <Input
                  value={email}
                  onChange={(value) => {
                    setEmail(value);
                    setError("");
                  }}
                  label="Email Address"
                  placeholder="fullname@example.com"
                  type="email"
                />
              </div>

              <div className="col-span-2">
                <Input
                  value={password}
                  onChange={(value) => {
                    setPassword(value);
                    setError("");
                  }}
                  label="Password"
                  placeholder="***************"
                  type="password"
                />
              </div>
            </div>

            {error && (
              <p className="text-red-800 text-sm text-center bg-red-50 p-2 rounded">
                {error}
              </p>
            )}

            <button
              disabled={isloading}
              className={`bg-blue-600 hover:bg-blue-700 text-white w-full py-3 text-lg font-medium rounded-lg flex items-center justify-center gap-2 
                ${isloading ? "opacity-60 cursor-not-allowed" : ""}`}
              type="submit"
            >
              {isloading ? (
                <>
                  <LoaderCircle className="animate-spin w-5 h-5" />
                  Signing Up...
                </>
              ) : (
                "SIGN UP"
              )}
            </button>

            <p className="text-sm text-slate-800 text-center mt-6">
              Already have an account?{" "}
              <span
                className="text-blue-600 hover:underline cursor-pointer"
                onClick={() => navigate("/login")}
              >
                Login
              </span>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
