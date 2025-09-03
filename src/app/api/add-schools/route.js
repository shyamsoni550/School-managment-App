import { query } from "@/lib/db";
import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";

export async function POST(request) {
    try {
        const data = await request.formData();

        // --- Image Handling ---
        const imageFile = data.get("image");
        if (!imageFile) {
            return NextResponse.json({ error: "Image file is required." }, { status: 400 });
        }

        const buffer = Buffer.from(await imageFile.arrayBuffer());
        const filename = Date.now() + "_" + imageFile.name.replaceAll(" ", "_");
        const imagePath = path.join("schoolimage", filename);

        await writeFile(
            path.join(process.cwd(), "public/" + imagePath),
            buffer
        );

        // --- Database Insertion ---
        const name = data.get("name");
        const address = data.get("address");
        const city = data.get("city");
        const state = data.get("state");
        const contact = data.get("contact");
        const email_id = data.get("email_id");

        const result = await query({
            query: "INSERT INTO schools (name, address, city, state, contact, email_id, image) VALUES (?, ?, ?, ?, ?, ?, ?)",
            values: [name, address, city, state, contact, email_id, `/${imagePath}`],
        });

        if (result.affectedRows > 0) {
            return NextResponse.json({ success: true, message: "School added successfully." });
        } else {
            throw new Error("Failed to insert data into the database.");
        }

    } catch (error) {
        console.error("API Error:", error);
        return NextResponse.json(
            { success: false, error: "An error occurred on the server." },
            { status: 500 }
        );
    }
}