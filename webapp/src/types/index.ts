export type Role = "RESEARCHER" | "ADMIN";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  institution?: string | null;
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

export type Bulletin = {
  id: string;
  title: string;
  date: string;
  pdf: string;
};

export type RequestStatus = "PENDING" | "APPROVED" | "REJECTED" | "FULFILLED";

export type DataRequest = {
  id: string;
  purpose: string;
  dateRangeFrom?: string | null;
  dateRangeTo?: string | null;
  status: RequestStatus;
  adminNote?: string | null;
  createdAt: string;
  dataset: Pick<Dataset, "id" | "title" | "slug">;
};
