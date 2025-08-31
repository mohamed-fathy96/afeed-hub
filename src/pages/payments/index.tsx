import React, { useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useToast } from "@app/helpers/hooks/use-toast";
import { PageTitle } from "@app/ui/PageTitle";
import { RadioTab, Tabs } from "@app/ui";
import { useQueryClient } from "@tanstack/react-query";

import CreatorUserPayments from "./components/Details/CreatorUserPayments";
import UserPendingPatments from "./components/Details/UserPendingPatments";
import SubscriptionBilling from "./components/Details/SubscriptionBilling";

interface PageProps {}

const PaymentsConsole: React.FC<PageProps> = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Determine the current tab from the URL or default to 'Customers'
  const currentTab = searchParams.get("tab") || "Creator_user_payments";
  console.log(currentTab);

  // Handle tab changes and update URL
  const handleTabChange = (tabName: string) => {
    console.log("Changing tab to:", tabName);
    navigate(`?tab=${tabName}`, { replace: true });
  };

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
        <div className="w-full mb-3 col-span-12">
          <PageTitle
            title={"Payments Console"}
            breadCrumbItems={[
              {
                label: "Dashboard",
                active: false,
                path: "/dashboard",
              },
              { label: "Payments", active: true },
            ]}
          />
        </div>
        {/* User Quick Info Card */}

        <div className="lg:col-span-12">
          <Tabs variant="tabs-box" className="px-4">
            <RadioTab
              key="customers-tab"
              className="flex text-nowrap"
              name="payment_tabs"
              label="User -> Creator Payments"
              checked={currentTab === "Creator_user_payments"}
              onChange={() => handleTabChange("Creator_user_payments")}
            />
            <RadioTab
              key="pending-tab"
              name="payment_tabs"
              label="Pending Payments"
              className="flex text-nowrap"
              checked={currentTab === "Pending_payments"}
              onChange={() => handleTabChange("Pending_payments")}
            />

            <RadioTab
              key="subscription-tab"
              name="payment_tabs"
              label="Subscriptions Billing"
              className="flex text-nowrap"
              checked={currentTab === "Subscription_billing"}
              onChange={() => handleTabChange("Subscription_billing")}
            />
          </Tabs>
          {currentTab === "Creator_user_payments" && <CreatorUserPayments />}
          {currentTab === "Subscription_billing" && <SubscriptionBilling />}
          {currentTab === "Pending_payments" && <UserPendingPatments />}
        </div>
      </div>
    </>
  );
};

export default PaymentsConsole;
