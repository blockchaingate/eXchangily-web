export enum IcotxStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  DELETED = 'deleted'
}

export interface Payment {
  payMethod: string;
  appTokenQty: number;
  paidAmount: number;
  transitId: string;
  payRate: number;
  amountUSD: number;
  specialDiscount?: number;
}

export const IcotxStatuses = [
  'pending',
  'completed',
  'deleted'
];

export const IcotxColours = {
  [IcotxStatus.PENDING]: '#979797',
  [IcotxStatus.COMPLETED]: '#06ae00',
  [IcotxStatus.COMPLETED]: '#ff0000'
};

export interface Icotx {
  _id?: string;
  memberId?: string;
  parentId?: string;
  appId?: string;
  email?: string;
  name?: string;
  btcAddress?: string;
  ethAddress?: string;
  fabAddress?: string;
  paid?: boolean;
  payment: Array<Payment>;
  totalPaid?: number;
  payMethod: string;
  totalAppTokens?: number;
  discountRate?: number;
  erc20Issued?: Boolean;
  erc20Return?: Boolean;
  notes?: string;
  status?: string;
  active?: boolean;
  paymentDate?: Date;
  lastUpdated?: Date;
  dateCreated?: Date;
}

export interface IcotxSorted {
  pending: Array<Icotx>;
  completed: Array<Icotx>;
  deleted: Array<Icotx>;
}
