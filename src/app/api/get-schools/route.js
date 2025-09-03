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

        const { searchParams } = new URL(request.url);
        const search = searchParams.get('search') || '';
        const cities = searchParams.getAll('city[]');

        let baseQuery = "SELECT id, name, address, city, image FROM schools";
        let conditions = [];
        let values = [];

        if (search) {
            conditions.push("(name LIKE ? OR address LIKE ? OR city LIKE ?)");
            const searchPattern = `%${search}%`;
            values.push(searchPattern, searchPattern, searchPattern);
        }

        if (cities.length > 0) {
            const cityPlaceholders = cities.map(() => "?").join(",");
            conditions.push(`city IN (${cityPlaceholders})`);
            values.push(...cities);
        }

        if (conditions.length > 0) {
            baseQuery += " WHERE " + conditions.join(" AND ");
        }

        const schools = await query({
            query: baseQuery,
            values: values,
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
