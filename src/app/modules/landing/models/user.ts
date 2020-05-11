export interface User {
  _id?: string;

  email: string;
  walletExgAddress?: string;

  btcAdd?: string;
  ethAdd?: string;
  fabAdd?: string;
  usdtAdd?: string;

  token?: string;
  tokenExpireMin?: number;
  password?: string; // Not save.
  myPhotoUrl?: string;

  defaultMerchant?: {_id: string, name: string};
  merchants?: {_id: string, name: string}[];

  displayName?: string;
  firstName?: string;
  midName?: string;
  lastName?: string;
  sex?: string;
  birthDate?: Date;
  multiLanguage?: boolean;
  interfaceLanguageCode?: string;
  contentLanguageCode?: string;
  timeZone?: string;
  fabAddress?: string;
  fabSettled?: boolean;
  appId?: string[];

  credit?: number;
  level?: number;
  activationCode?: string;
  homePhone?: string;
  workPhone?: string;
  mobile?: string;
  workEmail?: string;

  invitationCode?: string;
  pwdResetCode?: string;
  pwdResetExpire?: Date;

  homeAddresses?: string;

  isSystemAdmin?: boolean;
  isWriteAccessAdmin?: boolean;
  manageNews?: number;
  manageEmployee?: number;
  manageFinance?: number;
  manageCoins?: number;
  personalMember?: boolean;
  dontPromptRegistBiz?: boolean;

  kyc?: number; // -1-denied, 0-no, 1-submit; 2-in porcess, 3-has problem, 100-done
  kycNote?: string;

  active?: boolean;

  lastUpdated?: Date;
  dateCreated?: Date;
}
