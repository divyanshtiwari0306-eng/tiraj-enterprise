const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function runTests() {
  console.log("--- Starting Database Tests ---");
  try {
    // Test Products
    console.log("Testing Product CRUD...");
    const product = await prisma.product.create({
      data: {
        name: "TIRAJ Demo Product",
        price: "1599",
        description: "Test description",
        image: "/images/page_1_img_1.jpeg"
      }
    });
    console.log("Created Product:", product.id);

    const updatedProduct = await prisma.product.update({
      where: { id: product.id },
      data: { price: "1699", isAvailable: false }
    });
    console.log("Updated Product price:", updatedProduct.price);

    await prisma.product.delete({ where: { id: product.id } });
    console.log("Deleted Product.");

    // Test Ads
    console.log("\nTesting Ad CRUD...");
    const ad = await prisma.ad.create({
      data: {
        title: "Test Ad",
        imageUrl: "/images/page_1_img_1.jpeg",
        placement: "Hero",
        endDate: new Date(Date.now() + 86400000)
      }
    });
    console.log("Created Ad:", ad.id);

    const activeAds = await prisma.ad.findMany({
      where: { isActive: true, endDate: { gt: new Date() } }
    });
    console.log("Found Active Ads:", activeAds.length);

    await prisma.ad.delete({ where: { id: ad.id } });
    console.log("Deleted Ad.");

    // Test Payments
    console.log("\nTesting Payment Methods CRUD...");
    const payment = await prisma.paymentMethod.create({
      data: { provider: "Razorpay", isEnabled: true }
    });
    console.log("Created Payment Method:", payment.id);

    await prisma.paymentMethod.delete({ where: { id: payment.id } });
    console.log("Deleted Payment Method.");

    console.log("\n--- All Tests Passed! ---");
  } catch (error) {
    console.error("Test Failed:", error);
  } finally {
    await prisma.$disconnect();
  }
}

runTests();
