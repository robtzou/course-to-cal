import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { google } from "googleapis";

export async function POST(req: NextRequest) {
    const session = await auth();

    if (!session || !session.accessToken || (session as any).error) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { eventIds } = await req.json();

        if (!Array.isArray(eventIds) || eventIds.length === 0) {
            return NextResponse.json({ error: "No event IDs provided" }, { status: 400 });
        }

        const oauth2Client = new google.auth.OAuth2();
        oauth2Client.setCredentials({ access_token: session.accessToken });

        const calendar = google.calendar({ version: "v3", auth: oauth2Client });

        const deletionPromises = eventIds.map(eventId =>
            calendar.events.delete({
                calendarId: "primary",
                eventId: eventId,
            }).catch(err => {
                console.error(`Failed to delete event ${eventId}:`, err);
                return null; // Continue even if one fails
            })
        );

        await Promise.all(deletionPromises);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error undoing events:", error);
        return NextResponse.json({ error: "Failed to undo changes" }, { status: 500 });
    }
}
