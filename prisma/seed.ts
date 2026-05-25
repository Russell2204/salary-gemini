import { prisma } from '../lib/prisma'

// 1 RUB ~ 140 UZS
const UZS_FACTOR = 140;

async function main() {
  console.log('Seeding database with Uzbek Sums...')

  // Clear existing data
  await prisma.expense.deleteMany()
  await prisma.job.deleteMany()
  await prisma.user.deleteMany()

  // Create a default user
  const user = await prisma.user.create({
    data: {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123', // In a real app, this should be hashed
    }
  })

  // Seed Jobs
  const jobs = [
    { title: 'Основная работа (Dev)', monthlySalary: 150000 * UZS_FACTOR, isActive: true, userId: user.id },
    { title: 'Фриланс (Дизайн)', monthlySalary: 45000 * UZS_FACTOR, isActive: true, userId: user.id },
    { title: 'Пассивный доход', monthlySalary: 12000 * UZS_FACTOR, isActive: false, userId: user.id },
  ]

  for (const job of jobs) {
    await prisma.job.create({ data: job })
  }

  // Seed Expenses for current month
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth()

  const expenses = [
    { amount: 35000 * UZS_FACTOR, category: 'Rent', description: 'Аренда квартиры', date: new Date(year, month, 5), userId: user.id },
    { amount: 4500 * UZS_FACTOR, category: 'Utilities', description: 'Электричество и вода', date: new Date(year, month, 10), userId: user.id },
    { amount: 12000 * UZS_FACTOR, category: 'Groceries', description: 'Супермаркет (неделя 1)', date: new Date(year, month, 7), userId: user.id },
    { amount: 15000 * UZS_FACTOR, category: 'Groceries', description: 'Супермаркет (неделя 2)', date: new Date(year, month, 14), userId: user.id },
    { amount: 2500 * UZS_FACTOR, category: 'Subscriptions', description: 'Netflix & Spotify', date: new Date(year, month, 1), userId: user.id },
    { amount: 1200 * UZS_FACTOR, category: 'Subscriptions', description: 'iCloud', date: new Date(year, month, 2), userId: user.id },
    { amount: 8000 * UZS_FACTOR, category: 'Others', description: 'Подарки', date: new Date(year, month, 20), userId: user.id },
    { amount: 5000 * UZS_FACTOR, category: 'Others', description: 'Рестораны', date: new Date(year, month, 15), userId: user.id },
    { amount: 3000 * UZS_FACTOR, category: 'Utilities', description: 'Интернет и телефон', date: new Date(year, month, 3), userId: user.id },
  ]

  for (const expense of expenses) {
    await prisma.expense.create({ data: expense })
  }

  console.log('Seeding completed successfully with Uzbek Sums!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
