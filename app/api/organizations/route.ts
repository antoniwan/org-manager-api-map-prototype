import { NextResponse } from "next/server";
import { mockOrganizations } from "../../data/mockOrgs";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const bounds = searchParams.get("bounds");

  if (!bounds) {
    return NextResponse.json(mockOrganizations);
  }

  try {
    const [south, west, north, east] = bounds.split(",").map(Number);

    // Filter organizations within the bounds
    const filteredOrgs = mockOrganizations.filter((org) => {
      return (
        org.latitude >= south &&
        org.latitude <= north &&
        org.longitude >= west &&
        org.longitude <= east
      );
    });

    return NextResponse.json(filteredOrgs);
  } catch (error) {
    console.error("Error filtering organizations:", error);
    return NextResponse.json(mockOrganizations);
  }
}
