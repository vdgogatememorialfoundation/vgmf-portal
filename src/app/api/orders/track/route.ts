import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const orderNumber = searchParams.get("orderNumber");

  if (!orderNumber) {
    return NextResponse.json({ error: "Order number required" }, { status: 400 });
  }

  try {
    const order = await prisma.order.findUnique({
      where: { orderNumber },
      include: {
        user: true,
        items: {
          include: { product: true }
        }
      }
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Generate tracking events based on order status
    const events = generateTrackingEvents(order);

    return NextResponse.json({
      orderNumber: order.orderNumber,
      status: order.status,
      estimatedDelivery: order.estimatedDelivery?.toISOString() || new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
      customerName: order.user.name || "Customer",
      customerPhone: order.user.phone || "Not provided",
      customerEmail: order.user.email,
      shippingAddress: `${order.shippingAddress1 || ""}, ${order.shippingCity || ""}, ${order.shippingState || ""} - ${order.shippingPinCode || ""}`,
      items: order.items.map(item => ({
        name: item.product.name,
        quantity: item.quantity,
        price: item.unitPrice
      })),
      events
    });
  } catch (error) {
    console.error("Tracking error:", error);
    return NextResponse.json({ error: "Failed to fetch tracking data" }, { status: 500 });
  }
}

function generateTrackingEvents(order: any) {
  const events = [];
  const orderDate = new Date(order.createdAt);
  const statusOrder = ["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED"];
  const currentIndex = statusOrder.indexOf(order.status);

  // Order Placed
  if (currentIndex >= 0) {
    events.push({
      status: "PENDING",
      location: "VGMF Warehouse, Pune",
      timestamp: orderDate.toISOString(),
      description: "Your order has been placed successfully"
    });
  }

  // Confirmed
  if (currentIndex >= 1) {
    const confirmedDate = new Date(orderDate.getTime() + 2 * 60 * 60 * 1000); // +2 hours
    events.push({
      status: "CONFIRMED",
      location: "VGMF Warehouse, Pune",
      timestamp: confirmedDate.toISOString(),
      description: "Your order has been confirmed and is being prepared"
    });
  }

  // Processing
  if (currentIndex >= 2) {
    const processingDate = new Date(orderDate.getTime() + 24 * 60 * 60 * 1000); // +1 day
    events.push({
      status: "PROCESSING",
      location: "VGMF Warehouse, Pune",
      timestamp: processingDate.toISOString(),
      description: "Your order is being packed and prepared for shipment"
    });
  }

  // Shipped
  if (currentIndex >= 3) {
    const shippedDate = new Date(orderDate.getTime() + 2 * 24 * 60 * 60 * 1000); // +2 days
    events.push({
      status: "SHIPPED",
      location: "Mumbai Distribution Center",
      timestamp: shippedDate.toISOString(),
      description: "Your order has been shipped and is on its way"
    });
  }

  // Delivered
  if (currentIndex >= 4) {
    const deliveredDate = new Date(orderDate.getTime() + 4 * 24 * 60 * 60 * 1000); // +4 days
    events.push({
      status: "DELIVERED",
      location: order.shippingCity || "Destination",
      timestamp: deliveredDate.toISOString(),
      description: "Your order has been delivered successfully"
    });
  }

  return events.reverse(); // Most recent first
}
