/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { catchError, of, tap } from 'rxjs';
import { EmployeeService } from '@core/services';
import { WeekDay } from '@core/interfaces';
import { ToastrService } from 'ngx-toastr';
import {
  AddressForm,
  AddressType,
  BankAccountForm,
  BankAccountType,
  ControlMap,
  EmailForm,
  EmailType,
  EmployeeEditForm,
  EmployeeStatus,
  EmploymentType,
  Gender,
  IdentificationType,
  iso2or3Validator,
  MaritalStatus,
  minArrayLength,
  PayFrequency,
  PhoneForm,
  PhoneType,
  requireOnePrimary,
  Shift,
  WorkMode,
} from '../common';

@Component({
  selector: 'app-employee-create',
  templateUrl: 'create.component.html',
  imports: [ReactiveFormsModule],
})
export class EmployeeCreateComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly employeeService = inject(EmployeeService);
  private readonly toastr = inject(ToastrService);

  loading = signal(true);
  saving = signal(false);
  notFound = signal(false);

  // Options usadas en el HTML
  statusOptions = ['ACTIVE', 'INACTIVE', 'ON_LEAVE', 'TERMINATED'] as const;
  genderOptions = ['MALE', 'FEMALE', 'OTHER', 'NOT_SPECIFIED'] as const;
  maritalOptions = [
    'SINGLE',
    'MARRIED',
    'DIVORCED',
    'WIDOWED',
    'SEPARATED',
    'NOT_SPECIFIED',
  ] as const;
  idTypeOptions = ['CEDULA', 'PASSPORT', 'RESIDENCY_CARD', 'DRIVER_LICENSE', 'OTHER'] as const;
  employmentTypeOptions = ['FULL_TIME', 'PART_TIME', 'CONTRACTOR', 'INTERN', 'TEMP'] as const;
  workModeOptions = ['ONSITE', 'REMOTE', 'HYBRID'] as const;
  shiftOptions = ['DAY', 'NIGHT', 'MIXED'] as const;
  weekDayOptions = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'] as const;
  bankAccountTypeOptions = ['SAVINGS', 'CHECKING', 'OTHER'] as const;

  // ✅ Typed Form (esto arregla el error del template)
  form: EmployeeEditForm = this.fb.group({
    employeeCode: this.fb.control('', [Validators.required, Validators.maxLength(30)]),
    status: this.fb.control<EmployeeStatus>('ACTIVE', [Validators.required]),

    personal: this.fb.group({
      firstName: this.fb.control('', [Validators.required, Validators.maxLength(60)]),
      lastName: this.fb.control('', [Validators.required, Validators.maxLength(60)]),
      preferredName: this.fb.control<string | null>(null),

      gender: this.fb.control<Gender>('NOT_SPECIFIED', [Validators.required]),
      maritalStatus: this.fb.control<MaritalStatus>('NOT_SPECIFIED', [Validators.required]),

      birthDate: this.fb.control('', [Validators.required]),
      nationality: this.fb.control('', [Validators.required, iso2or3Validator()]),

      identification: this.fb.group({
        type: this.fb.control<IdentificationType>('CEDULA', [Validators.required]),
        number: this.fb.control('', [Validators.required, Validators.maxLength(50)]),
        issuedCountry: this.fb.control('', [Validators.required, iso2or3Validator()]),
        expiresAt: this.fb.control<string | null>(null),
      }),
    }),

    contact: this.fb.group({
      preferredLanguage: this.fb.control<string | null>(null),
      timeZone: this.fb.control<string | null>(null),

      emails: this.fb.array<EmailForm>([], [minArrayLength(1), requireOnePrimary()]),
      phones: this.fb.array<PhoneForm>([], [minArrayLength(1), requireOnePrimary()]),
    }),

    employment: this.fb.group({
      company: this.fb.control('', [Validators.required]),
      department: this.fb.control('', [Validators.required]),
      team: this.fb.control<string | null>(null),
      position: this.fb.control('', [Validators.required]),

      employmentType: this.fb.control<EmploymentType>('FULL_TIME', [Validators.required]),
      workMode: this.fb.control<WorkMode>('ONSITE', [Validators.required]),
      hireDate: this.fb.control('', [Validators.required]),
      terminationDate: this.fb.control<string | null>(null),

      location: this.fb.group({
        name: this.fb.control('', [Validators.required]),
        country: this.fb.control('', [Validators.required, iso2or3Validator()]),
      }),

      schedule: this.fb.group({
        weeklyHours: this.fb.control(40, [
          Validators.required,
          Validators.min(1),
          Validators.max(80),
        ]),
        shift: this.fb.control<Shift>('DAY', [Validators.required]),
        workDays: this.fb.control<WeekDay[]>(
          ['MON', 'TUE', 'WED', 'THU', 'FRI'],
          [Validators.required],
        ),
      }),
    }),

    compensation: this.fb.group({
      currency: this.fb.control('DOP', [Validators.required, Validators.maxLength(3)]),
      baseSalary: this.fb.control(0, [Validators.required, Validators.min(0)]),
      payFrequency: this.fb.control<PayFrequency>('MONTHLY', [Validators.required]),
      bonusEligible: this.fb.control(false),
      bonusTargetPercent: this.fb.control<number | null>(null),

      bankAccounts: this.fb.array<BankAccountForm>([]),
    }),

    addresses: this.fb.array<AddressForm>([], [minArrayLength(1), requireOnePrimary()]),
  }) as unknown as EmployeeEditForm;

  // Getters usados por tu HTML (tal cual)
  get contactGroup() {
    return this.form.controls.contact;
  }
  get emails() {
    return this.contactGroup.controls.emails;
  }
  get phones() {
    return this.contactGroup.controls.phones;
  }
  get addresses() {
    return this.form.controls.addresses;
  }
  get bankAccounts() {
    return this.form.controls.compensation.controls.bankAccounts;
  }

  constructor() {
    // Mantienes checkbox en emails/phones: si marcan varios, dejamos solo 1
    this.emails.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.normalizePrimary(this.emails));
    this.phones.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.normalizePrimary(this.phones));
  }

  /** -------- Row builders (typed) -------- */
  private emailGroup(v?: any): EmailForm {
    return this.fb.group({
      type: this.fb.control<EmailType>(v?.type ?? 'WORK', [Validators.required]),
      value: this.fb.control<string>(v?.value ?? '', [Validators.required, Validators.email]),
      isPrimary: this.fb.control<boolean>(!!v?.isPrimary),
    }) as EmailForm;
  }

  private phoneGroup(v?: any): PhoneForm {
    return this.fb.group({
      type: this.fb.control<PhoneType>(v?.type ?? 'MOBILE', [Validators.required]),
      countryCode: this.fb.control<string>(v?.countryCode ?? '+1', [
        Validators.required,
        Validators.pattern(/^\+\d{1,4}$/),
      ]),
      number: this.fb.control<string>(v?.number ?? '', [
        Validators.required,
        Validators.pattern(/^[0-9]{7,15}$/),
      ]),
      ext: this.fb.control<string | null>(v?.ext ?? null),
      isPrimary: this.fb.control<boolean>(!!v?.isPrimary),
    }) as PhoneForm;
  }

  private addressGroup(v?: any): AddressForm {
    return this.fb.group({
      id: this.fb.control<string>(v?.id ?? crypto.randomUUID()),
      type: this.fb.control<AddressType>(v?.type ?? 'HOME', [Validators.required]),
      label: this.fb.control<string | null>(v?.label ?? null),
      isPrimary: this.fb.control<boolean>(!!v?.isPrimary),

      line1: this.fb.control<string>(v?.line1 ?? '', [
        Validators.required,
        Validators.maxLength(120),
      ]),
      line2: this.fb.control<string | null>(v?.line2 ?? null),

      city: this.fb.control<string>(v?.city ?? '', [Validators.required]),
      state: this.fb.control<string | null>(v?.state ?? null),
      postalCode: this.fb.control<string | null>(v?.postalCode ?? null),
      country: this.fb.control<string>(v?.country ?? '', [Validators.required, iso2or3Validator()]),
    }) as AddressForm;
  }

  private bankAccountGroup(v?: any): BankAccountForm {
    return this.fb.group({
      id: this.fb.control<string>(v?.id ?? crypto.randomUUID()),
      bankName: this.fb.control<string>(v?.bankName ?? '', [Validators.required]),
      accountType: this.fb.control<BankAccountType>(v?.accountType ?? 'SAVINGS', [
        Validators.required,
      ]),
      accountNumberMasked: this.fb.control<string>(v?.accountNumberMasked ?? '', [
        Validators.required,
      ]),
      isPrimary: this.fb.control<boolean>(!!v?.isPrimary),
    }) as BankAccountForm;
  }

  /** -------- Primary helpers -------- */
  private setPrimary<T extends ControlMap & { isPrimary: FormControl<boolean> }>(
    arr: FormArray<FormGroup<T>>,
    index: number,
  ) {
    arr.controls.forEach((g, i) =>
      g.controls.isPrimary.setValue(i === index, { emitEvent: false }),
    );
    arr.markAsDirty();
    arr.updateValueAndValidity({ emitEvent: false });
  }

  // usado por tu HTML (radio primary en direcciones)
  setPrimaryAddress(index: number) {
    this.setPrimary(this.addresses, index);
  }

  private normalizePrimary<T extends ControlMap & { isPrimary: FormControl<boolean> }>(
    arr: FormArray<FormGroup<T>>,
  ) {
    const indexes = arr.controls
      .map((g, i) => (g.controls.isPrimary.value ? i : -1))
      .filter((i) => i >= 0);

    if (indexes.length <= 1) {
      arr.updateValueAndValidity({ emitEvent: false });
      return;
    }

    const keep = indexes[indexes.length - 1];
    this.setPrimary(arr, keep);
  }

  /** -------- Arrays actions (HTML) -------- */
  addEmail() {
    this.emails.push(this.emailGroup({ isPrimary: this.emails.length === 0 }));
    this.emails.updateValueAndValidity();
  }

  removeEmail(i: number) {
    if (this.emails.length <= 1) return;
    const wasPrimary = this.emails.at(i).controls.isPrimary.value;
    this.emails.removeAt(i);
    if (wasPrimary && this.emails.length) this.setPrimary(this.emails, 0);
    this.emails.updateValueAndValidity();
  }

  addPhone() {
    this.phones.push(this.phoneGroup({ isPrimary: this.phones.length === 0 }));
    this.phones.updateValueAndValidity();
  }

  removePhone(i: number) {
    if (this.phones.length <= 1) return;
    const wasPrimary = this.phones.at(i).controls.isPrimary.value;
    this.phones.removeAt(i);
    if (wasPrimary && this.phones.length) this.setPrimary(this.phones, 0);
    this.phones.updateValueAndValidity();
  }

  addAddress() {
    this.addresses.push(this.addressGroup({ isPrimary: this.addresses.length === 0 }));
    this.addresses.updateValueAndValidity();
  }

  removeAddress(i: number) {
    if (this.addresses.length <= 1) return;
    const wasPrimary = this.addresses.at(i).controls.isPrimary.value;
    this.addresses.removeAt(i);
    if (wasPrimary && this.addresses.length) this.setPrimary(this.addresses, 0);
    this.addresses.updateValueAndValidity();
  }

  addBank() {
    this.bankAccounts.push(this.bankAccountGroup());
    this.bankAccounts.updateValueAndValidity();
  }

  removeBank(i: number) {
    this.bankAccounts.removeAt(i);
    this.bankAccounts.updateValueAndValidity();
  }

  /** -------- Error helpers (HTML) -------- */
  hasError(ctrl: AbstractControl | null | undefined, code: string) {
    return !!ctrl && ctrl.touched && ctrl.hasError(code);
  }

  arrayError(arr: AbstractControl | null | undefined, code: string) {
    return !!arr && arr.touched && arr.hasError(code);
  }

  markAllTouched() {
    this.form.markAllAsTouched();
    this.emails.markAsTouched();
    this.phones.markAsTouched();
    this.addresses.markAsTouched();
    this.bankAccounts.markAsTouched();
  }

  submit() {
    if (this.form.invalid) {
      this.markAllTouched();
      return;
    }

    this.form.disable();

    this.saving.set(true);
    const payload = this.form.getRawValue();

    this.employeeService
      .createEmployee(payload as any)
      .pipe(
        tap(() => {
          this.toastr.success('Empleado creado correctamente', 'Success');
          this.saving.set(false);
          this.router.navigate(['../lista'], { relativeTo: this.route });
        }),
        catchError(() => {
          this.saving.set(false);
          return of(null);
        }),
      )
      .subscribe();
  }

  cancel() {
    return this.router.navigate(['../'], { relativeTo: this.route });
  }

  // usado por tu HTML para togglear días
  toggleDay(current: WeekDay[], day: WeekDay): WeekDay[] {
    const set = new Set(current);
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    set.has(day) ? set.delete(day) : set.add(day);
    return Array.from(set) as WeekDay[];
  }
}
