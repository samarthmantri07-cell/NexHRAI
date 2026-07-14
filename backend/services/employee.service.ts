import { Prisma } from '@prisma/client';
import prisma from '../config/database';
import { CreateEmployeeInput, UpdateEmployeeInput, GetEmployeesQuery } from '../validators/employee.validator';

/**
 * Get all employees with advanced filtering, searching, and pagination.
 */
export const getAllEmployees = async (query: GetEmployeesQuery) => {
  const page = parseInt(query.page || '1', 10);
  const limit = parseInt(query.limit || '10', 10);
  const skip = (page - 1) * limit;

  // Build Prisma where clause
  const where: Prisma.EmployeeWhereInput = {};

  if (query.department) {
    where.department = { name: query.department };
  }
  if (query.jobRole) {
    where.jobRole = query.jobRole;
  }
  if (query.gender) {
    where.gender = query.gender;
  }
  if (query.attrition !== undefined) {
    where.attrition = query.attrition === 'true';
  }
  if (query.jobLevel) {
    where.jobLevel = parseInt(query.jobLevel, 10);
  }
  if (query.maritalStatus) {
    where.maritalStatus = query.maritalStatus;
  }

  if (query.search) {
    const searchNumber = parseInt(query.search, 10);
    where.OR = [
      { user: { firstName: { contains: query.search, mode: 'insensitive' } } },
      { user: { lastName: { contains: query.search, mode: 'insensitive' } } },
      { user: { email: { contains: query.search, mode: 'insensitive' } } },
      { department: { name: { contains: query.search, mode: 'insensitive' } } },
    ];
    if (!isNaN(searchNumber)) {
      where.OR.push({ employeeNumber: searchNumber });
    }
  }

  // Build Prisma orderBy clause
  let orderBy: Prisma.EmployeeOrderByWithRelationInput = { employeeNumber: 'asc' };
  
  const order = query.sortOrder === 'desc' ? 'desc' : 'asc';
  if (query.sortBy) {
    switch (query.sortBy) {
      case 'name':
        orderBy = { user: { firstName: order } };
        break;
      case 'salary':
        orderBy = { monthlyIncome: order };
        break;
      case 'hireDate':
        orderBy = { createdAt: order };
        break;
      case 'department':
        orderBy = { department: { name: order } };
        break;
    }
  }

  const [data, total] = await prisma.$transaction([
    prisma.employee.findMany({
      where,
      orderBy,
      skip,
      take: limit,
      include: {
        department: true,
        user: true,
      },
    }),
    prisma.employee.count({ where }),
  ]);

  return {
    data,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

/**
 * Get employee by ID
 */
export const getEmployeeById = async (id: string) => {
  return await prisma.employee.findUnique({
    where: { id },
    include: {
      department: true,
      user: true,
    },
  });
};

/**
 * Create a new employee
 */
export const createEmployee = async (data: CreateEmployeeInput) => {
  // Check if employee number exists
  const existing = await prisma.employee.findUnique({
    where: { employeeNumber: data.employeeNumber },
  });

  if (existing) {
    const error = new Error('Employee with this employee number already exists.');
    (error as any).statusCode = 409;
    throw error;
  }

  return await prisma.employee.create({
    data,
    include: { department: true },
  });
};

/**
 * Update an employee
 */
export const updateEmployee = async (id: string, data: UpdateEmployeeInput) => {
  // Verify existence
  const existing = await prisma.employee.findUnique({ where: { id } });
  if (!existing) return null;

  return await prisma.employee.update({
    where: { id },
    data,
    include: { department: true },
  });
};

/**
 * Delete an employee
 */
export const deleteEmployee = async (id: string) => {
  const existing = await prisma.employee.findUnique({ where: { id } });
  if (!existing) return false;

  await prisma.employee.delete({ where: { id } });
  return true;
};
