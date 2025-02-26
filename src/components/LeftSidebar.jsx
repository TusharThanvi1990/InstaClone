import {
  Heart,
  Home,
  LogOut,
  MessageCircle,
  PlusSquare,
  Search,
  TrendingUp,
} from "lucide-react";
import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setAuthUser } from "@/redux/authSlice";
import CreatePost from "./CreatePost";
import { setPosts, setSelectedPost } from "@/redux/postSlice";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { setLikeNotification } from "@/redux/rtnSlice";

const apiURL = import.meta.env.VITE_REACT_APP_API_URL;

const LeftSidebar = () => {
  const navigate = useNavigate();
  const { user } = useSelector((store) => store.auth);
  const { likeNotification } = useSelector(
    (store) => store.realTimeNotification
  );
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const windowWidth = window.innerWidth;

  const logoutHandler = async () => {
    try {
      const res = await axios.get(`${apiURL}/api/v1/user/logout`, {
        withCredentials: true,
      });
      if (res.data.success) {
        dispatch(setAuthUser(null));
        dispatch(setSelectedPost(null));
        dispatch(setPosts([]));
        dispatch(setLikeNotification([]));
        navigate("/login");
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const sidebarHandler = (textType) => {
    // alert(textType);
    if (textType === "Logout") {
      logoutHandler();
    } else if (textType === "Create") {
      setOpen(true);
    } else if (textType === "Profile") {
      navigate(`/profile/${user?._id}`);
    } else if (textType === "Home") {
      navigate("/");
    } else if (textType === "Messages") {
      navigate("/chat");
    }
  };

  const sidebarItems = [
    { icon: <Home />, text: "Home" },
    { icon: <Search />, text: "Search" },
    { icon: <MessageCircle />, text: "Messages" },
    { icon: <Heart />, text: "Notifications" },
    { icon: <PlusSquare />, text: "Create" },
    {
      icon: (
        <Avatar className="w-6 h-6">
          <AvatarImage src={user?.profilePicture} alt="@shadcn" />
          <AvatarFallback></AvatarFallback>
        </Avatar>
      ),
      text: "Profile",
    },
    { icon: <LogOut />, text: "Logout" },
  ];

  const handleSearch = async () => {
    try {
      const res = await axios.get(`${import.meta.env.URL}/api/v1/user/search`, {
        params: { query },
      });

      if (res.data.success) {
        if (res.data.users) setResults(res.data.users);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "An unexpected error occurred"
      );
    } finally {
      setQuery("");
    }
  };

  return (
    <div className="absolute z-20" >
      {windowWidth > 768 ? (
        <div className="fixed top-0 z-10 left-0 px-4 border-r border-gray-300 w-[16%] h-screen ">
          <div className="flex flex-col ">
            <h1 className="my-8 pl-3 font-bold text-xl">
              Instagram
            </h1>
            <div>
              {sidebarItems.map((item, index) => {
                return (
                  <div
                    onClick={() => sidebarHandler(item.text)}
                    key={index}
                    className="flex items-center gap-3 relative hover:bg-gray-100 cursor-pointer p-3 rounded-lg my-3"
                  >
                    {item.icon}
                    <span>{item.text}</span>
                    {item.text == "Notifications" &&
                      likeNotification.length > 0 && (
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              size="icon"
                              className="rounded-full h-5 w-5 bg-red-600 hover:bg-red-700 absolute bottom-6 left-6"
                            >
                              {likeNotification.length}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent>
                            <div className="">
                              {likeNotification.length == 0 ? (
                                <p>No new notification</p>
                              ) : (
                                likeNotification.map((notification) => {
                                  return (
                                    <div
                                      key={notification.userId}
                                      className="flex items-center gap-2 my-2"
                                    >
                                      <Avatar>
                                        <AvatarImage
                                          src={
                                            notification.userDetails
                                              ?.profilePicture
                                          }
                                        />
                                        <AvatarFallback>TD</AvatarFallback>
                                      </Avatar>
                                      <p className="text-sm ">
                                        <span className="font-bold">
                                          {notification.userDetails?.username}{" "}
                                        </span>
                                        liked your post
                                      </p>
                                    </div>
                                  );
                                })
                              )}
                            </div>
                          </PopoverContent>
                        </Popover>
                      )}{" "}
                    {item.text == "Search" && (
                      <Popover>
                        <PopoverTrigger asChild>
                          <button className="rounded-full h-5 w-5 bg-blue-600 hover:bg-blue-700 absolute bottom-6 left-6"></button>
                        </PopoverTrigger>
                        <PopoverContent className="p-4 w-80">
                          <h1 className="text-2xl font-bold mb-4">
                            Search Users
                          </h1>
                          <div className="flex items-center mb-4">
                            <input
                              type="text"
                              value={query}
                              onChange={(e) => setQuery(e.target.value)}
                              placeholder="Search for users..."
                              className="border border-gray-300 rounded-md p-2 flex-grow"
                            />
                            <Button
                              onClick={handleSearch}
                              className="ml-2 bg-blue-500 text-white rounded-md px-4 py-2"
                            >
                              Search
                            </Button>
                          </div>
                          <div className="search-results grid grid-cols-1 gap-4">
                            {results.map((user) => (
                              <div
                                onClick={() => {
                                  navigate(`/profile/${user._id}`);
                                }}
                                key={user._id}
                                className="user-card border border-gray-300 rounded-md p-4 flex items-center cursor-pointer"
                              >
                                <Avatar className="mr-4">
                                  <AvatarImage
                                    src={user.profilePicture}
                                    alt="Profile Picture"
                                  />
                                  <AvatarFallback>
                                    {user.username.charAt(0)}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <h2 className="text-lg font-semibold">
                                    {user.username}
                                  </h2>
                                  <p className="text-gray-600">{user.bio}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </PopoverContent>
                      </Popover>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          <CreatePost open={open} setOpen={setOpen} />
        </div>
      ) : (
            <div className="flex fixed w-[100vw] bottom-0 bg-slate-100 h-[7vh] items-center justify-center">
              {sidebarItems.map((item, index) => {
                return (
                  <div
                    onClick={() => sidebarHandler(item.text)}
                    key={index}
                    className="flex items-center gap-3 relative hover:bg-gray-100 cursor-pointer p-3 rounded-lg my-3 w-1/6 justify-center"
                  >
                    {item.icon}
                    <span className="hidden">{item.text}</span>
                    {item.text == "Notifications" &&
                      likeNotification.length > 0 && (
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              size="icon"
                              className="rounded-full h-5 w-5 bg-red-600 hover:bg-red-700 absolute bottom-6 left-6"
                            >
                              {likeNotification.length}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent>
                            <div className="">
                              {likeNotification.length == 0 ? (
                                <p>No new notification</p>
                              ) : (
                                likeNotification.map((notification) => {
                                  return (
                                    <div
                                      key={notification.userId}
                                      className="flex items-center gap-2 my-2"
                                    >
                                      <Avatar>
                                        <AvatarImage
                                          src={
                                            notification.userDetails
                                              ?.profilePicture
                                          }
                                        />
                                        <AvatarFallback>TD</AvatarFallback>
                                      </Avatar>
                                      <p className="text-sm ">
                                        <span className="font-bold">
                                          {notification.userDetails?.username}{" "}
                                        </span>
                                        liked your post
                                      </p>
                                    </div>
                                  );
                                })
                              )}
                            </div>
                          </PopoverContent>
                        </Popover>
                      )}{" "}
                    {item.text == "Search" && (
                      <Popover>
                        <PopoverTrigger asChild>
                          <button className="rounded-full h-5 w-5 bg-blue-600 hover:bg-blue-700 absolute bottom-6 left-6"></button>
                        </PopoverTrigger>
                        <PopoverContent className="p-4 w-[100vw]">
                          <h1 className="text-2xl font-bold mb-4">
                            Search Users
                          </h1>
                          <div className="flex items-center mb-4">
                            <input
                              type="text"
                              value={query}
                              onChange={(e) => setQuery(e.target.value)}
                              placeholder="Search for users..."
                              className="border border-gray-300 rounded-md p-2 flex-grow"
                            />
                            <Button
                              onClick={handleSearch}
                              className="ml-2 bg-blue-500 text-white rounded-md px-4 py-2"
                            >
                              Search
                            </Button>
                          </div>
                          <div className="search-results grid grid-cols-1 gap-4">
                            {results.map((user) => (
                              <div
                                onClick={() => {
                                  navigate(`/profile/${user._id}`);
                                }}
                                key={user._id}
                                className="user-card border border-gray-300 rounded-md p-4 flex items-center cursor-pointer"
                              >
                                <Avatar className="mr-4">
                                  <AvatarImage
                                    src={user.profilePicture}
                                    alt="Profile Picture"
                                  />
                                  <AvatarFallback>
                                    {user.username.charAt(0)}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <h2 className="text-lg font-semibold">
                                    {user.username}
                                  </h2>
                                  <p className="text-gray-600">{user.bio}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </PopoverContent>
                      </Popover>
                    )}
                  </div>
                );
              })}
          <CreatePost open={open} setOpen={setOpen} />
        </div>
      )}
    </div>
  );
};

export default LeftSidebar;
