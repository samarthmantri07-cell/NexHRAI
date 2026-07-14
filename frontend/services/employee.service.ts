import api from './api';

export interface Employee {
  id: string;
  employeeNumber: number;
  age: number;
  gender: string;
  departmentId: string;
  jobRole: string;
  monthlyIncome: number;
  attrition: boolean;
  department?: {
    id: string;
    name: string;
  };
}

export const employeeService = {
  getEmployees: async (limit = 100, offset = 0): Promise<Employee[]> => {
    const response = await api.get(`/employees?limit=${limit}&offset=${offset}`);
    return response.data.data;
  },
  getEmployeeById: async (id: string): Promise<Employee> => {
    const response = await api.get(`/employees/${id}`);
    return response.data.data;
  }
};
