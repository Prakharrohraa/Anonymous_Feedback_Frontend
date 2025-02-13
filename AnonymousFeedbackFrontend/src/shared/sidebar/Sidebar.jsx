const Sidebar = ({ onFeedbackOpen }) => {
    return (
      <div className="w-1/4 bg-gray-800 text-white p-4 flex flex-col">
        <h2 className="text-xl font-bold mb-4">Employee Dashboard</h2>
        <button
          className="flex-1 py-2 bg-blue-600 rounded mb-2 button-height"
          onClick={onFeedbackOpen}
        >
          Send Feedback
        </button>
      </div>
    );
  };
  
  export default Sidebar;