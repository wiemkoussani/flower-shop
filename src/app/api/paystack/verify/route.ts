import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isPaystackConfigured, verifyPaystack } from "@/lib/paystack";

export async function GET(req: NextRequest) {
  const reference = req.nextUrl.searchParams.get("reference");
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  if (!reference) {
    return NextResponse.redirect(`${siteUrl}/order/failed`);
  }

  try {
    const payment = await prisma.payment.findUnique({
      where: { reference },
      include: { order: true },
    });

    if (!payment) {
      return NextResponse.redirect(`${siteUrl}/order/failed?reason=not_found`);
    }

    if (!isPaystackConfigured()) {
      await prisma.$transaction([
        prisma.payment.update({
          where: { id: payment.id },
          data: { status: "demo_paid", paystackStatus: "success", paidAt: new Date() },
        }),
        prisma.order.update({
          where: { id: payment.orderId },
          data: { status: "PAID" },
        }),
      ]);
      return NextResponse.redirect(
        `${siteUrl}/order/success?reference=${reference}&order=${payment.order.orderNumber}`,
      );
    }

    const verified = await verifyPaystack(reference);
    if (verified.status === "success" && verified.amount === payment.amountKobo) {
      await prisma.$transaction([
        prisma.payment.update({
          where: { id: payment.id },
          data: {
            status: "paid",
            paystackStatus: verified.status,
            paidAt: verified.paid_at ? new Date(verified.paid_at) : new Date(),
            raw: JSON.stringify(verified),
          },
        }),
        prisma.order.update({
          where: { id: payment.orderId },
          data: { status: "PAID" },
        }),
      ]);
      return NextResponse.redirect(
        `${siteUrl}/order/success?reference=${reference}&order=${payment.order.orderNumber}`,
      );
    }

    await prisma.payment.update({
      where: { id: payment.id },
      data: {
        status: "failed",
        paystackStatus: verified.status,
        raw: JSON.stringify(verified),
      },
    });
    return NextResponse.redirect(`${siteUrl}/order/failed?reference=${reference}`);
  } catch (err) {
    console.error(err);
    return NextResponse.redirect(`${siteUrl}/order/failed?reference=${reference}`);
  }
}
