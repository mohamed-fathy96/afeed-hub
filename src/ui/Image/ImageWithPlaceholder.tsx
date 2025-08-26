import { ImgHTMLAttributes } from "react";
import ImageWithFallback from "./ImageWithFallback";
import initialSrc from "@app/assets/images/logo.png";
export type Props = ImgHTMLAttributes<HTMLImageElement> & {
  fallbackSrc?: string;
  loaderSrc?: string;
  ratio?: "1x1" | "3x1";
};

/**
 * Just a regular image component
 * with unified placeholder + fallback
 */
const ImageWithPlaceholder = ({
  width,
  height,
  alt,
  loaderSrc,
  ...rest
}: Props) => {
  const safeWidth = width || 800;
  const safeHeight = height || 800;

  return (
    <ImageWithFallback
      {...rest}
      src={rest.src || loaderSrc || initialSrc}
      width={safeWidth}
      height={safeHeight}
      alt={alt}
      data-loaded="false"
      onLoad={(e) => {
        const isLoaded = e.currentTarget.dataset.loaded === "true";
        if (!isLoaded) {
          e.currentTarget.srcset = "";
          e.currentTarget.dataset.loaded = "true";
          e.currentTarget.src = rest.src || "";
        }
        rest.onLoad?.(e);
      }}
    />
  );
};

export default ImageWithPlaceholder;
