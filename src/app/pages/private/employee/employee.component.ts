import { Component, inject } from '@angular/core';
import { Employee, IData } from '@core/interfaces';
import { EmployeeService } from '@core/services/employee.service';
import { ListManager } from '@core/utils/manager/list-manager';
import { Observable } from 'rxjs';
import { EmployeeListComponent } from './list/list.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-employee',
  templateUrl: 'employee.component.html',
  imports: [EmployeeListComponent, RouterLink],
})
export class EmployeeComponent extends ListManager<Employee> {
  private readonly employeeService = inject(EmployeeService);

  protected override enableInitialLoad = true;

  protected override search(params: Record<string, string>): Observable<IData<Employee[]>> {
    return this.employeeService.getEmployees(params);
  }
}
