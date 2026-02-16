export type ClientStatus = 'ACTIVE' | 'INACTIVE' | 'ON_LEAVE' | 'TERMINATED';
export type Gender = 'MALE' | 'FEMALE' | 'OTHER' | 'NOT_SPECIFIED';
export type MaritalStatus =
  | 'SINGLE'
  | 'MARRIED'
  | 'DIVORCED'
  | 'WIDOWED'
  | 'SEPARATED'
  | 'NOT_SPECIFIED';

export type IdentificationType =
  | 'CEDULA'
  | 'PASSPORT'
  | 'RESIDENCY_CARD'
  | 'DRIVER_LICENSE'
  | 'OTHER';

export type EmailType = 'WORK' | 'PERSONAL' | 'OTHER';
export type PhoneType = 'MOBILE' | 'HOME' | 'WORK' | 'OTHER';

export type AddressType = 'HOME' | 'WORK' | 'SHIPPING' | 'TEMPORARY' | 'OTHER';

export type EmploymentType = 'FULL_TIME' | 'PART_TIME' | 'CONTRACTOR' | 'INTERN' | 'TEMP';
export type WorkMode = 'ONSITE' | 'REMOTE' | 'HYBRID';

export type Shift = 'DAY' | 'NIGHT' | 'MIXED';
export type WeekDay = 'MON' | 'TUE' | 'WED' | 'THU' | 'FRI' | 'SAT' | 'SUN';

export type LeaveType = 'MATERNITY' | 'PATERNITY' | 'SICK' | 'VACATION' | 'UNPAID' | 'OTHER';

export type BankAccountType = 'SAVINGS' | 'CHECKING' | 'OTHER';

export type DocumentType = 'CONTRACT' | 'ID' | 'LEAVE_APPROVAL' | 'NDA' | 'CERTIFICATION' | 'OTHER';

export type DocumentStatus = 'PENDING' | 'SIGNED' | 'VERIFIED' | 'APPROVED' | 'REJECTED';

export type AssetType = 'LAPTOP' | 'BADGE' | 'HEADSET' | 'PHONE' | 'MONITOR' | 'OTHER';

export type SystemAccess = 'NONE' | 'STANDARD' | 'POWER' | 'ADMIN';

export interface GeoPoint {
  lat: number;
  lng: number;
}

export interface Identification {
  type: IdentificationType;
  number: string;
  issuedCountry: string; // ISO-2/ISO-3 (ej: "DO")
  expiresAt: string | null; // YYYY-MM-DD o null
}

export interface ClientPersonalInfo {
  firstName: string;
  middleName: string | null;
  lastName: string;
  secondLastName: string | null;
  preferredName?: string | null;
  gender: Gender;
  maritalStatus: MaritalStatus;
  birthDate: string; // YYYY-MM-DD
  nationality: string; // ISO (ej: "DO")
  identification: Identification;
}

export interface ClientEmail {
  type: EmailType;
  value: string;
  isPrimary: boolean;
}

export interface ClientPhone {
  type: PhoneType;
  countryCode: string; // ej "+1"
  number: string;
  ext: string | null;
  isPrimary: boolean;
  verifiedAt?: string | null; // ISO
}

export interface ClientContactInfo {
  emails: ClientEmail[];
  phones: ClientPhone[];
  preferredLanguage?: string; // ej "es"
  timeZone?: string; // IANA (ej "America/Santo_Domingo")
}

export interface ClientAddress {
  id: string;
  type: AddressType;
  label?: string | null;
  isPrimary: boolean;

  line1: string;
  line2: string | null;

  sector?: string | null;
  city: string;
  state?: string | null;
  postalCode?: string | null;
  country: string; // ISO

  geo?: GeoPoint | null;

  validFrom?: string | null; // YYYY-MM-DD
  validTo?: string | null; // YYYY-MM-DD
  notes?: string | null;
}

export interface EmploymentLocation {
  siteId?: string | null;
  name: string;
  country: string; // ISO
}

export interface WorkSchedule {
  weeklyHours: number;
  shift: Shift;
  workDays: WeekDay[];
}

export interface ClientLeave {
  type: LeaveType;
  startDate: string; // YYYY-MM-DD
  endDate?: string | null; // YYYY-MM-DD
  notes?: string | null;
}

export interface ClientEmploymentInfo {
  company: string;
  department: string;
  team?: string | null;
  position: string;
  jobLevel?: string | null;

  employmentType: EmploymentType;
  workMode: WorkMode;

  hireDate: string; // YYYY-MM-DD
  terminationDate?: string | null;

  managerId?: string | null;

  location: EmploymentLocation;
  schedule: WorkSchedule;

  leave?: ClientLeave | null;
}

export interface BankAccount {
  id: string;
  bankName: string;
  accountType: BankAccountType;
  accountNumberMasked: string; // ej "****4321"
  isPrimary: boolean;
}

export interface ClientCompensation {
  currency: string; // ISO-4217 (ej "DOP")
  baseSalary: number;
  payFrequency: 'WEEKLY' | 'BIWEEKLY' | 'MONTHLY' | 'YEARLY';

  bonusEligible: boolean;
  bonusTargetPercent?: number;

  bankAccounts: BankAccount[];
}

export interface HealthPlan {
  provider: string;
  planName: string;
  memberId?: string | null;
}

export interface PensionPlan {
  provider: string;
  memberId?: string | null;
}

export interface ClientBenefits {
  healthPlan?: HealthPlan | null;
  pension?: PensionPlan | null;
}

export interface EmergencyContact {
  name: string;
  relationship: 'SPOUSE' | 'PARENT' | 'CHILD' | 'SIBLING' | 'FRIEND' | 'OTHER';
  phone: {
    countryCode: string;
    number: string;
  };
  email?: string | null;
  isPrimary: boolean;
}

export interface ClientDocument {
  type: DocumentType;
  fileName: string;
  status: DocumentStatus;

  signedAt?: string | null; // ISO
  verifiedAt?: string | null; // ISO
  approvedAt?: string | null; // ISO
}

export interface ClientAsset {
  type: AssetType;
  tag: string;
  model?: string | null;
  assignedAt?: string | null; // YYYY-MM-DD
}

export interface SystemPermission {
  name: string;
  access: SystemAccess;
}

export interface ClientPermissions {
  roles: string[];
  systems: SystemPermission[];
}

export interface AuditInfo {
  createdAt: string; // ISO
  createdBy: string;
  updatedAt?: string | null; // ISO
  updatedBy?: string | null;
}

export interface Client {
  id: string;
  clientCode: string;
  status: ClientStatus;

  personal: ClientPersonalInfo;
  contact: ClientContactInfo;

  addresses: ClientAddress[];

  employment: ClientEmploymentInfo;
  compensation: ClientCompensation;

  benefits?: ClientBenefits | null;

  emergencyContacts?: EmergencyContact[];

  documents?: ClientDocument[];
  assets?: ClientAsset[];

  permissions?: ClientPermissions;

  audit: AuditInfo;
}
