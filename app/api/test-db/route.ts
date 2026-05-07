import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

/**
 * GET /api/test-db
 * 
 * Tests the connection to the Supabase database by attempting to 
 * fetch data from the 'leads' table.
 */
export async function GET() {
  try {
    const { data, error } = await supabase
      .from("leads")
      .select("*")
      .limit(1);

    if (error) {
      console.error("Supabase Database Error:", error);
      return NextResponse.json(
        { 
          status: "Error", 
          message: "Could not connect to database.",
          details: error.message 
        },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      status: "Success", 
      message: "Database connection established.",
      rowCount: data?.length || 0 
    });

  } catch (error: any) {
    console.error("Critical Test Error:", error);
    return NextResponse.json(
      { 
        status: "Error", 
        message: "An unexpected error occurred during the test.",
        details: error.message 
      },
      { status: 500 }
    );
  }
}
