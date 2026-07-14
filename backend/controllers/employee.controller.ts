import { Request, Response } from 'express';
import * as employeeService from '../services/employee.service';
import catchAsync from '../utils/catchAsync';
import { sendSuccess, sendError } from '../utils/apiResponse';
import { GetEmployeesQuery } from '../validators/employee.validator';

/**
 * @desc    Get all employees with pagination, search, filters, and sorting
 * @route   GET /api/v1/employees
 */
export const getEmployees = catchAsync(async (req: Request, res: Response) => {
  const query = req.query as GetEmployeesQuery;
  const result = await employeeService.getAllEmployees(query);
  
  sendSuccess(res, result.data, 'Employees retrieved successfully', 200, result.meta);
});

/**
 * @desc    Get single employee by ID
 * @route   GET /api/v1/employees/:id
 */
export const getEmployee = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const employee = await employeeService.getEmployeeById(id);

  if (!employee) {
    return sendError(res, 'Employee not found', 404);
  }

  sendSuccess(res, employee, 'Employee retrieved successfully');
});

/**
 * @desc    Create a new employee
 * @route   POST /api/v1/employees
 */
export const createEmployee = catchAsync(async (req: Request, res: Response) => {
  const employee = await employeeService.createEmployee(req.body);
  sendSuccess(res, employee, 'Employee created successfully', 201);
});

/**
 * @desc    Update an employee
 * @route   PUT /api/v1/employees/:id
 */
export const updateEmployee = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const employee = await employeeService.updateEmployee(id, req.body);
  
  if (!employee) {
    return sendError(res, 'Employee not found', 404);
  }

  sendSuccess(res, employee, 'Employee updated successfully');
});

/**
 * @desc    Delete an employee
 * @route   DELETE /api/v1/employees/:id
 */
export const deleteEmployee = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const deleted = await employeeService.deleteEmployee(id);
  
  if (!deleted) {
    return sendError(res, 'Employee not found', 404);
  }

  sendSuccess(res, null, 'Employee deleted successfully');
});
