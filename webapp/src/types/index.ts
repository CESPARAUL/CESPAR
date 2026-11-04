export type Role = "RESEARCHER" | "ADMIN";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  institution?: string | null;
  avatar?: string | null;
  role: Role;
  emailVerified: boolean;
};

export type Dataset = {
  id: string;
  slug: string;
  title: string;
  category: string;
  description: string;
  coverage: string;
  format: string;
};

export type RequestStatus = "PENDING" | "APPROVED" | "REJECTED" | "FULFILLED";

export type DataRequest = {
  id: string;
  purpose: string;
  dateRangeFrom?: string | null;
  dateRangeTo?: string | null;
  status: RequestStatus;
  adminNote?: string | null;
  archived: boolean;
  createdAt: string;
  dataset: Pick<Dataset, "id" | "title" | "slug">;
};

export type MagnetometerDay = {
  date: string; // station day (YYYY-MM-DD), 24h from 05:00 UTC
  start: string;
  end: string;
  readings: number;
};

export type MagnetometerStatus = {
  latestReading: string | null;
  earliestReading: string | null;
  totalReadings: number;
  days: MagnetometerDay[];
};

export type MagnetometerPoint = {
  timestamp: string;
  x: number;
  y: number;
  z: number;
  f: number;
};

export type MagnetometerLatest = {
  day: string | null;
  start: string | null;
  end: string | null;
  hours: number | null;
  count: number;
  points: MagnetometerPoint[];
};
