import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { setSuggestedUsers } from '@/redux/authSlice';

const apiURL = import.meta.env.VITE_REACT_APP_API_URL;

const useGetSuggestedUsers = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        const fetchSuggestedUsers = async () => {
            try {
                const res = await axios.get(`${apiURL}/api/v1/user/suggested`,{withCredentials: true});
                if(res.data.success){
                    dispatch(setSuggestedUsers(res.data.users));
                }
            } catch (error) {
                console.log(error);
            }
        }
    fetchSuggestedUsers()
    }, [])
}

export default useGetSuggestedUsers;