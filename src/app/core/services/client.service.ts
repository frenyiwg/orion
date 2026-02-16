import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Client, IData } from '@core/interfaces';
import { map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ClientService {
  private readonly http = inject(HttpClient);

  getClients(params?: Record<string, string>) {
    return this.http.get<IData<Client[]>>('datasource/clients/clients.json', { params });
  }

  getClientById(id: string) {
    return this.http
      .get<IData<Client[]>>('datasource/clients/clients.json')
      .pipe(map((res) => res.data.find((emp: Client) => emp.id === id)));
  }

  updateClient(id: string) {
    return this.http
      .get<IData<Client[]>>(`datasource/clients/clients.json`)
      .pipe(map((res) => res.data.find((emp: Client) => emp.id === id)));
  }

  createClient() {
    return this.http.get<boolean>(`datasource/clients/clients.json`).pipe(map(() => true));
  }
}
