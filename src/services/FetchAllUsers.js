import { useQuery } from "react-query";
import axios from "axios";

const VITE_API_URL = import.meta.env.VITE_API_URL;

const fetchAllUsers = async () => {
  const response = await axios.get(`${VITE_API_URL}/api/users/getusers`);
  console.log(response.data)
  return response.data;
};

export const FetchAllUsers = () => {
  return useQuery({
    queryKey: ["allUsers"],
    queryFn: () => fetchAllUsers(),
    retry: 2,
    refetchOnWindowFocus: true, 
    refetchOnMount: true, // Forces refetch when the component mounts
  });
};


