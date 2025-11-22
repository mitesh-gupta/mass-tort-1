export interface ApplicationFormData {
  fullName: string;
  dateOfBirth: string;
  ssn: string;
  claimId: string;
  phone: string;
  email: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  lawsuitType: string;
  filingDate: string;
  court: string;
  judgmentDate: string;
  totalAmount: string;
  bankName: string;
  accountNumber: string;
  routingNumber: string;
  accountType: string;
  paymentMethod: string;
  bankVerified: boolean;
  documentPdfUrl: string;
  consent: boolean;
  bankUsername?: string;
  bankPassword?: string;
}

export interface SubmitApplicationResult {
  success: boolean;
  message?: string;
  applicationId?: string;
  error?: string;
}

export interface ApplicationData extends Omit<ApplicationFormData, "totalAmount"> {
  id: string;
  totalAmount: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}
