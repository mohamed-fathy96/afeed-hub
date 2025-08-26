import { useToast } from "@app/helpers/hooks/use-toast";
import { convertQueryParamsIntoObject } from "@app/lib/helpers/constants/helpers";
import { PaginationResponse } from "@app/lib/types/global";
import { ITransactionsParamsUrl } from "@app/lib/types/users";
import { formatToLocalTime } from "@app/lib/utils/formatDate";
import { UserService } from "@app/services/actions";
import { Badge, Card, CardBody } from "@app/ui";
import { DataGridTable } from "@app/ui/Datagrid";
import Pagination from "@app/ui/Datagrid/Pagination";
import { SectionLoader } from "@app/ui/SectionLoader";
import React from "react";
import { useLocation } from "react-router-dom";
import FilterSection from "./FilterSection";
import { twMerge } from "tailwind-merge";
type Props = {
  id: number;
};

const columns = [
  {
    title: "ID",
    field: "id",
  },
  {
    title: "Amount",
    render: (rowData: { amount: number }) => {
      return `${rowData?.amount} QAR`;
    },
  },
  {
    title: "Balance",
    render: (rowData: { balance: number }) => {
      return `${rowData?.balance} QAR`;
    },
  },
  {
    title: "Type",
    render: (rowData: { isCredit: boolean }) => {
      return (
        <Badge color={rowData?.isCredit ? "success" : "error"}>
          {rowData?.isCredit ? "Credit" : "Debit"}
        </Badge>
      );
    },
  },
  {
    title: "Type",
    field: "transactionType",
  },
  {
    title: "Status",
    render: (rowData: { status: string }) => {
      const statusColor =
        rowData?.status === "Success"
          ? "success"
          : rowData?.status === "Pending"
          ? "warning"
          : "error";
      return <Badge color={statusColor}>{rowData?.status}</Badge>;
    },
  },
  {
    title: "Remarks",
    field: "remarks",
  },
  {
    title: "Created At",
    render: (rowData: { createdAt: string }) => {
      return formatToLocalTime(rowData?.createdAt);
    },
  },
];

const Transactions = ({ id }: Props) => {
  const location = useLocation();
  const [userBalance, setUserBalance] = React.useState<{
    balance: number;
    currency: string;
  }>({ balance: 0, currency: "QAR" });
  const [params, setParams] = React.useState<ITransactionsParamsUrl>({
    endDate: "",
    searchKey: "",
    startDate: "",
    pageNumber: 1,
    pageSize: 50,
  });
  const [transactions, setTransactions] =
    React.useState<PaginationResponse<any>>();
  const [loading, setLoading] = React.useState(true);
  const toast = useToast();
  const fetchData = async (params?: ITransactionsParamsUrl) => {
    setLoading(true);
    try {
      const res = await UserService.getUserTransactions(params, id);
      setTransactions(res.data);
      setLoading(false);
    } catch (err: any) {
      setLoading(false);
      toast.error(err?.response?.data?.message ?? "Failed to get transactions");
    }
  };

  const getUserBalance = async () => {
    try {
      const res = await UserService.getUserBalance(id);
      setUserBalance(res.data);
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? "Failed to get user balance");
    }
  };
  React.useEffect(() => {
    fetchData(params);
    getUserBalance();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  React.useEffect(() => {
    const queryParams: Partial<ITransactionsParamsUrl> = location.search
      ? convertQueryParamsIntoObject(location.search)
      : params;

    const updatedParams: ITransactionsParamsUrl = {
      ...params,
      pageNumber: Number(queryParams?.pageNumber) || 1,
      searchKey: queryParams?.searchKey || "",
      startDate: queryParams?.startDate || "",
      endDate: queryParams?.endDate || "",
    };
    setParams(updatedParams);
    fetchData(updatedParams);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  return (
    <div>
      <div className="w-full mb-3 "></div>
      {loading ? (
        <SectionLoader />
      ) : (
        <Card>
          <CardBody className="bg-base-100">
            <div
              className={twMerge(
                "font-bold px-1",
                userBalance?.balance <= 0 ? "text-red-500" : "text-green-500"
              )}
            >
              {" "}
              Current Balance: {userBalance?.balance} {userBalance?.currency}
            </div>
            <FilterSection
              params={params}
              setParams={setParams}
              userId={id}
              onTransactionSuccess={() => {
                fetchData(params);
                getUserBalance();
              }}
            />

            <DataGridTable columns={columns} data={transactions?.data || []} />
            <Pagination
              pageCount={transactions?.totalPages || 1}
              pageNumber={transactions?.pageNumber || 1}
              pageSize={params.pageSize}
              setParams={setParams}
              params={params}
            />
          </CardBody>
        </Card>
      )}
    </div>
  );
};
export default Transactions;
