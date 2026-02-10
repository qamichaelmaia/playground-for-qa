import { NextResponse } from "next/server";
import { getAllUsersWithProfiles } from "@/lib/users";
import { getPowerRanking } from "@/lib/xp";

export const runtime = "nodejs";

export async function GET() {
  try {
    const users = await getAllUsersWithProfiles();
    const ranking = await getPowerRanking(users);

    return NextResponse.json({
      success: true,
      ranking,
      total: ranking.length,
    });
  } catch (error) {
    console.error("Erro ao obter ranking:", error);
    console.error("Stack:", error instanceof Error ? error.stack : "N/A");
    return NextResponse.json(
      { success: false, error: "Erro ao obter ranking", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
