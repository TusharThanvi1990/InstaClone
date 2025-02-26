import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

const SuggestedUsers = () => {
    const { suggestedUsers } = useSelector(store => store.auth);
    const { user } = useSelector(store=>store.auth)
    const currentUser = user;
    const truncateBio = (bio) => {
        if (!bio) return "Bio here...";
        const words = bio.split(" ");
        return words.length > 4 ? `${words.slice(0, 4).join(" ")}...` : bio;
      }; 
    
    return (
        <div className='my-10'>
            <div className='flex items-center justify-between text-sm'>
                <h1 className='font-semibold text-gray-600'>Suggested for you</h1>
                <span className='font-medium cursor-pointer'>See All</span>
            </div>
            {
                suggestedUsers.map((user) => {
                    return (
                        <div key={user._id} className='flex items-center justify-between my-5 gap-5'>
                            <div className='flex items-center gap-3'>
                                <Link to={`/profile/${user?._id}`}>
                                    <Avatar>
                                        <AvatarImage src={user?.profilePicture} alt="post_image" />
                                        <AvatarFallback>CN</AvatarFallback>
                                    </Avatar>
                                </Link>
                                <div>
                                    <h1 className='font-semibold text-sm overflow-hidden'><Link to={`/profile/${user?._id}`}>{user?.username}</Link></h1>
                                    <span className='text-gray-600 text-sm'>{truncateBio(user?.bio)}</span>
                                </div>
                            </div>
                            <span className='text-[#3BADF8] text-xs font-bold cursor-pointer hover:text-[#3495d6]'>
                                {
                                    currentUser.following.includes(user._id) ? (<p className='text-red-500 hover:text-red-700'>unfollow</p>) : (<p className='text-blue-500 hover:text-blue-700'>follow</p>)
                                }
                            </span>
                        </div>
                    )
                })
            }

        </div>
    )
}

export default SuggestedUsers