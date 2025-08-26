import {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import { twMerge } from "tailwind-merge";
import FilePreview from "./Preview";
import { Button, Divider, Toast } from "@app/ui";
import { getFileSize, reduceImageSize } from "@app/lib/utils/file";
import { ImageWithPlaceholder } from "../Image";
import useDeviceDetect from "@app/helpers/hooks/use-device-detect";
import { useToast } from "@app/helpers/hooks/use-toast";
import { MediaTypeEnum } from "@app/lib/types/product";
import YouTubeLinkModal from "./YouTubeLinkModal";
// DnD imports
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import update from "immutability-helper";
import { Icon } from "@iconify/react";

type InputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "multiple" | "value" | "onChange" | "disabled" | "id"
>;

type BaseProps = {
  className?: string;
  id?: string;
  label?: string;
  draggable?: boolean;
  dropRef?: React.RefObject<HTMLDivElement>;
  direction?: "horizontal" | "vertical";
  inputProps?: InputProps;
  helperText?: string;
  preview?: boolean;
  /**
   * Capture button only appears in mobile devices
   */
  type?: ("upload" | "capture")[];
  /**
   * Size in MB, default is 2MB
   */
  maxSize?: number;
  disabled?: boolean;
  error?: string | boolean;
  previewExistFiles?: {
    id: number;
    path: string;
    mediaType?: number;
    sort?: number;
  }[];
  onRemoveExistFile?: (fileId: number) => void;
  isLoading?: boolean;
  onSortPreviewExistFiles?: (
    sortedFiles: {
      id: number;
      path: string;
      mediaType: number;
      sort: number;
    }[]
  ) => void;
  allowPeriority?: boolean;
  onHandleThumbnail?: (fileId: number) => void;
  showYouTubeButton?: boolean;
  onAddYouTubeVideo?: (videoData: {
    youtubeUrl: string;
    mediaType: number;
  }) => void;
};

type DropzoneProps =
  | {
      showYouTubeButton?: boolean;
      multiple: true;
      value?: File[];
      onChange: (files: File[]) => void;
    }
  | {
      showYouTubeButton?: boolean;
      multiple?: never;
      value?: File;
      onChange: (file?: File) => void;
    };

type Props = BaseProps & DropzoneProps;

// DnD item type
const DND_TYPE = "previewExistFile";

const Dropzone = forwardRef<HTMLInputElement, Props>(function Dropzone(
  {
    className,
    id,
    draggable = true,
    dropRef,
    direction = "horizontal",
    helperText,
    inputProps,
    label,
    preview = true,
    type,
    maxSize = 2,
    error,
    value,
    onChange,
    multiple,
    disabled,
    previewExistFiles,
    onRemoveExistFile,
    isLoading = false,
    onSortPreviewExistFiles,
    allowPeriority = false,
    onHandleThumbnail,
    showYouTubeButton = false,
    onAddYouTubeVideo,
  },
  ref
) {
  const toaster = useToast();

  const { isMobile } = useDeviceDetect();
  const dropzoneRef = useRef<HTMLDivElement>(null);
  const rootRef = dropRef || dropzoneRef;
  const inputRef = useRef<HTMLInputElement>(null);
  const captureInputRef = useRef<HTMLInputElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const safeTypes = type?.length ? type : ["upload"];
  const fallbackId = useId();
  const uniqueId = id || fallbackId;

  // YouTube modal state
  const [isYouTubeModalOpen, setIsYouTubeModalOpen] = useState(false);

  useImperativeHandle(ref, () => ({
    ...(inputRef.current as HTMLInputElement),
    click: () => {
      inputRef.current?.click();
    },
    focus: () => {
      buttonRef.current?.focus();
    },
  }));

  // DnD state for previewExistFiles
  const [sortedPreviewFiles, setSortedPreviewFiles] = useState(
    previewExistFiles || []
  );
  const sortedPreviewFilesRef = useRef(sortedPreviewFiles);
  useEffect(() => {
    setSortedPreviewFiles(previewExistFiles || []);
  }, [previewExistFiles]);
  useEffect(() => {
    sortedPreviewFilesRef.current = sortedPreviewFiles;
  }, [sortedPreviewFiles]);

  const movePreviewFile = (dragIndex: number, hoverIndex: number) => {
    setSortedPreviewFiles((prev) =>
      update(prev, {
        $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, prev[dragIndex]],
        ],
      })
    );
  };

  const handleSortEnd = () => {
    if (onSortPreviewExistFiles) {
      // Use the latest value from the ref
      const withSort = sortedPreviewFilesRef.current.map((file, idx) => ({
        ...file,
        sort: idx,
        mediaType: file.mediaType || 0,
      }));
      onSortPreviewExistFiles(withSort);
    }
  };

  // DnD Draggable item for previewExistFiles
  const DraggablePreviewExistFile = ({
    file,
    index,
    allowPeriority,
    handlePeriorityAsTop,
  }: {
    file: any;
    index: number;
    allowPeriority: boolean;
    handlePeriorityAsTop: (fileId: number) => void;
  }) => {
    const ref = useRef<HTMLDivElement>(null);
    const [, drop] = useDrop({
      accept: DND_TYPE,
      hover(item: any) {
        if (item.index !== index) {
          movePreviewFile(item.index, index);
          item.index = index;
        }
      },
    });
    const [{ isDragging }, drag] = useDrag({
      type: DND_TYPE,
      item: { index },
      end: handleSortEnd,
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    });
    drag(drop(ref));
    const onClickFile = (path: string) => {
      window.open(path, "_blank");
    };
    return (
      <div
        ref={ref}
        style={{ opacity: isDragging ? 0.5 : 1, cursor: "move" }}
        className="gap-2 flex items-center justify-between border border-base-300 p-2 rounded-md"
      >
        <div className="flex max-w-[90%] items-center gap-4">
          {file.mediaType === MediaTypeEnum.VIDEO ? (
            <div
              key={file.id}
              role="button"
              tabIndex={file.id}
              aria-label="YouTube Video"
              onClick={() => onClickFile(file.path)}
              className="h-16 w-16 rounded bg-gray-100 flex items-center justify-center"
            >
              <Icon icon="lucide:youtube" className="h-8 w-8 text-red-600" />
            </div>
          ) : (
            <ImageWithPlaceholder
              role="button"
              tabIndex={file.id}
              aria-label="Image"
              onClick={() => onClickFile(file.path)}
              src={file.path}
              alt={`preview ${file.id}`}
              className="h-16 w-16 rounded object-cover"
            />
          )}
          <div className="line-clamp-1">
            <p className="truncate">
              {file.id} - (
              {file?.mediaType
                ? file?.mediaType === MediaTypeEnum.IMAGE
                  ? "Image"
                  : file?.mediaType === MediaTypeEnum.VIDEO
                  ? "Video"
                  : "Icon"
                : "Image"}
              )
            </p>
          </div>
        </div>
        <div className="shrink-0 flex items-center gap-2">
          {allowPeriority && (
            <Button
              color={file?.isThumbnail ? "success" : "primary"}
              size="xs"
              type="button"
              onClick={() =>
                !file?.isThumbnail ? handlePeriorityAsTop(file?.id) : null
              }
            >
              <Icon
                icon={file?.isThumbnail ? "lucide:image" : "lucide:image"}
                className="h-3 w-3"
              />
              {file?.isThumbnail ? "Thumbnail Image" : "Mark as Thumbnail"}
            </Button>
          )}
          <Button
            color="error"
            shape="circle"
            size="xs"
            type="button"
            onClick={() => handleRemoveExistFile(file?.id)}
          >
            <Icon icon="lucide:x" className="h-3 w-3" />
          </Button>
        </div>
      </div>
    );
  };

  const handleThumbnail = async (fileId: number) => {
    if (onHandleThumbnail) {
      onHandleThumbnail(fileId);
    }
  };

  const handleAcceptFile = (file: File) => {
    if (!inputProps?.accept) return true;
    const acceptedTypes = inputProps.accept.replace(/\s+/g, "").split(",");
    const allImages =
      file.type.startsWith("image/") && acceptedTypes.includes("image/*");
    const allAudio =
      file.type.startsWith("audio/") && acceptedTypes.includes("audio/*");
    const allVideo =
      file.type.startsWith("video/") && acceptedTypes.includes("video/*");
    return (
      allImages || allAudio || allVideo || acceptedTypes.includes(file.type)
    );
  };

  const handleFiles = useCallback(
    async (selectedFiles: FileList) => {
      const selected = Array.from(selectedFiles);
      const addedFiles: File[] = [];
      for (const file of selected) {
        const accepted = handleAcceptFile(file);
        if (accepted) {
          const maxBytes = maxSize * 1024 * 1024;
          const reducedSize = await reduceImageSize(file, maxBytes);
          if (reducedSize.size < maxBytes) {
            addedFiles.push(reducedSize);
          } else {
            toaster.error("file_too_large");
          }
        }
      }

      if (multiple) {
        const currentFiles = value || [];
        onChange(currentFiles.concat(addedFiles));
      } else {
        onChange(addedFiles[0]);
      }

      if (inputRef.current) {
        inputRef.current.value = "";
      }
    },
    // eslint-disable-next-line
    [value]
  );

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      handleFiles(event.target.files);
    }
  };

  const previewFiles = useMemo(() => {
    if (!value) return [];

    return multiple ? value : [value];
  }, [multiple, value]);

  const handleRemoveFile = (file: File) => {
    if (multiple) {
      const updatedFiles = (value || []).filter((f) => f !== file);
      onChange(updatedFiles);
    } else {
      onChange(undefined);
    }
  };
  const handleRemoveExistFile = (fileId: number) => {
    if (onRemoveExistFile) {
      onRemoveExistFile(fileId);
    }
  };

  const handleAddYouTubeVideo = (videoData: {
    url: string;
    mediaType: number;
  }) => {
    if (onAddYouTubeVideo) {
      onAddYouTubeVideo({
        youtubeUrl: videoData.url,
        mediaType: videoData.mediaType,
      });
    }
  };

  useEffect(() => {
    if (rootRef?.current && draggable) {
      const element = rootRef.current;

      const handleDragOver = (event: DragEvent) => {
        event.preventDefault();
      };

      const handleDragEnter = (event: DragEvent) => {
        const e = event as DragEvent & React.DragEvent<HTMLDivElement>;
        e.currentTarget.classList.add("z-50");
        e.currentTarget.classList.remove("z-0");
        rootRef.current?.setAttribute("data-dragging", "true");
      };

      const handleDragLeave = (event: DragEvent) => {
        const e = event as DragEvent & React.DragEvent<HTMLDivElement>;
        e.currentTarget.classList.remove("z-50");
        e.currentTarget.classList.add("z-0");
        rootRef.current?.removeAttribute("data-dragging");
      };

      const handleDrop = (event: DragEvent) => {
        const e = event as DragEvent & React.DragEvent<HTMLDivElement>;
        e.preventDefault();
        if (e.dataTransfer.files) {
          handleFiles(e.dataTransfer.files);
        }
      };

      element.addEventListener("dragover", handleDragOver);
      element.addEventListener("dragenter", handleDragEnter);
      element.addEventListener("dragleave", handleDragLeave);
      element.addEventListener("drop", handleDrop);

      return () => {
        element.removeEventListener("dragover", handleDragOver);
        element.removeEventListener("dragenter", handleDragEnter);
        element.removeEventListener("dragleave", handleDragLeave);
        element.removeEventListener("drop", handleDrop);
      };
    }
  }, [draggable, handleFiles, rootRef]);

  return (
    <div className={twMerge("space-y-1", className)}>
      <Toast />
      {label && <h2 className="font-medium">{label}</h2>}
      <div
        ref={rootRef}
        data-type={direction}
        data-dragging={false}
        data-error={!!error}
        aria-disabled={disabled}
        className="rounded-md aria-disabled:border-input-disabled data-[error=true]:border-error border-base-content bg-black/5 gap-2 p-4 xs:flex-row data-[dragging=true]:bg-body-level-1 group flex w-full flex-col items-center border border-dashed aria-disabled:cursor-not-allowed data-[type=vertical]:flex-col"
      >
        <div className="gap-2 flex items-center">
          {safeTypes.includes("upload") && (
            <label htmlFor={uniqueId}>
              <input
                ref={inputRef}
                id={uniqueId}
                disabled={disabled}
                type="file"
                multiple={multiple}
                className="hidden"
                {...inputProps}
                onChange={handleFileChange}
              />
              <Button
                ref={buttonRef}
                color="primary"
                type="button"
                disabled={disabled || isLoading}
                onClick={() => inputRef.current?.click()}
                loading={isLoading}
              >
                <Icon icon="lucide:upload" className="h-4 w-4" />
                <p className="font-md">Upload</p>
              </Button>
            </label>
          )}
          {showYouTubeButton && (
            <Button
              color="error"
              type="button"
              disabled={isLoading || disabled}
              onClick={() => setIsYouTubeModalOpen(true)}
              loading={isLoading}
            >
              <Icon icon="lucide:youtube" className="h-4 w-4" />
              <p className="font-md">YouTube Video</p>
            </Button>
          )}
          {isMobile && safeTypes.includes("capture") && (
            <label htmlFor={`${uniqueId}-capture`} aria-label="Capture">
              <input
                ref={captureInputRef}
                id={`${uniqueId}-capture`}
                className="hidden"
                disabled={disabled}
                type="file"
                accept="image/*"
                capture="user"
                onChange={handleFileChange}
              />
              <Button
                shape="square"
                ref={buttonRef}
                type="button"
                disabled={disabled || isLoading}
                onClick={() => captureInputRef.current?.click()}
              >
                <Icon icon="lucide:camera" className="h-4 w-4" />
                <p className="font-medium">Capture</p>
              </Button>
            </label>
          )}
        </div>
        <p className="text-black font-medium">
          <span className="hidden group-data-[dragging=true]:block">
            Drop here
          </span>
          <span className="block text-base-content group-data-[dragging=true]:hidden">
            Drag and drop files here
          </span>
        </p>
      </div>

      {(helperText || inputProps?.accept) && (
        <p>
          {helperText ||
            "Accepted files: " + inputProps?.accept?.replace(/[/*]/g, "") ||
            ""}
        </p>
      )}

      {typeof error === "string" && !!error && (
        <p className="text-error">{error}</p>
      )}
      {preview && previewFiles.length > 0 && (
        <div className="space-y-2 pt-4">
          <p className="text-md font-body font-extrabold">New Files uploaded</p>
          <ul className="space-y-2">
            {previewFiles.map((file) => (
              <div
                key={file.name}
                className="gap-2 flex items-center justify-between border border-black/10 p-2 rounded-md"
              >
                <div className="flex max-w-[90%] items-center gap-4">
                  <FilePreview file={file} />
                  <div className="line-clamp-1">
                    <p className="truncate">
                      {(file as any).youtubeUrl ? "YouTube Video" : file.name}
                    </p>
                    <p>
                      {(file as any).youtubeUrl
                        ? (file as any).youtubeUrl
                        : `(${getFileSize(file.size)})`}
                    </p>
                  </div>
                </div>
                <div className="shrink-0">
                  <Button
                    shape="circle"
                    color="error"
                    size="xs"
                    onClick={() => handleRemoveFile(file)}
                  >
                    <Icon icon="lucide:x" className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </ul>
        </div>
      )}
      <Divider className="mt-2" />
      {previewExistFiles && previewExistFiles.length > 0 && (
        <div className="space-y-2 pt-4">
          <p className="text-md font-body font-extrabold">Uploaded Files</p>
          <ul className="space-y-2">
            {onSortPreviewExistFiles ? (
              <DndProvider backend={HTML5Backend}>
                {sortedPreviewFiles?.map((file, idx) => (
                  <DraggablePreviewExistFile
                    key={file.id}
                    file={file}
                    index={idx}
                    allowPeriority={allowPeriority}
                    handlePeriorityAsTop={handleThumbnail}
                  />
                ))}
              </DndProvider>
            ) : (
              previewExistFiles?.map((file) => (
                <div
                  key={file.id}
                  className="gap-2 flex items-center justify-between border border-base-300 p-2 rounded-md"
                >
                  <div className="flex max-w-[90%] items-center gap-4">
                    {file.mediaType === MediaTypeEnum.VIDEO ? (
                      <Icon
                        icon="lucide:youtube"
                        className="h-8 w-8 text-red-600"
                      />
                    ) : (
                      <ImageWithPlaceholder
                        src={file?.path}
                        alt={`preview ${file.id}`}
                        className="h-16 w-16 rounded object-cover"
                      />
                    )}
                    <div className="line-clamp-1">
                      <p className="truncate">
                        {file?.id} - (
                        {file?.mediaType
                          ? file?.mediaType === MediaTypeEnum.IMAGE
                            ? "Image"
                            : file?.mediaType === MediaTypeEnum.VIDEO
                            ? "Video"
                            : "Icon"
                          : "Image"}
                        )
                      </p>
                    </div>
                  </div>
                  <div className="shrink-0">
                    <Button
                      color="error"
                      shape="circle"
                      size="xs"
                      type="button"
                      onClick={() => handleRemoveExistFile(file?.id)}
                    >
                      <Icon icon="lucide:x" className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </ul>
        </div>
      )}

      <YouTubeLinkModal
        open={isYouTubeModalOpen}
        onClose={() => setIsYouTubeModalOpen(false)}
        onAddVideo={handleAddYouTubeVideo}
      />
    </div>
  );
});

export default Dropzone;
