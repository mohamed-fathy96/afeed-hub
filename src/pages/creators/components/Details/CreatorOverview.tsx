import React from "react";
import { Card, CardBody } from "@app/ui";
import { Icon } from "@app/ui/Icon";
import { formatToLocalTime } from "@app/lib/utils/formatDate";
import { CreatorDetails } from "@app/lib/types/creators";

interface CreatorOverviewProps {
  creator: CreatorDetails;
}

const CreatorOverview: React.FC<CreatorOverviewProps> = ({ creator }) => {
  const formatCurrency = (amount: number) => {
    return `${amount?.toLocaleString()} KD`;
  };

  return (
    <div className="space-y-6">
      {/* Financial Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Last Payout Amount */}
        <Card className="bg-white border border-gray-200">
          <CardBody className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-base-content mb-1">
                  Last Payout Amount
                </p>
                <p className="text-2xl font-semibold text-green-600">
                  {formatCurrency(creator.metrics?.lastPayoutAmount)}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {formatToLocalTime(creator.metrics?.lastPayoutDate)}
                </p>
              </div>
              <div className="p-2 bg-green-100 rounded-lg">
                <Icon
                  icon="lucide:dollar-sign"
                  className="w-5 h-5 text-green-600"
                />
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Pending Payout Amount */}
        <Card className="bg-white border border-gray-200">
          <CardBody className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm mb-1">Pending Payout Amount</p>
                <p className="text-2xl font-semibold text-blue-600">
                  {formatCurrency(creator.metrics?.pendingPayoutAmount)}
                </p>
              </div>
              <div className="p-2 bg-blue-100 rounded-lg">
                <Icon
                  icon="lucide:credit-card"
                  className="w-5 h-5 text-blue-600"
                />
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Revenue (30 days) */}
        <Card className="bg-white border border-gray-200">
          <CardBody className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-base-content mb-1">
                  Revenue (30 days)
                </p>
                <p className="text-2xl font-semibold">
                  {formatCurrency(creator.metrics?.revenue30d || 0)}
                </p>
              </div>
              <div className="p-2 bg-green-100 rounded-lg">
                <Icon
                  icon="lucide:trending-up"
                  className="w-5 h-5 text-green-600"
                />
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Total Products */}
        <Card className="bg-white border border-gray-200">
          <CardBody className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm  mb-1">Total Products</p>
                <p className="text-2xl font-semibold">
                  {creator.metrics?.totalProducts}
                </p>
              </div>
              <div className="p-2 bg-blue-100 rounded-lg">
                <Icon icon="lucide:package" className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </CardBody>
        </Card>
        <Card className="bg-white border border-gray-200">
          <CardBody className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm mb-1">Total Customers</p>
                <p className="text-2xl font-semibold text-base-content">
                  {creator.metrics?.totalCustomers}
                </p>
              </div>
              <div className="p-2 bg-purple-100 rounded-lg">
                <Icon icon="lucide:users" className="w-5 h-5 text-purple-600" />
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Payments History */}
      <Card className="bg-white border border-gray-200">
        <CardBody className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibol">Payments History</h3>
            <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
              View Full History
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-medium ">
                    Payout Date
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium ">
                    Amount
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium ">
                    Payment Method
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium">
                    Triggered By
                  </th>
                </tr>
              </thead>
              <tbody>
                {creator?.paymentsHistory
                  ?.slice(0, 3)
                  ?.map((payment, index) => (
                    <tr
                      key={index}
                      className="border-b border-gray-100 hover:bg-base-100"
                    >
                      <td className="py-3 px-4 text-sm ">
                        {formatToLocalTime(payment?.payoutDate)}
                      </td>
                      <td className="py-3 px-4 text-sm font-medium text-green-600">
                        {formatCurrency(payment.amount)}
                      </td>
                      <td className="py-3 px-4 text-sm ">
                        {payment?.paymentMethod}
                      </td>
                      <td className="py-3 px-4 text-sm ">
                        {payment?.triggeredBy}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>

      {/* Creator Information */}
      <Card className="bg-base-100">
        <CardBody className="p-6">
          <h3 className="text-lg font-semibold  mb-4">Creator Information</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Phone Number</label>
                  <p className="text-sm mt-1">{creator.profile.phone_number}</p>
                </div>
              </div>
            </div>

            <div>
              <div className="space-y-4">
                {/* <div>
                  <label className="text-sm font-medium text-gray-600">
                    Niche
                  </label>
                  <p className="text-sm text-gray-900 mt-1">
                    {creator.profile.niche}
                  </p>
                </div> */}
                <div>
                  <label className="text-sm font-medium">
                    Member Since
                  </label>
                  <p className="text-sm mt-1">
                    {formatToLocalTime(creator.subscription.dueDate)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default CreatorOverview;
