/* eslint-disable @typescript-eslint/no-unused-vars */
import { DecimalPipe, NgClass } from '@angular/common';
import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Client } from '@core/interfaces';

@Component({
  selector: 'app-client-list',
  templateUrl: 'list.component.html',
  imports: [NgClass, DecimalPipe, RouterLink],
})
export class ClientListComponent {
  clients = input<Client[]>([]);
  isAdmin = input<boolean>(false);

  // En tu componente (ejemplo mínimo)
  openMenuId: string | null = null;

  getPrimaryEmail(e: Client): string {
    if (!e.contact?.emails?.length) return '—';

    return e.contact.emails.find((m) => m.isPrimary)?.value || e.contact.emails[0].value;
  }

  getPrimaryPhone(e: Client): string {
    if (!e.contact?.phones?.length) return '—';

    const p = e.contact.phones.find((x) => x.isPrimary) || e.contact.phones[0];

    return `${p.countryCode} ${p.number}${p.ext ? ' ext ' + p.ext : ''}`;
  }

  getPrimaryAddress(e: Client) {
    return e.addresses?.find((a) => a.isPrimary) || e.addresses?.[0];
  }

  toggleRowMenu(id: string) {
    this.openMenuId = this.openMenuId === id ? null : id;
  }

  viewClientDetail(e: Client) {
    this.openMenuId = null;
    // router.navigate(['/clients', e.id]);
  }

  editClient(e: Client) {
    this.openMenuId = null;
    // router.navigate(['/clients', e.id, 'edit']);
  }

  deactivateClient(e: Client) {
    this.openMenuId = null;
    // acción...
  }
}
