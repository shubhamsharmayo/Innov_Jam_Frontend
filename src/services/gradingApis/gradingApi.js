import axios from "axios";
import { toast } from "react-toastify";
import { handleError } from "../../utils/toast";
const VITE_API_URL = import.meta.env.VITE_API_URL;

export const createGrading = async (data) => {
    try {
        const response = await axios.post(
            `${VITE_API_URL}/api/grades/create`,
            data
        );
        toast.success("Grading created successfully");
        return response.data;
    } catch (error) {
        console.error("Error creating grading:", error);
        toast.error("Error creating grading");
    }
};

export const getAllGradings = async () => {
    try {
        const response = await axios.get(`${VITE_API_URL}/api/grades/getgrades`);
        return response.data;
    } catch (error) {
        console.error("Error creating grading:", error);
        toast.error("Error creating grading");
    }
};

export const removeGrading = async (id) => {
    try {
        const response = await axios.delete(
            `${VITE_API_URL}/api/grades/remove/${id}`
        );
        console.log("grade delete response",response)
        toast.success("Grading deleted successfully");
        return response.data;
    } catch (error) {
        console.error("Error deleting grading:", error);
        toast.error("This grade is allready assigned to assessments.");
    }
};

export const createRange = async (data) => {
    try {
        const response = await axios.post(
            `${VITE_API_URL}/api/grade-ranges/create`,
            data
        );

        if(response){
            toast.success("Range created successfully");
        return response.data;
        }else{
            handleError({errors:"Error creating range"});
        }
        
    } catch (error) {
        console.error("Error creating grading:", error);
        handleError({errors:error.response.data.error});
    }
};

export const getAllRanges = async (id) => {
    try {
        const response = await axios.get(`${VITE_API_URL}/api/grade-ranges/getgrade/${id}`);
        const { gradeRanges } = response.data;
        return gradeRanges || [];
    } catch (error) {
        console.error("Error creating grading:", error);
        // toast.error("Error creating grading");
    }
};

export const removeGradeRanges = async (id) => {
    try {
        const response = await axios.delete(
            `${VITE_API_URL}/api/grade-ranges/remove/${id}`
        );
        console.log("grade range delete response",response)
        toast.success("Grade range deleted successfully");
        return response.data;
    } catch (error) {
        console.error("Error deleting grading:", error);
        toast.error("This grade is allready assigned to assessments.");
    }
};