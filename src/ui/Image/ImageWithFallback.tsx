import { ImgHTMLAttributes, forwardRef } from "react";
import initialSrc from "@app/assets/images/placeholder_img.webp";

type Props = ImgHTMLAttributes<HTMLImageElement> & {
  fallbackSrc?: string;
};

const ImageWithFallback = forwardRef<HTMLImageElement, Props>(
  function ImageWithFallback({ fallbackSrc, src, alt = "", ...props }, ref) {
    const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
      e.currentTarget.onerror = null; // Prevent infinite loop if fallback fails
      e.currentTarget.srcset = ""; // Clear `srcset` if present
      e.currentTarget.src = fallbackSrc || initialSrc || "";
    };

    return (
      <img
        {...props}
        ref={ref}
        src={src || fallbackSrc || initialSrc || ""}
        alt={alt}
        onError={handleError}
      />
    );
  }
);

export default ImageWithFallback;
