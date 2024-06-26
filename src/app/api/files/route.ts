import { NextResponse, NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const options = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.PINATA_JWT}`,
        "Content-Type": "application/json",
      },
      body: `{"pinataMetadata":{"name":"${body.name}"},"pinataContent":{
        "name":"${body.name}",
        "description":"${body.description}",
        "images": "${body.images}",
        "type": "${body.type}"
      }}`,
    };

    const res = await fetch(
      "https://api.pinata.cloud/pinning/pinJSONToIPFS",
      options
    );
    const IpfsHash = await res.json();
    return NextResponse.json({ IpfsHash }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
