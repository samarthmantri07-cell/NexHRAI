import prisma from '../config/database';

// Helper function to calculate median
const calculateMedian = (values: number[]) => {
  if (values.length === 0) return 0;
  values.sort((a, b) => a - b);
  const half = Math.floor(values.length / 2);
  if (values.length % 2) return values[half];
  return (values[half - 1] + values[half]) / 2.0;
};

// ==========================================
// 1. EXECUTIVE DASHBOARD
// ==========================================

export const getOverview = async () => {
  const totalEmployees = await prisma.employee.count();
  const attritionCount = await prisma.employee.count({ where: { attrition: true } });
  const aggregates = await prisma.employee.aggregate({
    _avg: { monthlyIncome: true, yearsAtCompany: true }
  });

  return {
    totalEmployees,
    attritionRate: totalEmployees > 0 ? (attritionCount / totalEmployees) * 100 : 0,
    averageSalary: aggregates._avg.monthlyIncome || 0,
    averageTenure: aggregates._avg.yearsAtCompany || 0,
  };
};

export const getDepartmentPerformance = async () => {
  const depts = await prisma.department.findMany({
    include: { employees: true }
  });

  return depts.map(d => {
    const empCount = d.employees.length;
    const attritionCount = d.employees.filter(e => e.attrition).length;
    const avgPerf = empCount > 0 ? d.employees.reduce((acc, e) => acc + e.performanceRating, 0) / empCount : 0;
    
    return {
      name: d.name,
      performance: avgPerf,
      attritionRate: empCount > 0 ? (attritionCount / empCount) * 100 : 0
    };
  });
};

export const getEmployeeDistribution = async () => {
  const breakdown = await prisma.employee.groupBy({
    by: ['departmentId'],
    _count: { id: true }
  });

  const departments = await prisma.department.findMany();
  const deptMap = new Map(departments.map(d => [d.id, d.name]));

  return breakdown.map(item => ({
    name: deptMap.get(item.departmentId) || 'Unknown',
    count: item._count.id
  }));
};

export const getWorkforceGrowth = async () => {
  // Simulating historical growth using yearsAtCompany
  const employees = await prisma.employee.findMany({ select: { yearsAtCompany: true } });
  const maxYears = 5;
  const growth = [];
  
  const currentYear = new Date().getFullYear();
  for (let i = maxYears; i >= 0; i--) {
    // Count how many employees have yearsAtCompany >= i
    const count = employees.filter(e => e.yearsAtCompany >= i).length;
    growth.push({
      year: (currentYear - i).toString(),
      count: count
    });
  }
  return growth;
};

// ==========================================
// 2. SALARY DASHBOARD
// ==========================================

export const getSalaryOverview = async () => {
  const emps = await prisma.employee.findMany({ select: { monthlyIncome: true } });
  const salaries = emps.map(e => e.monthlyIncome);
  
  const avg = salaries.reduce((a, b) => a + b, 0) / (salaries.length || 1);
  const median = calculateMedian(salaries);
  
  return { averageSalary: avg, medianSalary: median };
};

export const getSalaryBands = async () => {
  const emps = await prisma.employee.findMany({ select: { jobRole: true, monthlyIncome: true } });
  const roleMap = new Map<string, number[]>();
  
  emps.forEach(e => {
    if (!roleMap.has(e.jobRole)) roleMap.set(e.jobRole, []);
    roleMap.get(e.jobRole)!.push(e.monthlyIncome);
  });

  const bands = [];
  for (const [role, salaries] of roleMap.entries()) {
    bands.push({
      role,
      median: calculateMedian(salaries),
      count: salaries.length
    });
  }
  return bands;
};

export const getSalaryByDepartment = async () => {
  const depts = await prisma.department.findMany({
    include: { employees: { select: { monthlyIncome: true } } }
  });

  return depts.map(d => {
    const count = d.employees.length;
    const sum = d.employees.reduce((a, e) => a + e.monthlyIncome, 0);
    return {
      department: d.name,
      avgSalary: count > 0 ? sum / count : 0
    };
  });
};

export const getSalaryByRole = async () => {
  const roles = await prisma.employee.groupBy({
    by: ['jobRole'],
    _avg: { monthlyIncome: true }
  });
  
  return roles.map(r => ({
    role: r.jobRole,
    avgSalary: r._avg.monthlyIncome || 0
  }));
};

// ==========================================
// 3. WORKFORCE DASHBOARD
// ==========================================

export const getGenderDistribution = async () => {
  const distribution = await prisma.employee.groupBy({
    by: ['gender'],
    _count: { id: true }
  });
  return distribution.map(item => ({ group: item.gender, count: item._count.id }));
};

export const getEducationDistribution = async () => {
  const dist = await prisma.employee.groupBy({
    by: ['educationField'],
    _count: { id: true }
  });
  return dist.map(item => ({ level: item.educationField, count: item._count.id }));
};

export const getAgeGroups = async () => {
  const emps = await prisma.employee.findMany({ select: { age: true } });
  const buckets = { '18-25': 0, '26-35': 0, '36-45': 0, '46-55': 0, '55+': 0 };
  
  emps.forEach(e => {
    if (e.age <= 25) buckets['18-25']++;
    else if (e.age <= 35) buckets['26-35']++;
    else if (e.age <= 45) buckets['36-45']++;
    else if (e.age <= 55) buckets['46-55']++;
    else buckets['55+']++;
  });
  
  return Object.entries(buckets).map(([group, count]) => ({ group, count }));
};

export const getJobLevels = async () => {
  const levels = await prisma.employee.groupBy({
    by: ['jobLevel'],
    _count: { id: true }
  });
  return levels.map(l => ({ level: `Level ${l.jobLevel}`, count: l._count.id }));
};

export const getMaritalStatus = async () => {
  const status = await prisma.employee.groupBy({
    by: ['maritalStatus'],
    _count: { id: true }
  });
  return status.map(s => ({ status: s.maritalStatus, count: s._count.id }));
};

// ==========================================
// 4. ATTRITION DASHBOARD
// ==========================================

export const getAttritionByDepartment = async () => {
  const breakdown = await prisma.employee.groupBy({
    by: ['departmentId'],
    where: { attrition: true },
    _count: { id: true }
  });
  const departments = await prisma.department.findMany();
  const deptMap = new Map(departments.map(d => [d.id, d.name]));
  return breakdown.map(item => ({ factor: deptMap.get(item.departmentId) || 'Unknown', count: item._count.id }));
};

export const getAttritionByRole = async () => {
  const roles = await prisma.employee.groupBy({
    by: ['jobRole'],
    where: { attrition: true },
    _count: { id: true }
  });
  return roles.map(r => ({ factor: r.jobRole, count: r._count.id }));
};

export const getAttritionByOvertime = async () => {
  const ot = await prisma.employee.groupBy({
    by: ['overTime'],
    where: { attrition: true },
    _count: { id: true }
  });
  return ot.map(o => ({ factor: o.overTime ? 'Yes' : 'No', count: o._count.id }));
};

export const getAttritionByEducation = async () => {
  const edu = await prisma.employee.groupBy({
    by: ['educationField'],
    where: { attrition: true },
    _count: { id: true }
  });
  return edu.map(e => ({ factor: e.educationField, count: e._count.id }));
};

export const getAttritionByAge = async () => {
  const emps = await prisma.employee.findMany({ where: { attrition: true }, select: { age: true } });
  const buckets = { '18-25': 0, '26-35': 0, '36-45': 0, '46-55': 0, '55+': 0 };
  emps.forEach(e => {
    if (e.age <= 25) buckets['18-25']++;
    else if (e.age <= 35) buckets['26-35']++;
    else if (e.age <= 45) buckets['36-45']++;
    else if (e.age <= 55) buckets['46-55']++;
    else buckets['55+']++;
  });
  return Object.entries(buckets).map(([factor, count]) => ({ factor, count }));
};

export const getAttritionTrends = async () => {
  const emps = await prisma.employee.findMany({ select: { yearsAtCompany: true, attrition: true } });
  const buckets = { '0-1 yr': { t:0, a:0 }, '2-5 yrs': { t:0, a:0 }, '6-10 yrs': { t:0, a:0 }, '10+ yrs': { t:0, a:0 } };
  
  emps.forEach(e => {
    let b = '10+ yrs';
    if (e.yearsAtCompany <= 1) b = '0-1 yr';
    else if (e.yearsAtCompany <= 5) b = '2-5 yrs';
    else if (e.yearsAtCompany <= 10) b = '6-10 yrs';
    
    buckets[b as keyof typeof buckets].t++;
    if (e.attrition) buckets[b as keyof typeof buckets].a++;
  });

  return Object.entries(buckets).map(([month, counts]) => ({
    month, // Using 'month' key as expected by some frontend trend charts, even though it's tenure
    rate: counts.t > 0 ? (counts.a / counts.t) * 100 : 0
  }));
};

// ==========================================
// 5. EMPLOYEE DASHBOARD
// ==========================================

export const getEmployeeStats = async () => {
  const total = await prisma.employee.count();
  const agg = await prisma.employee.aggregate({
    _avg: { age: true, totalWorkingYears: true }
  });
  return {
    totalEmployees: total,
    averageAge: agg._avg.age || 0,
    averageExperience: agg._avg.totalWorkingYears || 0
  };
};

export const getRecentEmployees = async () => {
  // Using shortest yearsAtCompany as proxy for recent
  const recent = await prisma.employee.findMany({
    orderBy: { yearsAtCompany: 'asc' },
    take: 5,
    include: { department: true, user: true }
  });
  return recent.map(r => ({
    id: r.id,
    name: r.user ? `${r.user.firstName} ${r.user.lastName}` : `Employee #${r.employeeNumber}`,
    role: r.jobRole,
    department: r.department.name,
    years: r.yearsAtCompany
  }));
};

export const getExperienceDistribution = async () => {
  const emps = await prisma.employee.findMany({ select: { totalWorkingYears: true } });
  const buckets = { '0-2 yrs': 0, '3-5 yrs': 0, '6-10 yrs': 0, '11-15 yrs': 0, '15+ yrs': 0 };
  
  emps.forEach(e => {
    if (e.totalWorkingYears <= 2) buckets['0-2 yrs']++;
    else if (e.totalWorkingYears <= 5) buckets['3-5 yrs']++;
    else if (e.totalWorkingYears <= 10) buckets['6-10 yrs']++;
    else if (e.totalWorkingYears <= 15) buckets['11-15 yrs']++;
    else buckets['15+ yrs']++;
  });
  return Object.entries(buckets).map(([group, count]) => ({ group, count }));
};
