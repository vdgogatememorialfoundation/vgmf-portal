import Razorpay from "razorpay";
import { getRazorpayKeys } from "./settings";

let _razorpay: Razorpay | null = null;
let _razorpayKeyId = "";

export async function getRazorpay(): Promise<Razorpay> {
  const { keyId, keySecret } = await getRazorpayKeys();
  _razorpayKeyId = keyId;
  _razorpay = new Razorpay({
    key_id: keyId,
    key_secret: keySecret,
  });
  return _razorpay;
}

export async function getRazorpayPublicKey(): Promise<string> {
  const { keyId } = await getRazorpayKeys();
  return keyId;
}

export function generateApplicationId(year: number, sequence: number): string {
  return `VGF${year}${String(sequence).padStart(6, "0")}`;
}

export function generateETicketNumber(): string {
  return `VGT${Date.now().toString().slice(-9)}${Math.floor(Math.random() * 100).toString().padStart(3, "0")}`;
}
