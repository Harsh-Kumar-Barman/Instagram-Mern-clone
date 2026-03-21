import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Heart, MessageCircle, Eye } from "lucide-react"
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, Legend } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { useSelector } from "react-redux";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

const BASE_URL =
import.meta.env.VITE_NODE_ENV === "development"
  ? import.meta.env.VITE_API_BASE_URL_DEV
  : import.meta.env.VITE_API_BASE_URL_PROD;


export default function Dashboard() {
  const userDetails = useSelector((state) => state.counter.userDetails);
  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: ['dashboard', userDetails?.username],
    queryFn: async () => {
      const { data } = await axios.get(`${BASE_URL}/api/users/dashboard/${userDetails.username}`);
      return data;
    },
    enabled: !!userDetails?.username,
    onError: (error) => {
      console.error('Error fetching user data:', error);
      if (error?.response?.statusText === "Unauthorized" || error.response?.status === 403) {
        navigate('/login');
      }
    }
  });

  const totalLikes = data?.totalLikes || 0;
  const totalComments = data?.totalComments || 0;
  const totalViews = data?.totalViews || 0;
  const reels = data?.reels || [];

  const chartData = reels.map(reel => ({
    name: `Reel ${reel.caption}`,
    likes: reel.likes.length,
    comments: reel.comments.length,
    views: 10,
  }));

  if (isLoading) {
    return <div className="p-4 flex justify-center items-center dark:bg-neutral-950 min-h-screen text-white">Loading dashboard...</div>;
  }

  return (
    (<div className="p-4 space-y-4 dark:bg-neutral-950">
      <Card>
        <CardHeader className="flex flex-row items-center space-x-4 pb-2">
          <Link to={`/profile/${userDetails.username}`} className="flex flex-row items-center space-x-4 pb-2">
          <Avatar className="w-20 h-20">
            <AvatarImage src={userDetails.profilePic} alt={userDetails.username} />
            <AvatarFallback>{userDetails.username?.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-2xl">{userDetails.username}</CardTitle>
            <CardDescription>Dashboard Overview</CardDescription>
          </div>
          </Link>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Likes</CardTitle>
                <Heart className="w-5 h-5 text-neutral-500 dark:text-neutral-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalLikes}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Views</CardTitle>
                <Eye className="w-5 h-5 text-neutral-500 dark:text-neutral-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalViews}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Comments</CardTitle>
                <MessageCircle className="w-5 h-5 text-neutral-500 dark:text-neutral-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalComments}</div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
       <Card>
        <CardHeader>
          <CardTitle>Reel Performance Graph</CardTitle>
          <CardDescription>Comparison of likes, comments, and views for each reel</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              likes: {
                label: "Likes",
              },
              comments: {
                label: "Comments",
              },
              views: {
                label: "Views",
              },
            }}
            className="h-[45vh] w-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <XAxis dataKey="name" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Legend />
                <Line type="monotone" dataKey="likes" stroke="#f87171" strokeWidth={2} />
                <Line type="monotone" dataKey="comments" stroke="#60a5fa" strokeWidth={2} />
                <Line type="monotone" dataKey="views" stroke="#34d399" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Reel Performance</CardTitle>
          <CardDescription>Individual statistics for your reels</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[300px]">
            <div className="space-y-4">
              {reels.map((reel) => (
                <Card key={reel?._id}>
                  <CardContent className="flex items-center space-x-4 py-4">
                    {reel?.mediaType==='image'?
                    <img
                      src={reel?.mediaPath}
                      alt={`Reel ${reel?.caption} thumbnail`}
                      className="w-44 h-44 rounded object-cover object-top" />
                      :
                      <video src={reel?.mediaPath} className="w-44 h-44 rounded object-cover" />
                      }
                    
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium">{reel?.caption}</p>
                      <div className="flex space-x-4 text-sm text-neutral-500 dark:text-neutral-400">
                        <span className="flex items-center">
                          <Heart className="w-4 h-4 mr-1" />
                          {reel.likes.length}
                        </span>
                        <span className="flex items-center">
                          <MessageCircle className="w-4 h-4 mr-1" />
                          {reel.comments.length}
                        </span>
                        <span className="flex items-center">
                          <Eye className="w-4 h-4 mr-1" />
                          {10}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>)
  );
}