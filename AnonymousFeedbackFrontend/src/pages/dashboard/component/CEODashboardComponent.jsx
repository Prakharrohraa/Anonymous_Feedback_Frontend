export default function CEODashboardComponent({
    approvedReviews,
    subordinateReviews,
    showApproved,
    showSubordinate,
    showFeedbackModal,
    searchQuery,
    filteredUsers,
    showDropdown,
    expandedFeedbackId,
    feedbackMessage,
    onToggleApproved,
    onToggleSubordinate,
    onToggleFeedbackModal,
    onSearchChange,
    onUserSelect,
    onSendFeedback,
    onLogout,
    onNavigateToSettings,
    onToggleFeedback,
    onFeedbackMessageChange,
  }) {
    return (
      <div className="flex flex-col h-screen w-screen">
        {/* Navbar */}
        <nav className="bg-gray-900 text-white p-4 flex justify-between items-center">
          <h1 className="text-xl font-bold">Anonymous Feedback</h1>
          <div className="space-x-4">
            <button className="px-4 py-2 bg-gray-700 rounded" onClick={onNavigateToSettings}>
              Settings
            </button>
            <button className="px-4 py-2 bg-red-600 rounded" onClick={onLogout}>
              Logout
            </button>
          </div>
        </nav>
  
        <div className="flex flex-grow">
          {/* Sidebar */}
          <div className="w-1/4 bg-gray-800 text-white p-4 flex flex-col">
            <h2 className="text-xl font-bold mb-4">CEO Dashboard</h2>
            <button
              className="flex-1 py-2 bg-gray-700 rounded mb-2 button-height"
              onClick={onToggleApproved}
            >
              {showApproved ? "Hide Company Reviews" : "Show Company Reviews"}
            </button>
            <button
              className="flex-1 py-2 bg-gray-700 rounded mb-2 button-height"
              onClick={onToggleSubordinate}
            >
              {showSubordinate ? "Hide Subordinate Reviews" : "Show Subordinate Reviews"}
            </button>
            <button
              className="flex-1 py-2 bg-blue-600 rounded mb-2 button-height"
              onClick={onToggleFeedbackModal}
            >
              Send Feedback
            </button>
          </div>
  
          {/* Main Content */}
          <div className="flex-1 p-4 rounded-lg shadow-md overflow-auto right-content-background">
            {showApproved && (
              <div>
                <h2 className="text-2xl font-bold mb-4 text-white">Company Reviews</h2>
                {approvedReviews.length > 0 ? (
                  <div className="space-y-4">
                    {approvedReviews.map((review) => (
                      <div
                        key={review.feedbackId}
                        className="bg-white p-4 rounded-lg shadow-sm"
                      >
                        <p className={`text-gray-800 ${expandedFeedbackId === review.feedbackId ? "" : "line-clamp-3"}`}>
                          {review.message}
                        </p>
                        {review.message.length > 100 && (
                          <button
                            onClick={() => onToggleFeedback(review.feedbackId)}
                            className="text-blue-600 hover:text-blue-800 mt-2"
                          >
                            {expandedFeedbackId === review.feedbackId ? "Read less" : "Read more..."}
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No reviews available.</p>
                )}
              </div>
            )}
  
            {showSubordinate && (
              <div>
                <h2 className="text-2xl font-bold mt-6 mb-4 text-white">Subordinate Reviews</h2>
                {subordinateReviews.length > 0 ? (
                  <div className="space-y-4">
                    {subordinateReviews.map((review) => (
                      <div
                        key={review.id}
                        className="bg-white p-4 rounded-lg shadow-sm"
                      >
                        <strong className="text-gray-700">{review.receiverName}:</strong>
                        <p className={`text-gray-600 mt-1 ${expandedFeedbackId === review.id ? "" : "line-clamp-3"}`}>
                          {review.message}
                        </p>
                        {review.message.length > 100 && (
                          <button
                            onClick={() => onToggleFeedback(review.id)}
                            className="text-blue-600 hover:text-blue-800 mt-2"
                          >
                            {expandedFeedbackId === review.id ? "Read less" : "Read more..."}
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-white">No subordinate reviews available.</p>
                )}
              </div>
            )}
          </div>
        </div>
  
        {/* Feedback Modal */}
        {showFeedbackModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg">
              <h2 className="text-xl font-bold mb-4 text-black">Send Feedback</h2>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search user by email..."
                  className="w-full p-2 border mb-2"
                  value={searchQuery}
                  onChange={onSearchChange}
                  onFocus={() => setShowDropdown(true)}
                />
                {showDropdown && filteredUsers.length > 0 && (
                  <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-40 overflow-y-auto">
                    {filteredUsers.map((user) => (
                      <div
                        key={user.email}
                        className="p-2 hover:bg-gray-100 cursor-pointer text-black"
                        onClick={() => onUserSelect(user.email)}
                      >
                        {user.email}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <textarea
                placeholder="Enter Feedback maximum limit = 500 characters"
                className="w-full p-2 border mb-2"
                value={feedbackMessage}
                onChange={onFeedbackMessageChange}
              ></textarea>
              <div className="flex justify-end space-x-2">
                <button
                  className="px-4 py-2 bg-gray-500 text-white rounded"
                  onClick={() => {
                    onToggleFeedbackModal(false);
                    setSearchQuery("");
                    setReceiverEmail("");
                  }}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-blue-600 text-white rounded"
                  onClick={onSendFeedback}
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }