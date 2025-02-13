import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";

export default function VerificationComponent({
  formData,
  error,
  success,
  isResending,
  onChange,
  onSubmit,
  onResendOTP,
  onNavigateToLogin
}) {
  return (
    <div className="flex flex-col h-screen w-screen bg-gray-900">
      <nav className="bg-gray-800 text-white p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Account Verification</h1>
        <div className="space-x-4">
          <Button
            variant="ghost"
            onClick={onNavigateToLogin}
          >
            Back to Login
          </Button>
        </div>
      </nav>

      <div className="flex flex-grow items-center justify-center p-4">
        <div className="w-full max-w-md bg-gray-800 p-8 rounded-lg shadow-xl">
          <h2 className="text-2xl font-bold text-center mb-6 text-white">
            Verify Your Account
          </h2>
          
          {error && (
            <div className="mb-4 p-3 bg-red-600 text-white rounded-lg text-center">
              {error}
            </div>
          )}
          
          {success && (
            <div className="mb-4 p-3 bg-green-600 text-white rounded-lg text-center">
              {success}
            </div>
          )}

          <form onSubmit={onSubmit} className="space-y-4">
            <Input
              type="text"
              name="verificationCode"
              label="Verification Code"
              placeholder="Enter 6-digit code"
              value={formData.verificationCode}
              onChange={onChange}
              className="bg-gray-700 text-white"
              required
            />

            <Button 
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              Verify Account
            </Button>
          </form>

          <div className="mt-4 text-center text-gray-400">
            <p>
              Didn't receive the code?{" "}
              <a
                onClick={onResendOTP}
                disabled={isResending}
                className={`text-blue-400 hover:text-blue-300 ${
                  isResending ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {isResending ? "Sending..." : "Resend Code"}
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}