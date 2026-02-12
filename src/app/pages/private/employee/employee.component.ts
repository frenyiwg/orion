import { Component, inject } from '@angular/core';
import { IData } from '@core/interfaces';
import { EmployeeService } from '@core/services/employee.service';
import { ListManager } from '@core/utils/manager/list-manager';
import { Observable } from 'rxjs';
import { EmployeeListComponent } from './list/list.component';

@Component({
  selector: 'employee',
  templateUrl: 'employee.component.html',
  imports: [EmployeeListComponent],
})
export class EmployeeComponent extends ListManager<any> {
  private readonly employeeService = inject(EmployeeService);

  protected override enableInitialLoad: boolean = true;

  protected override search(params: Record<string, any>): Observable<IData<any>> {
    return this.employeeService.getEmployees(params);
  }
}
