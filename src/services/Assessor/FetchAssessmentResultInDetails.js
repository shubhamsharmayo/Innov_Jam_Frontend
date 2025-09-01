import { useQuery } from "react-query";
import axios from "axios";

const VITE_API_URL = import.meta.env.VITE_API_URL;

const fetchAssessmentResultDetails = async (assessmentId) => {
  const response = await axios.get(`${VITE_API_URL}/api/assessors/getstudentscore?assessment_id=${assessmentId}`);
  return response.data || [];
};

// http://192.168.1.40:7000/api/assessors/getstudentscore?assessment_id=67a9a41e94e13a5c232fbe53

export const FetchAssessmentResultInDetails = (assessmentId) => {
  return useQuery({
    queryKey: ["all_assessments_result_details"], // Unique query key per course
    queryFn: () => fetchAssessmentResultDetails(assessmentId),
    retry: 2,
    refetchOnWindowFocus: true,
    staleTime:0,
    refetchInterval:0,
    

  });
};
