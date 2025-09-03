import { query } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request) {
    try {
        // Ensure the schools table exists
        await query({
            query: `CREATE TABLE IF NOT EXISTS schools (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                address TEXT,
                city VARCHAR(255),
                state VARCHAR(255),
                contact VARCHAR(255),
                email_id VARCHAR(255),
                image VARCHAR(255)
            )`,
            values: [],
        });

        const schools = await query({
            query: "SELECT id, name, address, city, image FROM schools",
            values: [],
        });

        return NextResponse.json({ schools: schools });
    } catch (error) {
        console.error("Error fetching schools:", error);
        return NextResponse.json(
            { error: "An error occurred while fetching schools.", details: error.message },
            { status: 500 }
        );
    }
}
