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

  const today = new Date().toISOString().slice(0, 10);
  const attendance: AttendanceRecord = {
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

  return {
    departments: [deptPeople, deptEng, deptFin],
    employees: [emp1, emp2],
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
    attendance: [attendance],
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
    return readData();
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
