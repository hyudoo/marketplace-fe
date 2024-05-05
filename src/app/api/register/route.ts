import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, name, password, wallet } = body;

    if (!email || !name || !password || !wallet) {
      return new NextResponse("Missing info", { status: 400 });
    }

    const response = await (
      await fetch(`${process.env.ENDPOINT_URL}/user/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name,
          email: email,
          password: password,
          wallet: wallet,
        }),
      })
    ).json();
    return NextResponse.json(response);
  } catch (error: any) {
    console.log(error, "REGISTRATION_ERROR");
    return new NextResponse("Internal Error", { status: 500 });
  }
}
