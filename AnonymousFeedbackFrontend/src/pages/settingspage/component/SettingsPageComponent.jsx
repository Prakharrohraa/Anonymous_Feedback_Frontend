export default function SettingsComponent({
    name,
    email,
    onBackToDashboard,
    onLogout,
    onNavigateToSecurity,
  }) {
    return (
      <div className="flex flex-col h-screen w-screen">
        <nav className="bg-gray-900 text-white p-4 flex justify-between items-center">
          <h1 className="text-xl font-bold">Settings</h1>
          <div className="space-x-4">
            <button
              className="px-4 py-2 bg-gray-700 rounded"
              onClick={onBackToDashboard}
            >
              Back to Dashboard
            </button>
            <button
              className="px-4 py-2 bg-red-600 rounded"
              onClick={onLogout}
            >
              Logout
            </button>
          </div>
        </nav>
  
        <div className="flex flex-grow">
          <div className="w-1/4 bg-gray-800 text-white p-4 flex flex-col">
            <h2 className="text-xl font-bold mb-4">Settings</h2>
            <button className="py-2 bg-gray-700 rounded mb-2">
              Profile
            </button>
            <button
              className="py-2 bg-gray-700 rounded mb-2"
              onClick={onNavigateToSecurity}
            >
              Security
            </button>
          </div>
  
          <div className="flex-1 p-4 rounded-lg shadow-md overflow-auto right-content-background">
            <h2 className="text-2xl font-bold mb-4 text-black">Profile Settings</h2>
            <div className="space-y-4">
              <div>   
                <label className="block text-xl font-bold text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  className="w-80 p-2 border rounded mt-1 text-center text-black text-lg"
                  value={name}
                  disabled
                />
              </div>
              <div>
                <label className="block text-xl font-bold text-gray-700">
                  Email
                </label>
                <input
                  type="text"
                  className="w-80 p-2 border rounded mt-1 text-center text-black text-lg"
                  value={email}
                  disabled
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }