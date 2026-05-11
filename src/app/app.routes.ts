import { Routes } from '@angular/router';
import { ShellComponent } from './layout/shell.component';
import { LoginComponent } from './pages/login/login.component';
import { authGuard } from './core/auth/auth.guard';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { EmployeesComponent } from './pages/employees/employees.component';
import { DepartmentsComponent } from './pages/departments/departments.component';
import { AttendanceComponent } from './pages/attendance/attendance.component';
import { RolesComponent } from './pages/roles/roles.component';
import { ReportsComponent } from './pages/reports/reports.component';
import { SettingsComponent } from './pages/settings/settings.component';

export const routes: Routes = [
	{ path: 'login', component: LoginComponent },
	{
		path: '',
		component: ShellComponent,
		canActivate: [authGuard],
		children: [
			{ path: '', pathMatch: 'full', redirectTo: 'dashboard' },
			{ path: 'dashboard', component: DashboardComponent },
			{ path: 'employees', component: EmployeesComponent },
			{ path: 'departments', component: DepartmentsComponent },
			{ path: 'attendance', component: AttendanceComponent },
			{ path: 'roles', component: RolesComponent },
			{ path: 'reports', component: ReportsComponent },
			{ path: 'settings', component: SettingsComponent },
		],
	},
	{ path: '**', redirectTo: 'dashboard' },
];
