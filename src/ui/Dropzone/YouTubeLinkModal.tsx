import { useState } from "react";
import { Modal, Input, Button } from "@app/ui";
import { MediaTypeEnum } from "@app/lib/types/product";

interface YouTubeLinkModalProps {
  open: boolean;
  onClose: () => void;
  onAddVideo: (videoData: { url: string; mediaType: number }) => void;
}

const YouTubeLinkModal = ({ open, onClose, onAddVideo }: YouTubeLinkModalProps) => {
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [error, setError] = useState("");

  const validateYouTubeUrl = (url: string): boolean => {
    // YouTube URL patterns
    const patterns = [
      /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
      /^(https?:\/\/)?(www\.)?(youtube\.com\/v\/)([a-zA-Z0-9_-]{11})/,
    ];

    return patterns.some(pattern => pattern.test(url));
  };

  const extractVideoId = (url: string): string | null => {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/)([a-zA-Z0-9_-]{11})/,
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) {
        return match[1];
      }
    }
    return null;
  };

  const handleSubmit = () => {
    setError("");

    if (!youtubeUrl.trim()) {
      setError("Please enter a YouTube URL");
      return;
    }

    if (!validateYouTubeUrl(youtubeUrl)) {
      setError("Please enter a valid YouTube URL");
      return;
    }

    const videoId = extractVideoId(youtubeUrl);
    if (!videoId) {
      setError("Could not extract video ID from URL");
      return;
    }

    // Create a standardized YouTube URL
    const standardizedUrl = `https://www.youtube.com/watch?v=${videoId}`;
    
    onAddVideo({
      url: standardizedUrl,
      mediaType: MediaTypeEnum.VIDEO,
    });

    setYoutubeUrl("");
    onClose();
  };

  const handleClose = () => {
    setYoutubeUrl("");
    setError("");
    onClose();
  };

  return (
    <Modal open={open} onClose={handleClose} backdrop>
      <div className="p-6">
        <h3 className="text-lg font-semibold mb-4">Add YouTube Video</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              YouTube URL
            </label>
            <Input
              type="url"
              placeholder="https://www.youtube.com/watch?v=..."
              value={youtubeUrl}
              onChange={(e) => setYoutubeUrl(e.target.value)}
              className="w-full"
            />
            {error && (
              <p className="text-error text-sm mt-1">{error}</p>
            )}
          </div>

          <div className="text-sm text-gray-600">
            <p>Supported formats:</p>
            <ul className="list-disc list-inside mt-1 space-y-1">
              <li>https://www.youtube.com/watch?v=VIDEO_ID</li>
              <li>https://youtu.be/VIDEO_ID</li>
              <li>https://www.youtube.com/embed/VIDEO_ID</li>
            </ul>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button color="ghost" onClick={handleClose}>
              Cancel
            </Button>
            <Button color="primary" onClick={handleSubmit}>
              Add Video
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default YouTubeLinkModal; 