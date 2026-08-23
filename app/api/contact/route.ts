import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";

type ContactSubmission = {
  timestamp: string;
  formData: Record<string, unknown>;
  metadata: {
    ipAddress: string | null;
    userAgent: string | null;
    referer: string | null;
    acceptLanguage: string | null;
    acceptEncoding: string | null;
    connection: string | null;
    host: string | null;
    origin: string | null;
    cfRay: string | null;
    cfConnectingIp: string | null;
    xForwardedFor: string | null;
    xRealIp: string | null;
    allHeaders: Record<string, string>;
  };
  clientInfo: {
    timezone: string | null;
    screenResolution: string | null;
    language: string | null;
    platform: string | null;
    cookieEnabled: boolean | null;
  };
};

function getClientIp(request: NextRequest): string | null {
  const cfConnectingIp = request.headers.get("cf-connecting-ip");
  const xForwardedFor = request.headers.get("x-forwarded-for");
  const xRealIp = request.headers.get("x-real-ip");

  if (cfConnectingIp) return cfConnectingIp;
  if (xForwardedFor) return xForwardedFor.split(",")[0]?.trim() ?? null;
  if (xRealIp) return xRealIp;

  return null;
}

function getAllHeaders(request: NextRequest): Record<string, string> {
  const headers: Record<string, string> = {};
  request.headers.forEach((value, key) => {
    headers[key] = value;
  });
  return headers;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { formData, clientInfo } = body;

    const submission: ContactSubmission = {
      timestamp: new Date().toISOString(),
      formData: formData || {},
      metadata: {
        ipAddress: getClientIp(request),
        userAgent: request.headers.get("user-agent"),
        referer: request.headers.get("referer"),
        acceptLanguage: request.headers.get("accept-language"),
        acceptEncoding: request.headers.get("accept-encoding"),
        connection: request.headers.get("connection"),
        host: request.headers.get("host"),
        origin: request.headers.get("origin"),
        cfRay: request.headers.get("cf-ray"),
        cfConnectingIp: request.headers.get("cf-connecting-ip"),
        xForwardedFor: request.headers.get("x-forwarded-for"),
        xRealIp: request.headers.get("x-real-ip"),
        allHeaders: getAllHeaders(request),
      },
      clientInfo: clientInfo || {},
    };

    const logsDir = path.join(process.cwd(), "logs");
    if (!existsSync(logsDir)) {
      await mkdir(logsDir, { recursive: true });
    }

    const filename = `contact-${Date.now()}-${Math.random().toString(36).substring(7)}.json`;
    const filepath = path.join(logsDir, filename);

    await writeFile(filepath, JSON.stringify(submission, null, 2));

    return NextResponse.json({
      success: true,
      message: "フォームが送信されました",
      submissionId: filename,
    });
  } catch (error) {
    console.error("Contact form submission error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "送信に失敗しました",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
