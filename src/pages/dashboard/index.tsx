import { useEffect, useState } from "react";
import { DashboardService } from "../../services/actions/DashboardService";
import { useToast } from "@app/helpers/hooks/use-toast";
import { SectionLoader } from "@app/ui/SectionLoader/SectionLoader";

const DashboardPage = (): JSX.Element => {
  const toast = useToast();
  const [data, setData] = useState<{ url: string } | null>(null);
  const [error, setError] = useState(false);

  const fetchData = async () => {
    try {
      const res = await DashboardService.getMetabase({});
      if (res && res.data) {
        setData(res.data);
      } else {
        throw new Error("Invalid response from server.");
      }
    } catch (error: any) {
      setError(true);
      toast.error(
        error?.response?.data?.message || "Failed to fetch dashboard data."
      );
    }
  };

  useEffect(() => {
    // fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-red-500">Failed to load dashboard.</p>
        <button
          className="btn btn-primary mt-4"
          onClick={() => {
            setError(false);
            fetchData();
          }}
        >
          Retry
        </button>
      </div>
    );
  }

  // if (!data?.url) {
  //   return <SectionLoader />;
  // }

  return (
    <div>
      <iframe
        src={data?.url.replace("http://", "https://")}
        title="Dashboard"
        width={200}
        height={1000}
        className="max-w-full w-full min-h-screen"
        sandbox="allow-same-origin allow-scripts allow-forms"
      />
    </div>
  );
};

export default DashboardPage;
