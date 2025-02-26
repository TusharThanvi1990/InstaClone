import React,{ useEffect } from 'react';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { setPosts } from '@/redux/postSlice';

const apiURL = import.meta.env.VITE_REACT_APP_API_URL;

const useGetAllPosts = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        const fetchAllPost = async () => {
            try {
                const res = await axios.get(`${apiURL}/api/v1/post/all`,{withCredentials: true});
                if(res.data.success){
                    dispatch(setPosts(res.data.posts));
                }
            } catch (error) {
                console.log(error);
            }
        }
    fetchAllPost()
    }, [])
}

export default useGetAllPosts;