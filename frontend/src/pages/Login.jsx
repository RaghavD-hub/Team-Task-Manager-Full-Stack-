import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import apiAgent from '../api/axios';

const Login = () => {
  const [isLoginView, setIsLoginView] = useState(true);
  const [formData, setFormData] = useState({ fullName: '', emailAddress: '', secretHash: '' });
  const [errorMsg, setErrorMsg] = useState('');
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    try {
      if (isLoginView) {
        await loginUser({ emailAddress: formData.emailAddress, secretHash: formData.secretHash });
      } else {
        await apiAgent.post('/auth/signup', formData);
        await loginUser({ emailAddress: formData.emailAddress, secretHash: formData.secretHash });
      }
      navigate('/dashboard');
    } catch (err) {
      if (err.response?.data?.issues) {
        const issues = err.response.data.issues;
        const msgs = [];
        if (issues.fullName?._errors) msgs.push(...issues.fullName._errors);
        if (issues.emailAddress?._errors) msgs.push(...issues.emailAddress._errors);
        if (issues.secretHash?._errors) msgs.push(...issues.secretHash._errors);
        setErrorMsg(msgs.join(', ') || 'Validation failed.');
      } else {
        setErrorMsg(err.response?.data?.details || err.response?.data?.error || 'Authentication failed. Please try again.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative background blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-brand-500/30 rounded-full blur-[100px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-[120px]" />

      <div className="glass-panel w-full max-w-md p-8 relative z-10">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-2">
            {isLoginView ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className="text-slate-500">
            {isLoginView ? 'Enter your credentials to access your workspace.' : 'Sign up to start collaborating.'}
          </p>
        </div>

        {errorMsg && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-6 border border-red-100">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleAuthSubmit} className="space-y-4">
          {!isLoginView && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
              <input
                type="text"
                name="fullName"
                required
                className="input-field"
                placeholder="Jane Doe"
                value={formData.fullName}
                onChange={handleInputChange}
              />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
            <input
              type="email"
              name="emailAddress"
              required
              className="input-field"
              placeholder="jane@example.com"
              value={formData.emailAddress}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
            <input
              type="password"
              name="secretHash"
              required
              className="input-field"
              placeholder="••••••••"
              value={formData.secretHash}
              onChange={handleInputChange}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium py-3 rounded-xl transition-all shadow-lg hover:shadow-xl mt-4"
          >
            {isLoginView ? 'Sign In' : 'Sign Up'}
          </button>
        </form>

        <div className="mt-8 text-center">
          <button
            onClick={() => setIsLoginView(!isLoginView)}
            className="text-sm text-brand-600 hover:text-brand-700 font-medium transition-colors"
          >
            {isLoginView ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
