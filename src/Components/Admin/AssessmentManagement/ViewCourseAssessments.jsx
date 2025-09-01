import { useEffect, useState } from "react";
import { FaClipboardList } from "react-icons/fa";
import { IoMdBook } from "react-icons/io";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useNavigate, useParams } from "react-router";
import { FetchAllAssessmentsByCourse } from "../../../services/fetchAllAssessmentsByCourse";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ChevronRight,
  ClipboardList,
  Edit2,
  Eye,
  SunIcon,
  Trash2,
  Users,
} from "lucide-react";
import DeleteAssessmentModal from "../DeleteAssessment/DeleteAssessmentModal";
import ViewAssessmentDetails from "../ViewAssessmentDetails/ViewAssessmentDetails";

import ViewAssignedLearnerModal from "./ViewAssignedLearnerModal";

import AssignLearnersModal from "../../Admin/AssessmentManagement/AssignLearnersModal";
import { handleError, handleSuccess } from "../../../utils/toast";
import { updateAssessmentStatus } from "../../../services/Admin/manageassessments/updateAssessmentStatus";
import GoLiveConfirmationModal from "./GoLiveConfirmationModal";
import AssessmentCreationGuide from "../Assessment Creation/AssessmentCreationGuide";

export default function ViewCourseAssessments() {
  const { courseid } = useParams();
  const {
    data: assessments,
    isLoading,
    error,
    refetch,
  } = FetchAllAssessmentsByCourse(courseid);

  useEffect(() => {
    refetch();
  }, [refetch]);

  // console.log("displaying assessments", assessments);

  const [selectedAssessment, setSelectedAssessment] = useState(null);
  // In your parent component
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [openAssessmentModal, setOpenAssessmentModal] = useState(false);

  const [openModalToAssignLearners, setOpenModalToAssignLearners] =
    useState(false);
  const [selectedAssessmentId, setSelectedAssessmentId] = useState(null);

  const [openViewLearnersModal, setOpenViewLearnersModal] = useState(false);

  const [isGoLiveModalOpen, setGoLiveModalOpen] = useState(false);



  {
    /* Handle assign Learner */
  }
  const handleAssignLearner = (assessment) => {
    setSelectedAssessmentId(assessment?._id);
    setSelectedAssessment(assessment);
    setOpenModalToAssignLearners(true);
  };

  // Add this to your delete button onClick
  const handleDeleteClick = (assessment) => {
    setSelectedAssessment(assessment);
    setShowDeleteModal(true);
  };

  const handleOpenAssessment = (assessment) => {
    setSelectedAssessment(assessment);
    setOpenAssessmentModal(true);
  };

 

  const navigate = useNavigate();


  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0 },
  };

  const ViewAssignedLearners = (assessment) => {
    setSelectedAssessmentId(assessment?._id);
    setOpenViewLearnersModal(true);
  };


  //Handle go live
  const handleGoLiveModalOpen = (assessment) => {
    if(assessment?.isLive === true){
      handleError({errors:"Assessment is already live"})
      return 
    }
    setSelectedAssessment(assessment);
    setGoLiveModalOpen(true);
  };

  const handleGoLiveModalClose = () => {
    setGoLiveModalOpen(false);
    setSelectedAssessment(null);
  };

  const handleGoLiveConfirm =async (assessment) => {
    // Call your function to mark the assessment as live
    console.log("Go live confirmed for: ", assessment);
    // Call your API or update logic here
    // e.g., updateAssessmentStatus(assessment._id, true);
    console.log(assessment);

    try {
      const updateAssessment = await updateAssessmentStatus(assessment._id);
      handleSuccess({ success: "Assessment is live" });
      console.log("assessment is live", updateAssessment);
      refetch();
    } catch (error) {
      console.error(error);
      handleError({ errors: "Failed to go Live" });
    }



    setGoLiveModalOpen(false);
    setSelectedAssessment(null);
  };

  return (
    <div className="h-[calc(100vh-80px)]  bg-gray-100 dark:bg-gray-900 p-6 overflow-y-auto">
      {/* Handle delete */}
      {showDeleteModal && (
        <DeleteAssessmentModal
          assessment={selectedAssessment}
          setShowDeleteModal={setShowDeleteModal}
          onDeleteSuccess={() => refetch()}
        />
      )}

      {/* Open Assessment question and answers Modal */}
      {openAssessmentModal && (
        <ViewAssessmentDetails
          AssessmentMainData={selectedAssessment}
          assessmentId={selectedAssessment?._id}
          setOpenAssessmentModal={setOpenAssessmentModal}
        />
      )}

      {/* Open modal to Assign Learners */}
      {openModalToAssignLearners && (
        <AssignLearnersModal
          selectedAssessment={selectedAssessment}
          selectedAssessmentId={selectedAssessmentId}
          setOpenModalToAssignLearners={setOpenModalToAssignLearners}
        />
      )}

      {/* View Assigned Learners to a specific assessment */}
      {openViewLearnersModal && (
        <ViewAssignedLearnerModal
          selectedAssessmentId={selectedAssessmentId}
          setOpenViewLearnersModal={setOpenViewLearnersModal} // Ensure the correct function is passed
        />
      )}


      {/* Go Live Modal */}
      {isGoLiveModalOpen && (
        <GoLiveConfirmationModal
          assessment={selectedAssessment}
          isOpen={isGoLiveModalOpen}
          onClose={handleGoLiveModalClose}
          onConfirm={handleGoLiveConfirm}
        />
      )}

      <div className="max-w-6xl mx-auto p-6 rounded-xl shadow-2xl bg-white dark:bg-gray-800 ">
        <h1 className=" text-3xl font-extrabold text-blue-800 dark:text-blue-400 text-center mb-10">
          Assessments
        </h1>

        <AssessmentCreationGuide />

        

        <div className="flex justify-between mx-2 my-6">

        <div className="">
          <button
            onClick={() => navigate(`/home/create-course/courses/${courseid}`)}
            className="button-style"
          >
            Upload New Assesment Files
          </button>
        </div>

        <div>
          <button
            onClick={() => navigate(`/home/view-assessment-files/${courseid}`)}
            className="button-style"
          >
            Manage Assessment files
          </button>
        </div>

        </div>

       

        {isLoading ? (
          <div className="flex justify-center items-center min-h-[200px]">
            <AiOutlineLoading3Quarters className="text-blue-500 dark:text-blue-300 text-4xl animate-spin" />
          </div>
        ) : error ? (
          <div className="my-8 bg-gray-300 py-6  rounded-xl">
            <p className="text-red-500 dark:text-red-400 text-center">
              No assessments created yet ...
            </p>
          </div>
        ) : (
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="space-y-4 max-w-6xl mx-2 px-4 py-6"
          >
            {assessments?.length === 0 ? (
              <div className="my-8 bg-gray-300 py-6 rounded-xl">
                <p className="text-gray-700 dark:text-gray-400 text-center">
                  No assessments available.
                </p>
              </div>
            ) : (
              assessments?.map((assessment, index) => (
                <motion.div
                  key={assessment?._id}
                  variants={item}
                  className="group relative bg-white dark:bg-gray-800 rounded-xl shadow-md 
                       hover:shadow-xl transition-all duration-300 border border-gray-100 
                       dark:border-gray-700 overflow-hidden"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-4">
                    <div className="flex-1 flex items-center gap-3 cursor-pointer group">
                      <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                        <ClipboardList className="h-5 w-5 text-blue-500 dark:text-blue-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3
                          className="font-medium text-gray-900 dark:text-gray-100 group-hover:text-blue-600 
                                 dark:group-hover:text-blue-400 transition-colors"
                        >
                          {assessment?.assessment_name}
                        </h3>
                      </div>
                      <ChevronRight
                        className="h-5 w-5 text-gray-400 group-hover:text-blue-500 
                                         dark:text-gray-500 dark:group-hover:text-blue-400 
                                         transition-transform group-hover:translate-x-1"
                      />
                    </div>

                    <div className="flex items-center gap-2 sm:gap-3">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleOpenAssessment(assessment, index)}
                        className="button-style-rainbow"
                      >
                        <SunIcon className="h-5 w-5" />
                        <span className="hidden sm:inline">Temperature</span>
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleAssignLearner(assessment)}
                        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-white 
                             dark:text-green-400 bg-green-400 dark:bg-green-900/30 rounded-lg
                             hover:bg-green-100 dark:hover:bg-green-900/50 transition-colors animate-pulse"
                      >
                        <Users className="h-4 w-4" />
                        <span className="hidden sm:inline">Assign</span>
                      </motion.button>

                      {/* View Assigned Learners */}
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => ViewAssignedLearners(assessment)}
                        className="flex justify-center items-center gap-2 px-3 py-2 text-sm font-medium text-white 
                             dark:text-green-400 bg-blue-900/50 dark:bg-green-900/30 rounded-lg
                             hover:bg-green-100 dark:hover:bg-green-900/50 transition-colors "
                      >
                        View
                      </motion.button>

                      {/* View Assigned Learners */}
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleGoLiveModalOpen(assessment)}
                        className="flex justify-center items-center gap-2 px-3 py-2 text-sm font-medium text-white 
                             dark:text-green-400 bg-red-900/50 dark:bg-red-900/30 rounded-lg
                             hover:bg-green-100 dark:hover:bg-red-900/50 transition-colors "
                      >
                        <Eye className="h-4 w-4" />
                        {assessment?.isLive ? "Live" : "Go Live"}

                  
                      </motion.button>

                      {/* <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-blue-600 
                             dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 rounded-lg
                             hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
                      >
                        <Edit2 className="h-4 w-4" />
                        <span className="hidden sm:inline">Edit</span>
                      </motion.button> */}

                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleDeleteClick(assessment)}
                        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-600 
                             dark:text-red-400 bg-red-50 dark:bg-red-900/30 rounded-lg
                             hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))
            )}

            <div className="flex justify-between mt-8">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate(`/home/all-assessments`)}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white 
                       bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Dashboard
              </motion.button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
