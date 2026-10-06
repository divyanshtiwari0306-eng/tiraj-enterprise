'use server'

import { PrismaClient } from '@prisma/client'
import { revalidatePath } from 'next/cache'

const prisma = new PrismaClient()

// Products
export async function getProducts() {
  return await prisma.product.findMany({ where: { isAvailable: true } })
}

export async function addProduct(data: { name: string, price: string, description: string, image: string }) {
  await prisma.product.create({ data })
  revalidatePath('/')
  revalidatePath('/admin')
}

// Ads
export async function getActiveAds() {
  return await prisma.ad.findMany({
    where: { 
      isActive: true,
      endDate: { gt: new Date() }
    }
  })
}

export async function addAd(data: { title: string, imageUrl: string, placement: string, endDate: Date }) {
  await prisma.ad.create({ data })
  revalidatePath('/')
  revalidatePath('/admin')
}
