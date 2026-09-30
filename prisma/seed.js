import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

try {
  const ensureTenant = async (name) => {
    const existingTenant = await prisma.tenant.findFirst({ where: { name } });
    return existingTenant ?? prisma.tenant.create({ data: { name } });
  };

  const [mainTenant, secondTenant] = await Promise.all([
    ensureTenant("Tenant Principal"),
    ensureTenant("Tenant Secundario"),
  ]);
  const password = await bcrypt.hash("Demo123!", 10);
  const users = [
    {
      mail: "admin@principal.demo",
      name: "Admin Principal",
      telephone: "555-0101",
      role: "ADMIN",
      tenantId: mainTenant.id,
    },
    {
      mail: "usuario@principal.demo",
      name: "Usuario Principal",
      telephone: "555-0102",
      role: "USER",
      tenantId: mainTenant.id,
    },
    {
      mail: "admin@secundario.demo",
      name: "Admin Secundario",
      telephone: "555-0201",
      role: "ADMIN",
      tenantId: secondTenant.id,
    },
    {
      mail: "usuario@secundario.demo",
      name: "Usuario Secundario",
      telephone: "555-0202",
      role: "USER",
      tenantId: secondTenant.id,
    },
  ];

  for (const user of users) {
    await prisma.user.upsert({
      where: { mail: user.mail },
      update: { ...user, password },
      create: { ...user, password },
    });
  }

  console.log("Seed completado: 2 tenants y 4 usuarios de prueba disponibles.");
} catch (error) {
  console.error("Error ejecutando el seed:", error);
  process.exitCode = 1;
} finally {
  await prisma.$disconnect();
}