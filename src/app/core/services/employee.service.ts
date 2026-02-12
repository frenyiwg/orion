import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Employee, IData } from '@core/interfaces';
import { map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class EmployeeService {
  private readonly http = inject(HttpClient);

  getEmployees(params?: Record<string, string>) {
    return this.http.get<IData<Employee[]>>('datasource/employees/employees.json', { params });
  }

  getEmployeeById(id: string) {
    return this.http
      .get<IData<Employee[]>>('datasource/employees/employees.json')
      .pipe(map((res) => res.data.find((emp: Employee) => emp.id === id)));
  }

  updateEmployee(id: string) {
    return this.http
      .get<IData<Employee[]>>(`datasource/employees/employees.json`)
      .pipe(map((res) => res.data.find((emp: Employee) => emp.id === id)));
  }

  createEmployee() {
    return this.http.get<boolean>(`datasource/employees/employees.json`).pipe(map(() => true));
  }
}
