import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import SuggestedUsers from "./SuggestedUsers";

const RightSidebar = () => {
  const { user } = useSelector((store) => store.auth);
  const truncateBio = (bio) => {
    if (!bio) return "Bio here...";
    const words = bio.split(" ");
    return words.length > 4 ? `${words.slice(0, 4).join(" ")}...` : bio;
  };

  return (
    <div className="w-[35vw] my-10 pr-20 hidden md:inline">
      <div className="flex items-center gap-3">
        <Link to={`/profile/${user?._id}`}>
          <Avatar>
            <AvatarImage src={user?.profilePicture} alt="post_image" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </Link>
        <div className="flex items-center justify-between w-full ">
          <div className="">
            <h1 className="font-semibold text-sm">
              <Link to={`/profile/${user?._id}`}>{user?.username}</Link>
            </h1>
            <span className="text-gray-600 text-sm h-[2px] overflow-y-hidden">
              {truncateBio(user?.bio)}
            </span>
          </div>
          <span className="text-[#3BADF8] text-xs font-bold cursor-pointer hover:text-[#3495d6]">
            Switch
          </span>
        </div>
      </div>
      <SuggestedUsers />
    </div>
  );
};

export default RightSidebar;
