import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get("url");

  if (!url) {
    return NextResponse.json({ error: "Missing URL parameter" }, { status: 400 });
  }

  if (!url.startsWith("http")) {
    return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
  }

  try {
    const startTime = Date.now();
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; BalloonSight/1.0; +http://example.com/bot)",
      },
    });
    
    const responseTime = Date.now() - startTime;
    const html = await response.text();

    return NextResponse.json({ 
        html,
        status: response.status,
        time: responseTime 
    }, {
        headers: {
            "Access-Control-Allow-Origin": "*",
        }
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.toString() }, { status: 500 });
  }
}

