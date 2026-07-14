import { Router } from 'express';
import * as employeeController from '../controllers/employee.controller';
import { validate } from '../middleware/validate.middleware';
import {
  createEmployeeSchema,
  updateEmployeeSchema,
  getEmployeesQuerySchema,
} from '../validators/employee.validator';

const router = Router();

// GET /api/v1/employees
router.get('/', validate(getEmployeesQuerySchema), employeeController.getEmployees);

// GET /api/v1/employees/:id
router.get('/:id', employeeController.getEmployee);

// POST /api/v1/employees
router.post('/', validate(createEmployeeSchema), employeeController.createEmployee);

// PUT /api/v1/employees/:id
router.put('/:id', validate(updateEmployeeSchema), employeeController.updateEmployee);

// DELETE /api/v1/employees/:id
router.delete('/:id', employeeController.deleteEmployee);

export default router;
