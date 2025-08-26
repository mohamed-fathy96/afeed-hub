import React from "react";
import { SectionLoader } from "@app/ui/SectionLoader";
import { DataGridTable } from "@app/ui/Datagrid";
import { formatToLocalTime } from "@app/lib/utils/formatDate";
import { CurrencyPriceLabel } from "@app/ui/CurrencyPriceLabel";
import { Card, CardBody } from "@app/ui";
import { useOrderActions } from "@app/lib/hooks/useOrderActions";

interface TransactionsProps {
  id: number;
}

const Transactions: React.FC<TransactionsProps> = ({ id }) => {
  const { getTransactions } = useOrderActions(undefined, id?.toString());
  const columns = [
    {
      title: "ID",
      field: "id",
    },
    {
      title: "User ID",
      field: "userId",
    },
    {
      title: "Amount",
      field: "amount",
      render: (rowData: any) => {
        return (
          <div className="flex items-center gap-2">
            <CurrencyPriceLabel originalPrice={rowData?.amount} />
          </div>
        );
      },
    },
    {
      title: "Created At",
      render: (rowData: any) => (
        <div>{formatToLocalTime(rowData?.createdAt)}</div>
      ),
    },
    {
      title: "Payment Method",
      render: (rowData: any) => (
        <div>
          {rowData?.paymentMethod === 0 ? (
            <span>Wallet</span>
          ) : rowData?.paymentMethod === 1 ? (
            <span>Card</span>
          ) : rowData?.paymentMethod === 2 ? (
            <span>Cash</span>
          ) : rowData?.paymentMethod === 3 ? (
            <span>Bank Transfer</span>
          ) : (
            <span>Unknown</span>
          )}
        </div>
      ),
    },

    {
      title: "Transaction Direction",
      render: (rowData: any) => (
        <div>
          {rowData?.transactionDirection === 0 ? (
            <span>In</span>
          ) : rowData?.transactionType === 1 ? (
            <span>Out</span>
          ) : (
            <span>Unknown</span>
          )}
        </div>
      ),
    },
    {
      title: "Refund Reason",
      field: "refundReason",
    },
  ];

  return (
    <Card className="flex flex-col space-y-4 mt-5 flex-wrap bg-base-100">
      <CardBody>
        {getTransactions.isLoading ? (
          <SectionLoader />
        ) : (
          <>
            <>
              <DataGridTable
                key="transactions-table"
                data={getTransactions.data || []}
                columns={columns}
                title="Transactions"
                options={{
                  actionsColumnIndex: -1,
                  grouping: false,
                  columnsButton: false,
                  showTitle: true,
                }}
              />
            </>
          </>
        )}
      </CardBody>
    </Card>
  );
};

export default Transactions;
