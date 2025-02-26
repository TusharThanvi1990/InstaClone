import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import useGetUserProfile from "@/hooks/useGetUserProfile";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { AtSign, Heart, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { setAuthUser, setUserProfile } from "@/redux/authSlice";

const apiURL = import.meta.env.VITE_REACT_APP_API_URL;

const Profile = () => {
  const params = useParams();
  const userId = params.id;
  useGetUserProfile(userId);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState("posts");

  const { userProfile, user } = useSelector((store) => store.auth);

  const isLoggedInUserProfile = user?._id === userProfile?._id;
  const [isFollowing, setIsFollowing] = useState(
    userProfile?.followers?.includes(user?._id)
  );
  const screenWidth = window.innerWidth;

  useEffect(() => {
    if (userProfile) {
      document.title = `${userProfile?.username} • Instagram`;
    }
  }, [userProfile]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleFollowOrUnfollow = async () => {
    try {
      const res = await axios.post(
        `${apiURL}/api/v1/user/followorunfollow/${userProfile?._id}`,
        {},
        {
          withCredentials: true,
        }
      );

      if (res.data.success) {
        setIsFollowing(!isFollowing);
        const updatedUserFollowing = isFollowing ? user?.following.filter((id) => id !== userProfile?._id) : [...user?.following, userProfile?._id];
        dispatch(setAuthUser({ ...user, following: updatedUserFollowing }));
        const updatedUserFollowers = isFollowing ? userProfile?.followers.filter((id) => id !== user?._id) : [...userProfile?.followers, user?._id];
        dispatch(setUserProfile({ ...userProfile, followers: updatedUserFollowers }));
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error.response.data);
      toast.error(error.response.data.message);
    }
  };

  const handleMessage = () => {
    navigate(`/chat`);
  };

  const displayedPost =
    activeTab === "posts" ? userProfile?.posts ?? [] : userProfile?.bookmarks ?? [];

  return (
    <div>
      {screenWidth > 640 ? (
        <div className="flex max-w-5xl justify-center mx-auto pl-10">
          <div className="flex flex-col gap-20 p-8">
            <div className="grid grid-cols-2 ">
              <section className="flex items-center justify-center">
                <Avatar className="w-36 h-36">
                  <AvatarImage
                    src={userProfile?.profilePicture}
                    alt="profilephoto"
                  />
                  <AvatarFallback>TD</AvatarFallback>
                </Avatar>
              </section>
              <section>
                <div className="flex flex-col gap-5">
                  <div className="flex items-center gap-2">
                    <span>{userProfile?.username}</span>
                    {isLoggedInUserProfile ? (
                      <>
                        <Link to="/account/edit">
                          <Button
                            variant="secondary"
                            className="hover:bg-gray-200 h-8"
                          >
                            Edit Profile
                          </Button>
                        </Link>
                        <Button
                          variant="secondary"
                          className="hover:bg-gray-200 h-8"
                        >
                          View archive
                        </Button>
                        <Button
                          variant="secondary"
                          className="hover:bg-gray-200 h-8"
                        >
                          Ad tools
                        </Button>
                      </>
                    ) : isFollowing ? (
                      <>
                        <Button
                          onClick={handleFollowOrUnfollow}
                          variant="secondary"
                          className="h-8"
                        >
                          Unfollow
                        </Button>
                        <Button
                          onClick={handleMessage}
                          variant="secondary"
                          className="h-8"
                        >
                          Message
                        </Button>
                      </>
                    ) : (
                      <Button
                        onClick={handleFollowOrUnfollow}
                        className="bg-[#0095F6] hover:bg-[#3a94cf] h-8"
                      >
                        Follow
                      </Button>
                    )}
                  </div>
                  <div className="flex items-center gap-4">
                    <p>
                      <span className="font-semibold">
                        {userProfile?.posts.length}{" "}
                      </span>{" "}
                      posts
                    </p>
                    <p>
                      <span className="font-semibold">
                        {userProfile?.followers.length}{" "}
                      </span>
                      followers
                    </p>
                    <p>
                      <span className="font-semibold">
                        {userProfile?.following.length}{" "}
                      </span>
                      following
                    </p>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="font-semibold">
                      {userProfile?.bio || "Bio here"}
                    </span>
                    <Badge className="w-fit" variant="secondary">
                      <AtSign />{" "}
                      <span className="pl-1">{userProfile?.username}</span>
                    </Badge>
                  </div>
                </div>
              </section>
            </div>
            <div className="border-t border-t-gray-200">
              <div className="flex items-center justify-center gap-10 text-sm">
                <span
                  className={`py-3 cursor-pointer ${
                    activeTab === "posts" ? "font-bold" : ""
                  }`}
                  onClick={() => handleTabChange("posts")}
                >
                  POSTS
                </span>
                <span
                  className={`py-3 cursor-pointer ${
                    activeTab === "saved" ? "font-bold" : ""
                  }`}
                  onClick={() => handleTabChange("saved")}
                >
                  SAVED
                </span>
                <span className="py-3 cursor-pointer">REELS</span>
                <span className="py-3 cursor-pointer">TAGS</span>
              </div>
              <div className="grid grid-cols-3 gap-1">
                {displayedPost.map((post) => {
                  return (
                    <div
                      key={post?._id}
                      className="relative group cursor-pointer"
                    >
                      <img
                        src={post?.images}
                        alt="postimage"
                        className="rounded-sm my-2 w-full aspect-square object-cover"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ">
                        <div className="flex items-center text-white space-x-4">
                          <button className="flex items-center gap-2 hover:text-gray-300">
                            <Heart />
                            <span>{post?.likes.length}</span>
                          </button>
                          <button className="flex items-center gap-2 hover:text-gray-300">
                            <MessageCircle />
                            <span>{post?.comments.length}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="max-w-5xl justify-center w-[90vw]">
          <div className="flex flex-col pt-5">
            <div className="grid grid-cols-2 ">
              <section className="flex items-center justify-center">
                <Avatar className="w-28 h-28">
                  <AvatarImage
                    src={userProfile?.profilePicture}
                    alt="profilephoto"
                  />
                  <AvatarFallback>TD</AvatarFallback>
                </Avatar>
              </section>
              <section>
                <div className="flex flex-col gap-5">
                  <span className="font-semibold text-xl pt-5">
                    {userProfile?.username}
                  </span>
                  <div className="flex items-center gap-2">
                    {isLoggedInUserProfile ? (
                      <>
                        <Link to="/account/edit">
                          <Button
                            variant="secondary"
                            className="hover:bg-gray-200 h-8"
                          >
                            Edit Profile
                          </Button>
                        </Link>
                        <Button
                          variant="secondary"
                          className="hover:bg-gray-200 h-8"
                        >
                          View archive
                        </Button>
                      </>
                    ) : isFollowing ? (
                      <>
                        <Button
                          onClick={handleFollowOrUnfollow}
                          variant="secondary"
                          className="h-8"
                        >
                          Unfollow
                        </Button>
                        <Button
                          onClick={handleMessage}
                          variant="secondary"
                          className="h-8"
                        >
                          Message
                        </Button>
                      </>
                    ) : (
                      <Button
                        onClick={handleFollowOrUnfollow}
                        className="bg-[#0095F6] hover:bg-[#3a94cf] h-8"
                      >
                        Follow
                      </Button>
                    )}
                  </div>
                </div>
              </section>
              <div className="flex flex-col gap-2 p-2 w-[90vw] mt-2">
                <div className="flex flex-col gap-2 p-2 w-[90vw] mt-2">
                  <Badge className="w-fit" variant="secondary">
                    <AtSign />{" "}
                    <span className="pl-1">{userProfile?.username}</span>
                  </Badge>
                  <span className="font-semibold pl-2">
                    {userProfile?.bio || "Bio here"}
                  </span>
                </div>
                <hr className="bg-slate-200 w-[95vw]"/>
                <div className=" flex items-center gap-[15vw] w-[90vw] justify-center   py-2">
                  <p className="flex flex-col justify-center items-center">
                    <span className="font-semibold">
                      {userProfile?.posts.length}{" "}
                    </span>{" "}
                    posts
                  </p>
                  <p className="flex flex-col justify-center items-center">
                    <span className="font-semibold ">
                      {userProfile?.followers.length}{" "}
                    </span>
                    followers
                  </p>
                  <p className="flex flex-col justify-center items-center">
                    <span className="font-semibold">
                      {userProfile?.following.length}{" "}
                    </span>
                    following
                  </p>
                </div>
              </div>
            </div>
            <hr className="bg-slate-200 w-[100vw]"/>
            <div className="">
              <div className="flex items-center justify-center gap-10 text-sm">
                <span
                  className={`py-3 cursor-pointer ${
                    activeTab === "posts" ? "font-bold" : ""
                  }`}
                  onClick={() => handleTabChange("posts")}
                >
                  POSTS
                </span>
                <span
                  className={`py-3 cursor-pointer ${
                    activeTab === "saved" ? "font-bold" : ""
                  }`}
                  onClick={() => handleTabChange("saved")}
                >
                  SAVED
                </span>
                <span className="py-3 cursor-pointer">REELS</span>
                <span className="py-3 cursor-pointer">TAGS</span>
              </div>
              <div className="pl-5 grid grid-cols-3 gap-1">
                 { 
                 userProfile?.posts.map((post) => {
                  return (
                    <div
                      key={post?._id}
                      className="relative group cursor-pointer"
                    >
                      <img
                        src={post?.images}
                        alt="postimage"
                        className="rounded-sm my-2 w-full aspect-square object-cover"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ">
                        <div className="flex items-center text-white space-x-4">
                          <button className="flex items-center gap-2 hover:text-gray-300">
                            <Heart />
                            <span>{post?.likes.length}</span>
                          </button>
                          <button className="flex items-center gap-2 hover:text-gray-300">
                            <MessageCircle />
                            <span>{post?.comments.length}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
                }
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
