import Razorpay from "razorpay";

export const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "",
});

export function generateApplicationId(year: number, sequence: number): string {
  return `VGF${year}${String(sequence).padStart(6, "0")}`;
}

export function generateETicketNumber(): string {
  return `VGT${Date.now().toString().slice(-9)}${Math.floor(Math.random() * 100).toString().padStart(3, "0")}`;
}
