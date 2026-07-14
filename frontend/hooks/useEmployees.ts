import { useQuery } from '@tanstack/react-query';
import { employeeService } from '../services/employee.service';

export const useEmployees = (limit = 100, offset = 0) => {
  return useQuery({
    queryKey: ['employees', limit, offset],
    queryFn: () => employeeService.getEmployees(limit, offset),
  });
};

export const useEmployee = (id: string) => {
  return useQuery({
    queryKey: ['employees', id],
    queryFn: () => employeeService.getEmployeeById(id),
    enabled: !!id,
  });
};
