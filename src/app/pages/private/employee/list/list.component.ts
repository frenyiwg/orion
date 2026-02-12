import { DecimalPipe, NgClass } from '@angular/common';
import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Employee } from '@core/interfaces';

@Component({
  selector: 'employee-list',
  templateUrl: 'list.component.html',
  imports: [NgClass, DecimalPipe, RouterLink],
})
export class EmployeeListComponent {
  employees = input<Employee[]>([]);

  // En tu componente (ejemplo mínimo)
  openMenuId: string | null = null;

  getPrimaryEmail(e: Employee): string {
    if (!e.contact?.emails?.length) return '—';

    return e.contact.emails.find((m) => m.isPrimary)?.value || e.contact.emails[0].value;
  }

  getPrimaryPhone(e: Employee): string {
    if (!e.contact?.phones?.length) return '—';

    const p = e.contact.phones.find((x) => x.isPrimary) || e.contact.phones[0];

    return `${p.countryCode} ${p.number}${p.ext ? ' ext ' + p.ext : ''}`;
  }

  getPrimaryAddress(e: Employee) {
    return e.addresses?.find((a) => a.isPrimary) || e.addresses?.[0];
  }

  toggleRowMenu(id: string) {
    this.openMenuId = this.openMenuId === id ? null : id;
  }

  viewEmployeeDetail(e: Employee) {
    this.openMenuId = null;
    // router.navigate(['/employees', e.id]);
  }

  editEmployee(e: Employee) {
    this.openMenuId = null;
    // router.navigate(['/employees', e.id, 'edit']);
  }

  deactivateEmployee(e: Employee) {
    this.openMenuId = null;
    // acción...
  }
}
