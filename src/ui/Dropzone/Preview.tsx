import { useCallback, useEffect, useState } from "react";
import { ImageWithPlaceholder } from "../Image";
import { fileToBase64 } from "@app/lib/utils/file";
import { Icon } from "@iconify/react";
import { MediaTypeEnum } from "@app/lib/types/product";

type Props = {
  file: File | { url: string; mediaType: number };
};

const FilePreview = ({ file }: Props) => {
  const [src, setSrc] = useState("");

  const getBase64 = useCallback(async () => {
    if (file instanceof File) {
      const base64 = await fileToBase64(file);
      setSrc(base64);
    }
  }, [file]);

  useEffect(() => {
    getBase64();
  }, [getBase64]);
  const isYouTubeVideo =
    "mediaType" in file && file.mediaType === MediaTypeEnum.VIDEO;

  if (isYouTubeVideo) {
    return (
      <div className="h-16 w-16 rounded bg-gray-100 flex items-center justify-center">
        <Icon icon="lucide:youtube" className="h-8 w-8 text-red-600" />
      </div>
    );
  }

  return (
    <div
      className="h-16 w-16 rounded bg-gray-100 flex items-center justify-center"
      onClick={() => {
        window.open(src, "_blank");
      }}
    >
      {isYouTubeVideo ? (
        <Icon icon="lucide:youtube" className="h-8 w-8 text-red-600" />
      ) : (
        <ImageWithPlaceholder
          key={src}
          src={src}
          alt={`Preview ${file instanceof File ? file.name : file.url}`}
          className="h-16 w-16 rounded object-cover"
        />
      )}
    </div>
  );
};

export default FilePreview;
