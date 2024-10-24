import React, { useState } from "react";
import axios from "axios";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

const StoryUpload = () => {
  const [media, setMedia] = useState(null);
  const [type, setType] = useState("");

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setMedia(file);
    setType(file.type.startsWith("video") ? "video" : "image");
  };

  const handleStoryUpload = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("media", media);
    formData.append("type", type);

    try {
      const response = await axios.post("/api/story/uploadStory", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      console.log("Story uploaded:", response.data);
    } catch (error) {
      console.error("Error uploading story:", error);
    }
  };

  return (
    <form onSubmit={handleStoryUpload}>
      <div className="flex gap-2">
      <Input type="file" accept="image/*,video/*" onChange={handleFileChange} required className="w-56" />
      <Button type="submit">Upload Story</Button>
      </div>
    </form>
  );
};

export default StoryUpload;
