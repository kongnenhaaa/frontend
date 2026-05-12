import { AttendanceRecord } from '../api/attendance.api';
import { Department } from '../api/departments.api';
import { Employee } from '../api/employees.api';
import { Role } from '../api/roles.api';
import { Setting } from '../api/settings.api';

const DEMO_MODE_KEY = 'corehr_demo_mode';
const DEMO_DATA_KEY = 'corehr_demo_data';

export interface DemoData {
  departments: Department[];
  employees: Employee[];
  roles: Role[];
  attendance: AttendanceRecord[];
  settings: Setting[];
}

const newId = () => `demo-${Math.random().toString(36).slice(2, 10)}`;

const buildSeed = (): DemoData => {
  const deptPeople: Department = {
    id: newId(),
    name: 'People Ops',
    description: 'HR and culture',
    isActive: true,
  };
  const deptEng: Department = {
    id: newId(),
    name: 'Engineering',
    description: 'Product development',
    isActive: true,
  };
  const deptFin: Department = {
    id: newId(),
    name: 'Finance',
    description: 'Accounting and payroll',
    isActive: true,
  };
  const deptSales: Department = {
    id: newId(),
    name: 'Sales',
    description: 'Sales and Marketing',
    isActive: true,
  };
  const deptIT: Department = {
    id: newId(),
    name: 'IT Support',
    description: 'IT Infrastructure',
    isActive: true,
  };

  const emp1: Employee = {
    id: newId(),
    code: 'EMP-001',
    firstName: 'Linh',
    lastName: 'Tran',
    email: 'linh.tran@corehr.com',
    title: 'HR Specialist',
    status: 'active',
    department: { id: deptPeople.id, name: deptPeople.name },
  };
  const emp2: Employee = {
    id: newId(),
    code: 'EMP-002',
    firstName: 'Minh',
    lastName: 'Nguyen',
    email: 'minh.nguyen@corehr.com',
    title: 'Frontend Engineer',
    status: 'on_leave',
    department: { id: deptEng.id, name: deptEng.name },
  };
  const emp3: Employee = {
    id: newId(),
    code: 'EMP-003',
    firstName: 'Hoa',
    lastName: 'Le',
    email: 'hoa.le@corehr.com',
    title: 'Sales Executive',
    status: 'active',
    department: { id: deptSales.id, name: deptSales.name },
  };
  const emp4: Employee = {
    id: newId(),
    code: 'EMP-004',
    firstName: 'Tuan',
    lastName: 'Pham',
    email: 'tuan.pham@corehr.com',
    title: 'Backend Engineer',
    status: 'active',
    department: { id: deptEng.id, name: deptEng.name },
  };
  const emp5: Employee = {
    id: newId(),
    code: 'EMP-005',
    firstName: 'Mai',
    lastName: 'Hoang',
    email: 'mai.hoang@corehr.com',
    title: 'IT Specialist',
    status: 'terminated',
    department: { id: deptIT.id, name: deptIT.name },
  };
  const emp6: Employee = {
    id: newId(),
    code: 'EMP-006',
    firstName: 'Trung',
    lastName: 'Kien',
    email: 'trung.kien@corehr.com',
    title: 'Sales Associate',
    status: 'active',
    department: { id: deptSales.id, name: deptSales.name },
  };
  const emp7: Employee = {
    id: newId(),
    code: 'EMP-007',
    firstName: 'Thao',
    lastName: 'Nhi',
    email: 'thao.nhi@corehr.com',
    title: 'HR Generalist',
    status: 'active',
    department: { id: deptPeople.id, name: deptPeople.name },
  };
  const emp8: Employee = {
    id: newId(),
    code: 'EMP-008',
    firstName: 'Bao',
    lastName: 'Long',
    email: 'bao.long@corehr.com',
    title: 'Sysadmin',
    status: 'on_leave',
    department: { id: deptIT.id, name: deptIT.name },
  };
  const emp9: Employee = {
    id: newId(),
    code: 'EMP-009',
    firstName: 'Quang',
    lastName: 'Huy',
    email: 'quang.huy@corehr.com',
    title: 'QA Engineer',
    status: 'active',
    department: { id: deptEng.id, name: deptEng.name },
  };
  const emp10: Employee = {
    id: newId(),
    code: 'EMP-010',
    firstName: 'Thu',
    lastName: 'Trang',
    email: 'thu.trang@corehr.com',
    title: 'Accountant',
    status: 'active',
    department: { id: deptFin.id, name: deptFin.name },
  };

  const today = new Date().toISOString().slice(0, 10);
  const attendance1: AttendanceRecord = {
    id: newId(),
    date: today,
    status: 'present',
    employee: {
      id: emp1.id,
      firstName: emp1.firstName,
      lastName: emp1.lastName,
      email: emp1.email,
    },
  };
  const attendance2: AttendanceRecord = {
    id: newId(),
    date: today,
    status: 'absent',
    employee: {
      id: emp2.id,
      firstName: emp2.firstName,
      lastName: emp2.lastName,
      email: emp2.email,
    },
  };
  const attendance3: AttendanceRecord = {
    id: newId(),
    date: today,
    status: 'late',
    employee: {
      id: emp3.id,
      firstName: emp3.firstName,
      lastName: emp3.lastName,
      email: emp3.email,
    },
  };
  const attendance4: AttendanceRecord = {
    id: newId(),
    date: today,
    status: 'present',
    employee: {
      id: emp4.id,
      firstName: emp4.firstName,
      lastName: emp4.lastName,
      email: emp4.email,
    },
  };
  const attendance5: AttendanceRecord = {
    id: newId(),
    date: today,
    status: 'present',
    employee: {
      id: emp6.id,
      firstName: emp6.firstName,
      lastName: emp6.lastName,
      email: emp6.email,
    },
  };
  const attendance6: AttendanceRecord = {
    id: newId(),
    date: today,
    status: 'present',
    employee: {
      id: emp7.id,
      firstName: emp7.firstName,
      lastName: emp7.lastName,
      email: emp7.email,
    },
  };
  const attendance7: AttendanceRecord = {
    id: newId(),
    date: today,
    status: 'absent',
    employee: {
      id: emp8.id,
      firstName: emp8.firstName,
      lastName: emp8.lastName,
      email: emp8.email,
    },
  };
  const attendance8: AttendanceRecord = {
    id: newId(),
    date: today,
    status: 'late',
    employee: {
      id: emp9.id,
      firstName: emp9.firstName,
      lastName: emp9.lastName,
      email: emp9.email,
    },
  };
  const attendance9: AttendanceRecord = {
    id: newId(),
    date: today,
    status: 'present',
    employee: {
      id: emp10.id,
      firstName: emp10.firstName,
      lastName: emp10.lastName,
      email: emp10.email,
    },
  };
  const attendance10: AttendanceRecord = {
    id: newId(),
    date: today,
    status: 'absent',
    employee: {
      id: emp5.id,
      firstName: emp5.firstName,
      lastName: emp5.lastName,
      email: emp5.email,
    },
  };

  return {
    departments: [deptPeople, deptEng, deptFin, deptSales, deptIT],
    employees: [emp1, emp2, emp3, emp4, emp5, emp6, emp7, emp8, emp9, emp10],
    roles: [
      {
        id: newId(),
        name: 'HR Manager',
        description: 'HR administration',
        permissions: [
          { code: 'employees:read' },
          { code: 'employees:update' },
          { code: 'attendance:read' },
          { code: 'departments:read' },
        ],
      },
      {
        id: newId(),
        name: 'Team Lead',
        description: 'Team operations',
        permissions: [
          { code: 'employees:read' },
          { code: 'attendance:read' },
        ],
      },
    ],
    attendance: [attendance1, attendance2, attendance3, attendance4, attendance5, attendance6, attendance7, attendance8, attendance9, attendance10],
    settings: [
      { id: 'company_name', key: 'company_name', value: 'CoreHR Demo' },
      { id: 'timezone', key: 'timezone', value: 'Asia/Ho_Chi_Minh' },
      { id: 'work_hours', key: 'work_hours', value: '09:00-18:00' },
    ],
  };
};

const readData = (): DemoData => {
  const raw = localStorage.getItem(DEMO_DATA_KEY);
  if (!raw) {
    const seed = buildSeed();
    localStorage.setItem(DEMO_DATA_KEY, JSON.stringify(seed));
    return seed;
  }

  try {
    return JSON.parse(raw) as DemoData;
  } catch {
    const seed = buildSeed();
    localStorage.setItem(DEMO_DATA_KEY, JSON.stringify(seed));
    return seed;
  }
};

const writeData = (data: DemoData) => {
  localStorage.setItem(DEMO_DATA_KEY, JSON.stringify(data));
};

export const DemoStore = {
  isDemo() {
    return localStorage.getItem(DEMO_MODE_KEY) === '1';
  },
  enableDemo() {
    localStorage.setItem(DEMO_MODE_KEY, '1');
    const seed = buildSeed();
    localStorage.setItem(DEMO_DATA_KEY, JSON.stringify(seed));
    return seed;
  },
  disableDemo() {
    localStorage.removeItem(DEMO_MODE_KEY);
  },
  getData() {
    return readData();
  },
  setData(data: DemoData) {
    writeData(data);
  },
  newId,
};
