import React from "react";
import { CouponService } from "@app/services/actions";
import { SectionLoader } from "@app/ui/SectionLoader";
import { useParams } from "react-router-dom";
import { useToast } from "@app/helpers/hooks/use-toast";
import { PageTitle } from "@app/ui/PageTitle";
import CouponForm from "@app/components/form/coupon/CouponForm";
import { useQuery } from "@tanstack/react-query";
import { routes } from "@app/lib/routes";

interface PageProps {}

const EditCouponPage: React.FC<PageProps> = () => {
  const params: { id?: string } = useParams();
  const toast = useToast();

  const {
    data: couponData,
    isLoading: isLoaderOpen,
    error,
  } = useQuery({
    queryKey: ["coupon", params?.id],
    queryFn: async () => {
      const res = await CouponService.getByCouponId(params?.id);
      return res.data;
    },
    enabled: !!params?.id,
  });

  // Handle error
  React.useEffect(() => {
    if (error) {
      toast.error(
        (error as any)?.response?.data?.message ??
          "Failed to get Coupon details"
      );
    }
  }, [error, toast]);

  return (
    <>
      {isLoaderOpen ? (
        <SectionLoader />
      ) : (
        <>
          <div className="w-full mb-3">
            <PageTitle
              title={`Edit ${couponData?.name} Coupon` || "Edit Coupon"}
              breadCrumbItems={[
                {
                  label: "Coupon",
                  active: true,
                  path: routes.dashboard.coupons.index,
                },
                { label: couponData?.name || "", active: true },
              ]}
            />
          </div>
          <CouponForm data={couponData} id={Number(params?.id)} />
        </>
      )}
    </>
  );
};

export default EditCouponPage;
