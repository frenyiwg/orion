import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
  ValidationErrors,
} from '@angular/forms';
import { WeekDay } from '@core/interfaces';

/** ---------------- Validators ---------------- */
export function minArrayLength(min: number) {
  return (control: AbstractControl): ValidationErrors | null => {
    const arr = control as FormArray;
    return (arr?.length ?? 0) >= min ? null : { minArrayLength: { min, actual: arr?.length ?? 0 } };
  };
}

export function requireOnePrimary() {
  return (control: AbstractControl): ValidationErrors | null => {
    const arr = control as FormArray;
    const values = (arr?.value ?? []) as { isPrimary?: boolean }[];
    const count = values.filter((v) => !!v?.isPrimary).length;
    return count === 1 ? null : { requireOnePrimary: { expected: 1, actual: count } };
  };
}

export function iso2or3Validator() {
  return (control: AbstractControl): ValidationErrors | null => {
    const v = (control.value ?? '').toString().trim();
    if (!v) return null;
    return /^[A-Za-z]{2,3}$/.test(v) ? null : { isoCountry: true };
  };
}

/** ---------------- Typed Form Models ---------------- */
export type EmployeeStatus = 'ACTIVE' | 'INACTIVE' | 'ON_LEAVE' | 'TERMINATED';
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
export type BankAccountType = 'SAVINGS' | 'CHECKING' | 'OTHER';
export type PayFrequency = 'WEEKLY' | 'BIWEEKLY' | 'MONTHLY' | 'YEARLY';

export type EmailForm = FormGroup<{
  type: FormControl<EmailType>;
  value: FormControl<string>;
  isPrimary: FormControl<boolean>;
}>;

export type PhoneForm = FormGroup<{
  type: FormControl<PhoneType>;
  countryCode: FormControl<string>;
  number: FormControl<string>;
  ext: FormControl<string | null>;
  isPrimary: FormControl<boolean>;
}>;

export type AddressForm = FormGroup<{
  id: FormControl<string>;
  type: FormControl<AddressType>;
  label: FormControl<string | null>;
  isPrimary: FormControl<boolean>;
  line1: FormControl<string>;
  line2: FormControl<string | null>;
  city: FormControl<string>;
  state: FormControl<string | null>;
  postalCode: FormControl<string | null>;
  country: FormControl<string>;
}>;

export type BankAccountForm = FormGroup<{
  id: FormControl<string>;
  bankName: FormControl<string>;
  accountType: FormControl<BankAccountType>;
  accountNumberMasked: FormControl<string>;
  isPrimary: FormControl<boolean>;
}>;

export type EmployeeEditForm = FormGroup<{
  employeeCode: FormControl<string>;
  status: FormControl<EmployeeStatus>;

  personal: FormGroup<{
    firstName: FormControl<string>;
    lastName: FormControl<string>;
    preferredName: FormControl<string | null>;
    gender: FormControl<Gender>;
    maritalStatus: FormControl<MaritalStatus>;
    birthDate: FormControl<string>;
    nationality: FormControl<string>;

    identification: FormGroup<{
      type: FormControl<IdentificationType>;
      number: FormControl<string>;
      issuedCountry: FormControl<string>;
      expiresAt: FormControl<string | null>;
    }>;
  }>;

  contact: FormGroup<{
    preferredLanguage: FormControl<string | null>;
    timeZone: FormControl<string | null>;
    emails: FormArray<EmailForm>;
    phones: FormArray<PhoneForm>;
  }>;

  employment: FormGroup<{
    company: FormControl<string>;
    department: FormControl<string>;
    team: FormControl<string | null>;
    position: FormControl<string>;
    employmentType: FormControl<EmploymentType>;
    workMode: FormControl<WorkMode>;
    hireDate: FormControl<string>;
    terminationDate: FormControl<string | null>;

    location: FormGroup<{
      name: FormControl<string>;
      country: FormControl<string>;
    }>;

    schedule: FormGroup<{
      weeklyHours: FormControl<number>;
      shift: FormControl<Shift>;
      workDays: FormControl<WeekDay[]>;
    }>;
  }>;

  compensation: FormGroup<{
    currency: FormControl<string>;
    baseSalary: FormControl<number>;
    payFrequency: FormControl<PayFrequency>;
    bonusEligible: FormControl<boolean>;
    bonusTargetPercent: FormControl<number | null>;
    bankAccounts: FormArray<BankAccountForm>;
  }>;

  addresses: FormArray<AddressForm>;
}>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ControlMap = Record<string, AbstractControl<any, any>>;
