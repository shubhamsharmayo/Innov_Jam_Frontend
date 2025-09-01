import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { FaTimes, FaUser } from "react-icons/fa";
import { useParams } from "react-router";
import axios from "axios";
import { FetchAssignedLearnersByAssessments } from "../../../services/FetchAssignedLearnersByAssessment";


const ViewAssignedLearnerModal = ( {
  selectedAssessmentId, 
  setOpenViewLearnersModal

} ) => {

  
  const { data: users, isLoading,refetch } = FetchAssignedLearnersByAssessments(selectedAssessmentId);

  useEffect(() => {
      refetch();
    }, [refetch]);

  console.log("assigned learners", users);

  // Function to assign learners
 

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg w-[90%] max-w-lg"
      >
        {/* Modal Header */}
        <div className="flex justify-between items-center border-b pb-3">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
            Assigned Learners for Assessment
          </h2>
          <button onClick={() => setOpenViewLearnersModal(false)} className="text-gray-500 hover:text-red-600">
            <FaTimes size={20} />
          </button>
        </div>

        {/* Modal Content */}
        <div className="mt-4">
          {isLoading ? (
            <p className="text-center text-gray-500 dark:text-gray-400">Loading users...</p>
          ) : users?.length > 0 ? (
            <ul className="space-y-3">
              {users.map((user) => (
                <li key={user._id} className="flex flex-col p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center gap-3">
                    <FaUser className="text-blue-500 dark:text-blue-300" />
                    <span className="text-gray-800 dark:text-gray-200 font-semibold">{user?.userId?.name}</span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{user?.userId?.email}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center text-gray-500 dark:text-gray-400">No learner assigned yet.</p>
          )}
        </div>

        {/* Buttons */}
        <div className="mt-4 text-right">
          

          

          <button
            onClick={() => setOpenViewLearnersModal(false)}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
          >
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default ViewAssignedLearnerModal;
