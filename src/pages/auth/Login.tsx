import React, { useState } from 'react';
import { useAppDispatch } from '../../hooks/redux';
// loginWithGoogle বাদ দেওয়া হয়েছে
import { loginWithEmail, registerWithEmail, resetPassword } from '../../services/auth.service';
import { setUser, setError, setLoading } from '../../store/slices/authSlice';
import { useNavigate } from 'react-router-dom';
import { X, Eye, EyeOff } from 'lucide-react';

const Login: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  
  // Global States
  const [localError, setLocalError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  
  // Modal States
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isForgotOpen, setIsForgotOpen] = useState(false);

  // Form States (Login)
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  
  // Form States (Registration)
  const [firstName, setFirstName] = useState('');
  const [surname, setSurname] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [gender, setGender] = useState('female');
  
  // DOB States
  const [bDay, setBDay] = useState('1');
  const [bMonth, setBMonth] = useState('Jan');
  const [bYear, setBYear] = useState(new Date().getFullYear().toString());

  // Forgot Password States
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotMsg, setForgotMsg] = useState('');
  const [forgotErr, setForgotErr] = useState('');

  // --- Functions ---
  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if(!email || !password) return setLocalError('ইমেইল এবং পাসওয়ার্ড দিন');
    try {
      setLocalError('');
      dispatch(setLoading(true));
      const userProfile = await loginWithEmail(email, password);
      dispatch(setUser(userProfile));
      navigate('/');
    } catch (err: any) {
      setLocalError(err.message);
      dispatch(setError(err.message));
    }
  };

  const handleRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');
    setSuccessMsg('');

    if(!firstName || !surname || !regEmail || !regPassword) {
      return setLocalError('সবগুলো ফিল্ড পূরণ করুন');
    }

    if(regPassword.length < 6) {
      return setLocalError('পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।');
    }

    // Age Calculation Check
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const today = new Date();
    const dob = new Date(parseInt(bYear), months.indexOf(bMonth), parseInt(bDay));
    let age = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
      age--;
    }

    if (age < 6) {
      return setLocalError('দুঃখিত, TRICK A4IF-এ অ্যাকাউন্ট তৈরি করতে আপনার বয়স কমপক্ষে ৬ বছর হতে হবে।');
    }
    
    // TS Error Fix: জেন্ডার ভেরিয়েবলটি কনসোলে লগ করা হলো যাতে অব্যবহৃত না থাকে
    console.log("Selected Gender:", gender);

    const fullName = `${firstName} ${surname}`;
    try {
      dispatch(setLoading(true));
      const userProfile = await registerWithEmail(regEmail, regPassword, fullName);
      
      setSuccessMsg('অ্যাকাউন্ট তৈরি সফল হয়েছে! আপনার ইমেইলে একটি ভেরিফিকেশন লিংক পাঠানো হয়েছে। දয়া করে ইনবক্স চেক করুন।');
      
      setTimeout(() => {
        dispatch(setUser(userProfile));
        setIsRegisterOpen(false);
        navigate('/');
      }, 4000);
      
    } catch (err: any) {
      setLocalError(err.message);
      dispatch(setError(err.message));
      dispatch(setLoading(false));
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotMsg('');
    setForgotErr('');
    
    if(!forgotEmail) return setForgotErr('আপনার ইমেইল অ্যাড্রেস দিন।');
    
    try {
      await resetPassword(forgotEmail);
      setForgotMsg('পাসওয়ার্ড রিসেট লিংক আপনার ইমেইলে পাঠানো হয়েছে। ইনবক্স চেক করুন।');
      setTimeout(() => {
        setIsForgotOpen(false);
        setForgotMsg('');
        setForgotEmail('');
      }, 4000);
    } catch (err: any) {
      setForgotErr(err.message);
    }
  };

  // Select Options Generators
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const monthsArr = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const years = Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i);

  return (
    <div className="flex min-h-screen bg-facebook-light items-center justify-center p-4 relative font-sans">
      <div className="max-w-4xl w-full flex flex-col md:flex-row items-center gap-10 z-10">
        
        {/* Left Section - Brand & Logo */}
        <div className="w-full md:w-1/2 text-center md:text-left pt-10 md:pt-0">
          <div className="flex items-center justify-center md:justify-start gap-3 mb-4">
            <div className="w-14 h-14 bg-facebook-blue rounded-xl flex items-center justify-center text-white font-bold text-3xl shadow-lg">
              TA
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-facebook-blue tracking-tight">
              TRICK A4IF
            </h1>
          </div>
          <p className="text-xl md:text-2xl text-black leading-snug mt-2 font-normal">
            TRICK A4IF-এর মাধ্যমে বন্ধুদের সাথে এবং চারপাশের বিশ্বের সাথে সংযুক্ত হোন।
          </p>
        </div>

        {/* Right Section - Login Card */}
        <div className="w-full md:w-[400px] bg-white rounded-xl shadow-lg p-4 mt-10 md:mt-0">
          <form className="flex flex-col gap-3.5" onSubmit={handleEmailLogin}>
            <input 
              type="email" 
              placeholder="Email address or phone number" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3.5 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-facebook-blue focus:border-facebook-blue text-[17px]"
            />
            
            <div className="relative">
              <input 
                type={showLoginPassword ? "text" : "password"} 
                placeholder="Password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3.5 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-facebook-blue focus:border-facebook-blue text-[17px] pr-12"
              />
              <button 
                type="button" 
                onClick={() => setShowLoginPassword(!showLoginPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showLoginPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <button 
              type="submit"
              className="w-full bg-facebook-blue text-white font-bold text-[20px] py-2.5 rounded-md hover:bg-blue-600 transition-colors"
            >
              Log in
            </button>
            
            <div className="text-center mt-1">
              {/* Forgot Password Trigger */}
              <button 
                type="button"
                onClick={() => setIsForgotOpen(true)}
                className="text-sm text-facebook-blue hover:underline cursor-pointer"
              >
                Forgotten password?
              </button>
            </div>

            <div className="border-t border-gray-300 my-2"></div>

            {localError && !isRegisterOpen && !isForgotOpen && <p className="text-red-500 text-sm text-center font-semibold">{localError}</p>}

            <div className="flex justify-center mt-2 mb-2">
              <button 
                type="button"
                onClick={() => setIsRegisterOpen(true)}
                className="bg-[#42b72a] hover:bg-[#36a420] text-white font-bold text-[17px] px-4 py-3 rounded-md transition-colors"
              >
                Create new account
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* --- FORGOT PASSWORD MODAL --- */}
      {isForgotOpen && (
        <div className="fixed inset-0 bg-white/70 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-[500px] rounded-lg shadow-2xl border border-gray-200">
            <div className="flex justify-between items-start p-4 border-b border-gray-200">
              <h2 className="text-[20px] font-bold text-[#1c1e21]">Find Your Account</h2>
              <button onClick={() => { setIsForgotOpen(false); setForgotErr(''); setForgotMsg(''); }} className="text-gray-500 hover:bg-gray-100 p-1 rounded-full">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleForgotPassword} className="p-4">
              <p className="text-[15px] text-[#1c1e21] mb-4">Please enter your email address to search for your account.</p>
              <input 
                type="email" 
                placeholder="Email address" 
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-facebook-blue focus:border-facebook-blue text-[17px] mb-2"
              />
              
              {forgotErr && <p className="text-red-500 text-sm font-semibold mb-2">{forgotErr}</p>}
              {forgotMsg && <p className="text-green-600 text-sm font-bold mb-2 bg-green-50 p-2 rounded">{forgotMsg}</p>}

              <div className="flex justify-end gap-2 mt-4 border-t pt-4">
                <button 
                  type="button"
                  onClick={() => { setIsForgotOpen(false); setForgotErr(''); setForgotMsg(''); }}
                  className="bg-gray-200 hover:bg-gray-300 text-[#1c1e21] font-bold text-[15px] px-4 py-2 rounded-md transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="bg-facebook-blue hover:bg-blue-600 text-white font-bold text-[15px] px-4 py-2 rounded-md transition-colors"
                >
                  Search
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- REGISTRATION MODAL --- */}
      {isRegisterOpen && (
        <div className="fixed inset-0 bg-white/70 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-[432px] rounded-lg shadow-2xl border border-gray-200">
            <div className="flex justify-between items-start p-4 border-b border-gray-200">
              <div>
                <h2 className="text-[32px] font-bold text-[#1c1e21] leading-none mb-1">Sign Up</h2>
                <p className="text-[#606770] text-[15px]">It's quick and easy.</p>
              </div>
              <button onClick={() => { setIsRegisterOpen(false); setLocalError(''); setSuccessMsg(''); }} className="text-gray-500 hover:bg-gray-100 p-1 rounded-full">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleRegistration} className="p-4 flex flex-col gap-3">
              <div className="flex gap-3">
                <input 
                  type="text" 
                  placeholder="First name" 
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-1/2 bg-[#f5f6f7] px-3 py-2 border border-[#ccd0d5] rounded-[5px] text-[15px] focus:outline-none focus:border-facebook-blue"
                />
                <input 
                  type="text" 
                  placeholder="Surname" 
                  value={surname}
                  onChange={(e) => setSurname(e.target.value)}
                  className="w-1/2 bg-[#f5f6f7] px-3 py-2 border border-[#ccd0d5] rounded-[5px] text-[15px] focus:outline-none focus:border-facebook-blue"
                />
              </div>

              <input 
                type="email" 
                placeholder="Mobile number or email address" 
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                className="w-full bg-[#f5f6f7] px-3 py-2 border border-[#ccd0d5] rounded-[5px] text-[15px] focus:outline-none focus:border-facebook-blue"
              />
              
              <div className="relative">
                <input 
                  type={showRegPassword ? "text" : "password"} 
                  placeholder="New password" 
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  className="w-full bg-[#f5f6f7] px-3 py-2 border border-[#ccd0d5] rounded-[5px] text-[15px] focus:outline-none focus:border-facebook-blue pr-10"
                />
                <button 
                  type="button" 
                  onClick={() => setShowRegPassword(!showRegPassword)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showRegPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <div className="mt-1">
                <span className="text-[12px] text-[#606770] font-normal mb-1 block">Date of birth</span>
                <div className="flex gap-3">
                  <select value={bDay} onChange={(e)=>setBDay(e.target.value)} className="w-1/3 bg-white px-2 py-2 border border-[#ccd0d5] rounded-[5px] text-[15px] focus:outline-none">
                    {days.map(d => <option key={d}>{d}</option>)}
                  </select>
                  <select value={bMonth} onChange={(e)=>setBMonth(e.target.value)} className="w-1/3 bg-white px-2 py-2 border border-[#ccd0d5] rounded-[5px] text-[15px] focus:outline-none">
                    {monthsArr.map(m => <option key={m}>{m}</option>)}
                  </select>
                  <select value={bYear} onChange={(e)=>setBYear(e.target.value)} className="w-1/3 bg-white px-2 py-2 border border-[#ccd0d5] rounded-[5px] text-[15px] focus:outline-none">
                    {years.map(y => <option key={y}>{y}</option>)}
                  </select>
                </div>
              </div>

              <div className="mt-1">
                <span className="text-[12px] text-[#606770] font-normal mb-1 block">Gender</span>
                <div className="flex gap-3">
                  <label className="w-1/3 flex items-center justify-between border border-[#ccd0d5] rounded-[5px] px-2 py-2 cursor-pointer hover:bg-gray-50">
                    <span className="text-[15px] text-[#1c1e21]">Female</span>
                    <input type="radio" name="gender" value="female" onChange={() => setGender('female')} defaultChecked />
                  </label>
                  <label className="w-1/3 flex items-center justify-between border border-[#ccd0d5] rounded-[5px] px-2 py-2 cursor-pointer hover:bg-gray-50">
                    <span className="text-[15px] text-[#1c1e21]">Male</span>
                    <input type="radio" name="gender" value="male" onChange={() => setGender('male')} />
                  </label>
                  <label className="w-1/3 flex items-center justify-between border border-[#ccd0d5] rounded-[5px] px-2 py-2 cursor-pointer hover:bg-gray-50">
                    <span className="text-[15px] text-[#1c1e21]">Custom</span>
                    <input type="radio" name="gender" value="custom" onChange={() => setGender('custom')} />
                  </label>
                </div>
              </div>

              {localError && isRegisterOpen && <p className="text-red-500 text-sm text-center font-semibold mt-1">{localError}</p>}
              {successMsg && isRegisterOpen && <p className="text-green-600 text-sm text-center font-bold mt-1 bg-green-50 p-2 rounded">{successMsg}</p>}

              <div className="flex justify-center mt-2 mb-4">
                <button 
                  type="submit"
                  className="bg-[#00a400] hover:bg-[#008d00] text-white font-bold text-[18px] px-14 py-1.5 rounded-[5px] transition-colors shadow-sm"
                >
                  Sign Up
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;