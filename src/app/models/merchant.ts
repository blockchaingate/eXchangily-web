export class Merchant {
  _id?: string;
  name: string;
  nameLan?: string[];
  parentId?: string;
  // businessType: { type: String, enum: ['', 'Corperation', 'Trade company', 'Manufacturer', 'Retail', 'Store', 'Other'] },
  businessType?: string;

  createMemberId: string;
  logoUrl?: string;
  countryCode?: string;

  registryOrganization?: string;
  registryNumber?: string;
  licenseNumber?: string;
  dateRegistered?: Date;

  phone?: string;
  fax?: string;
  email?: string;
  website?: string;
  introduction?: string;
  imType?: string;
  imNumber?: string;

  addressId?: string;

  useSystemExchangeRate?: { type: boolean, default: true };
  supplierInfoRequired?: { type: boolean, default: true };
  productVerifyRequired?: { type: boolean, default: true };

  merchantLevel?: number;
  memberFeePeriod?: number; // number of months
  memberFeeRate?: number;
  memberFeeCurrency?: string;
  memberFeeNexPayDate?: Date;
  transactionFeeRate?: number;
  transactionFeeMinimum?: number;
  payaplAcct?: string;

  license?: string;
  numEmployee?: number;

  verified?: boolean;
  dateVerified?: Date;
  verifierId?: string;
  verifyComment?: string;

  credit?: { type: number, default: 0 };

  active?: { type: boolean, default: false };
  approved?: { type: boolean, default: false };

  // OTC
  otcApproved?: { type: boolean, default: false };
  otcRating?: number;
  otcMerchantClass?: number; // 1~9.

  lastUpdated?: Date;
  dateCreated?: { type: Date };

  constructor(name: string, createMemberId: string) {
    this.name = name;
    this.createMemberId = createMemberId;
  }
}
