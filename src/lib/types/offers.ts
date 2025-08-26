export type Offer = {
  id: number;
  title: string;
  status: string;
  startDate: string; // ISO date string
  endDate: string; // ISO date string
  s3FilePath: string;
  s3FileFullPath: string;
  errorFilePath: string;
  errorFileFullPath: string;
  createdById: number;
  createdByEmail: string;
  createdByName: string;
  createdAt: string; // ISO date string
  completedAt: string; // ISO date string
  totalRecords: number;
  processedRecords: number;
  failedRecords: number;
};
