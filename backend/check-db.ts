import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.count();
  const roles = await prisma.role.count();
  const departments = await prisma.department.count();
  const employees = await prisma.employee.count();
  const predictions = await prisma.prediction.count();

  console.log('Database Row Counts:');
  console.log(`Users: ${users}`);
  console.log(`Roles: ${roles}`);
  console.log(`Departments: ${departments}`);
  console.log(`Employees: ${employees}`);
  console.log(`Predictions: ${predictions}`);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
