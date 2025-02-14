import React from "react";

const FeedbackModal = ({
  searchQuery = "", // Default value to prevent undefined errors
  filteredUsers = [],
  showDropdown = false,
  feedbackMessage = "",
  onSearchChange,
  onUserSelect,
  onFeedbackChange, // ✅ Corrected prop
  onCancel,
  onSubmit,
}) => {
  console.log("FeedbackModal Props:", { searchQuery, filteredUsers, showDropdown, feedbackMessage });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg">
        <h2 className="text-xl font-bold mb-4 text-black">Send Feedback</h2>
        
        {/* User Search Input */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search user by email..."
            className="w-full p-2 border mb-2"
            value={searchQuery}
            onChange={onSearchChange}
          />
          
          {/* Dropdown for filtered users */}
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

        {/* Feedback Message Input */}
        <textarea
          placeholder="Enter Feedback maximum limit = 500 characters"
          className="w-full p-2 border mb-2"
          value={feedbackMessage}
          onChange={onFeedbackChange} // Corrected function
        ></textarea>

        {/* Buttons */}
        <div className="flex justify-end space-x-2">
          <button
            className="px-4 py-2 bg-gray-500 text-white rounded"
            onClick={onCancel} // ✅ Calls the passed `onCancel` function
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded"
            onClick={onSubmit} // ✅ Calls the passed `onSubmit` function
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeedbackModal;
