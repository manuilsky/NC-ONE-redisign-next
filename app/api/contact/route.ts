import { handleContactOptions, handleContactPost } from "@/lib/contact/handler";

export const runtime = "nodejs";

export async function OPTIONS(request: Request) {
  return handleContactOptions(request);
}

export async function POST(request: Request) {
  return handleContactPost(request);
}
