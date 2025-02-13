export default function SecuritySettingsComponent({
    newPassword,
    confirmPassword,
    error,
    success,
    setNewPassword,
    setConfirmPassword,
    handleChangePassword,
    handleBack, // Back navigation function
  }) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-gray-900">
        <div className="backdrop-blur-lg bg-gray-800 bg-opacity-70 p-8 rounded-lg shadow-lg w-full max-w-lg border border-gray-700">
          <h2 className="text-3xl font-bold mb-6 text-white text-center">Security Settings</h2>
  
          {error && <div className="mb-4 p-3 bg-red-500 text-white rounded-lg text-center">{error}</div>}
          {success && <div className="mb-4 p-3 bg-green-500 text-white rounded-lg text-center">{success}</div>}
  
          {/* Back Button */}
          <button
            className="mb-6 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors w-full"
            onClick={handleBack}
          >
            ← Back to Dashboard
          </button>
  
          <div className="mb-6">
            <label className="block text-lg font-bold text-white mb-2">Change Password</label>
            <input
              type="password"
              placeholder="New Password"
              className="w-full p-3 bg-gray-900 text-white border border-gray-600 rounded-lg mb-3 focus:ring-2 focus:ring-blue-500 outline-none"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <input
              type="password"
              placeholder="Confirm New Password"
              className="w-full p-3 bg-gray-900 text-white border border-gray-600 rounded-lg mb-3 focus:ring-2 focus:ring-blue-500 outline-none"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <button
              className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors font-semibold"
              onClick={handleChangePassword}
            >
              Update Password
            </button>
          </div>
        </div>
      </div>
    );
  }
  