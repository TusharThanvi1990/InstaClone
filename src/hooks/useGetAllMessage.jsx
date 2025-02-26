import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { setMessages } from '@/redux/chatSlice';

const apiURL = import.meta.env.VITE_REACT_APP_API_URL;

const useGetAllMessage = () => {
    const dispatch = useDispatch();
    const {selectedUser} = useSelector((store) => store.auth);
    useEffect(() => {
        const fetchAllMessage = async () => {
            try {
                const res = await axios.get(`${apiURL}/api/v1/message/all/${selectedUser?._id}`,{withCredentials: true});
                if(res.data.success){
                    dispatch(setMessages(res.data.messages));
                }
            } catch (error) {
                console.log(error);
            }
        }
    fetchAllMessage()
    }, [selectedUser])
}

export default useGetAllMessage;