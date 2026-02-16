import { Component, inject } from '@angular/core';
import { Client, IData } from '@core/interfaces';
import { ListManager } from '@core/utils/manager/list-manager';
import { Observable } from 'rxjs';
import { ClientListComponent } from './list/list.component';
import { RouterLink } from '@angular/router';
import { ClientService } from '@core/services/client.service';

@Component({
  selector: 'app-client',
  templateUrl: 'client.component.html',
  imports: [ClientListComponent, RouterLink],
})
export class ClientComponent extends ListManager<Client> {
  private readonly clientService = inject(ClientService);

  protected override enableInitialLoad = true;

  protected override search(params: Record<string, string>): Observable<IData<Client[]>> {
    return this.clientService.getClients(params);
  }
}
