import { twMerge } from "tailwind-merge";

type Props = {
  currency?: string;
  /** Price before discount */
  originalPrice: number;
  /** Price after discount */
  discountPrice?: number;
  className?: string;
  priceClassName?: string;
  currencyClassName?: string;
  zeroAsFree?: boolean;
};

export const CurrencyPriceLabel = ({
  discountPrice,
  originalPrice,
  className,
  currency,
  priceClassName,
  currencyClassName,
  zeroAsFree,
}: Props) => {
  const hasDiscount =
    typeof discountPrice === "number" &&
    discountPrice >= 0 &&
    discountPrice < originalPrice;

  const price = hasDiscount ? discountPrice : originalPrice;
  const symbol = currency?.toUpperCase() || "QAR";

  return (
    <div className={twMerge("group flex items-center gap-2", className)}>
      {hasDiscount ? (
        <div className="flex items-center gap-0.5 line-through opacity-50">
          <span className={priceClassName}>{originalPrice}</span>
          <span className={currencyClassName}>{symbol}</span>
        </div>
      ) : null}

      {price <= 0 && zeroAsFree ? (
        <div className="text-green-500">Free</div>
      ) : (
        <div className="flex shrink-0 items-center gap-0.5">
          <span className={priceClassName}>{price}</span>
          <span className={currencyClassName}>{symbol}</span>
        </div>
      )}
    </div>
  );
};
