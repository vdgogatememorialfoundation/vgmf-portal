import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash("Test@2026", 12);

  // Create admin user
  const admin = await prisma.user.upsert({
    where: { email: "admin@vaidyagogate.org" },
    update: {},
    create: {
      email: "admin@vaidyagogate.org",
      name: "VGMF Admin",
      password,
      role: "ADMIN",
      emailVerified: new Date(),
      isActive: true,
    },
  });

  // Create staff user
  const staff = await prisma.user.upsert({
    where: { email: "staff@vaidyagogate.org" },
    update: {},
    create: {
      email: "staff@vaidyagogate.org",
      name: "VGMF Staff",
      password,
      role: "STAFF",
      emailVerified: new Date(),
      isActive: true,
    },
  });

  // Create doctor user
  const doctor = await prisma.user.upsert({
    where: { email: "doctor@vaidyagogate.org" },
    update: {},
    create: {
      email: "doctor@vaidyagogate.org",
      name: "Dr. Sharma",
      password,
      role: "DOCTOR",
      emailVerified: new Date(),
      isActive: true,
    },
  });

  // Create judge user
  const judge = await prisma.user.upsert({
    where: { email: "judge@vaidyagogate.org" },
    update: {},
    create: {
      email: "judge@vaidyagogate.org",
      name: "Prof. Patil",
      password,
      role: "JUDGE",
      emailVerified: new Date(),
      isActive: true,
    },
  });

  // Create reviewer user
  const reviewer = await prisma.user.upsert({
    where: { email: "reviewer@vaidyagogate.org" },
    update: {},
    create: {
      email: "reviewer@vaidyagogate.org",
      name: "Dr. Mehta",
      password,
      role: "REVIEWER",
      emailVerified: new Date(),
      isActive: true,
    },
  });

  // Create trustee user
  const trustee = await prisma.user.upsert({
    where: { email: "trustee@vaidyagogate.org" },
    update: {},
    create: {
      email: "trustee@vaidyagogate.org",
      name: "Mrs. Gogate",
      password,
      role: "TRUSTEE",
      emailVerified: new Date(),
      isActive: true,
    },
  });

  // Create applicant user
  const applicant = await prisma.user.upsert({
    where: { email: "applicant@vaidyagogate.org" },
    update: {},
    create: {
      email: "applicant@vaidyagogate.org",
      name: "Dr. Deshmukh",
      password,
      role: "APPLICANT",
      emailVerified: new Date(),
      isActive: true,
    },
  });

  // Create regular user
  const regularUser = await prisma.user.upsert({
    where: { email: "user@vaidyagogate.org" },
    update: {},
    create: {
      email: "user@vaidyagogate.org",
      name: "Test User",
      password,
      role: "USER",
      emailVerified: new Date(),
      isActive: true,
    },
  });

  console.log("Seeded users:", {
    admin: admin.email,
    staff: staff.email,
    doctor: doctor.email,
    judge: judge.email,
    reviewer: reviewer.email,
    trustee: trustee.email,
    applicant: applicant.email,
    user: regularUser.email,
  });

  // Create default categories
  const categories = await Promise.all([
    prisma.productCategory.upsert({ where: { slug: "books" }, update: {}, create: { name: "Books", slug: "books", sortOrder: 1 } }),
    prisma.productCategory.upsert({ where: { slug: "cds" }, update: {}, create: { name: "CDs", slug: "cds", sortOrder: 2 } }),
    prisma.productCategory.upsert({ where: { slug: "publications" }, update: {}, create: { name: "Publications", slug: "publications", sortOrder: 3 } }),
  ]);

  // Create default products
  const products = [
    { name: "Viddha and Agnikarma Chikitsa (English)", slug: "viddha-agnikarma-english", price: 450, categorySlug: "books", stock: 100 },
    { name: "Viddha and Agnikarma Chikitsa (Hindi)", slug: "viddha-agnikarma-hindi", price: 400, categorySlug: "books", stock: 80 },
    { name: "Viddha and Agnikarma Chikitsa (Marathi)", slug: "viddha-agnikarma-marathi", price: 400, categorySlug: "books", stock: 60 },
  ];

  for (const p of products) {
    const cat = categories.find(c => c.slug === p.categorySlug);
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: {},
      create: {
        name: p.name, slug: p.slug, price: p.price,
        categoryId: cat!.id, stockQuantity: p.stock,
        isPublished: true, isFeatured: true,
        sku: `VGMF-BK-${p.slug.slice(-3).toUpperCase()}`,
        thumbnailUrl: "/images/book-placeholder.jpg",
      },
    });
  }

  // Create default events
  const events = [
    { title: "National Seminar 2026", slug: "national-seminar-2026", type: "Seminar", date: new Date("2026-03-15") },
    { title: "Viddhakarma Research Fellowship 2026", slug: "fellowship-2026", type: "Fellowship", date: new Date("2026-06-01") },
    { title: "Autism Awareness Programme 2026", slug: "autism-2026", type: "Autism", date: new Date("2026-04-02") },
  ];

  for (const e of events) {
    await prisma.event.upsert({
      where: { slug: e.slug },
      update: {},
      create: { title: e.title, slug: e.slug, eventType: e.type, eventDate: e.date, isPublished: true, isFeatured: true },
    });
  }

  // Create site content
  const contents = [
    { key: "HeroTitle", value: "Vaidya Gogate Memorial Foundation" },
    { key: "HeroSubtitle", value: "Advancing Ayurveda Since 1972" },
    { key: "ContactEmail", value: "care@vaidyagogate.org" },
    { key: "ContactPhone", value: "+91-9373792952" },
    { key: "FooterText", value: "Vaidya Gogate Memorial Foundation" },
  ];

  for (const c of contents) {
    await prisma.siteContent.upsert({ where: { key: c.key }, update: {}, create: c });
  }

  console.log("Seed completed: all role users, categories, products, events, site content created");
}

main().catch(console.error).finally(() => prisma.$disconnect());
