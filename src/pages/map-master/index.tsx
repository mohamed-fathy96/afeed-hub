import React, { useState, useEffect } from "react";
import { Box, CircularProgress } from "@mui/material";
import CommonMapMaster from "@app/ui/MapMaster/Map";
import { MapMasterService } from "@app/services/actions";

const MapMaster: React.FC = () => {
  const [loading, setLoading] = useState(true);
  // Updated Store interface using API keys
  interface Store {
    storeId: number;
    storeName: string;
    coordinates: { lat: number; lng: number }[];
  }

  const [storeList, setStoreList] = useState<Store[]>([]);

  const fetchStoreDetails = async () => {
    try {
      setLoading(true);
      const res = await MapMasterService.getStoresWithPolygon();

      // Use API data as is
      setStoreList(res?.data);
    } catch (error: any) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStoreDetails();
  }, []);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <CommonMapMaster storeList={storeList} onStoreSave={fetchStoreDetails} />
  );
};

export default MapMaster;
