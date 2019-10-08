export interface Kyc {
  _id?: string;
  memberId: string;
  name: string;
  accreditedInvestor?: boolean;
  email: string;
  dateOfBirth: string;
  countryOfBirth: string;
  countryOfResidency: string;
  homeAddress: string;
  saftAgreement?: string;
  photoUrls: string[];
  selfieUrls: string[];
  active?: boolean;
  lastUpdated?: Date;
  dateCreated?: Date;
}
