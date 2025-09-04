import { query } from "@/lib/db";
import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";

export async function POST(request) {
    try {
        const data = await request.formData();

        // --- Validate Required Fields ---
        const name = data.get("name");
        const address = data.get("address");
        const city = data.get("city");
        const state = data.get("state");
        const contact = data.get("contact");
        const email_id = data.get("email_id");

        if (!name || !address || !city || !state || !contact || !email_id) {
            return NextResponse.json({ error: "All fields (name, address, city, state, contact, email_id) are required." }, { status: 400 });
        }

        // --- Image Handling ---
        const imageFile = data.get("image");
        if (!imageFile) {
            return NextResponse.json({ error: "Image file is required." }, { status: 400 });
        }

        let buffer;
        try {
            buffer = Buffer.from(await imageFile.arrayBuffer());
        } catch (error) {
            console.error("Error processing image file:", error);
            return NextResponse.json({ error: "Invalid image file." }, { status: 400 });
        }

        const filename = Date.now() + "_" + imageFile.name.replaceAll(" ", "_");
        const imagePath = path.join("schoolimage", filename);

        try {
            await writeFile(
                path.join(process.cwd(), "public/" + imagePath),
                buffer
            );
        } catch (error) {
            console.error("Error saving image file:", error);
            return NextResponse.json({ error: "Failed to save image file." }, { status: 500 });
        }

        // --- Database Insertion ---
        try {
            const result = await query({
                query: "INSERT INTO schools (name, address, city, state, contact, email_id, image) VALUES (?, ?, ?, ?, ?, ?, ?)",
                values: [name, address, city, state, contact, email_id, `/${imagePath}`],
            });

            if (result.affectedRows > 0) {
                return NextResponse.json({ success: true, message: "School added successfully." });
            } else {
                throw new Error("Failed to insert data into the database.");
            }
        } catch (dbError) {
            console.error("Database Error:", dbError);
            return NextResponse.json({ error: "Failed to save school data to database." }, { status: 500 });
        }

    } catch (error) {
        console.error("Unexpected API Error:", error);
        return NextResponse.json(
            { success: false, error: "An unexpected error occurred on the server." },
            { status: 500 }
        );
    }
}
