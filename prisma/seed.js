const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash("Admin@2026", 12);

  const admin = await prisma.user.upsert({
    where: { email: "admin@vaidyagogate.org" },
    update: { password },
    create: {
      email: "admin@vaidyagogate.org",
      name: "VGMF Admin",
      password,
      role: "ADMIN",
      emailVerified: new Date(),
      isActive: true,
    },
  });

  console.log("Admin user ready:", admin.email, "| Role:", admin.role);

  // Also create staff user
  await prisma.user.upsert({
    where: { email: "staff@vaidyagogate.org" },
    update: {},
    create: {
      email: "staff@vaidyagogate.org",
      name: "VGMF Staff",
      password: await bcrypt.hash("Staff@2026", 12),
      role: "STAFF",
      emailVerified: new Date(),
      isActive: true,
    },
  });

  console.log("Staff user ready: staff@vaidyagogate.org");
  await prisma.$disconnect();
}

main().catch((e) => { console.error(e); process.exit(1); });
