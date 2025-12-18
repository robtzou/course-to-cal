import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { google } from "googleapis";
import { Course } from "@/types";

// Force Node.js runtime for googleapis
export const runtime = "nodejs";

const dayMap: Record<string, string> = {
    "Mon": "MO",
    "Tue": "TU",
    "Wed": "WE",
    "Thu": "TH",
    "Fri": "FR",
    "Sat": "SA",
    "Sun": "SU"
};

export async function POST(req: NextRequest) {
    const session = await auth();

    if (!session || !session.accessToken || (session as any).error) {
        console.error("No session or access token found", { session });
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.log("Session found, attempting to add to calendar");
    console.log("Token length:", session.accessToken?.length);
    console.log("Token start:", session.accessToken?.substring(0, 5));

    try {
        const { courses, startDate, endDate, userTimezone = "America/New_York" } = await req.json();

        const oauth2Client = new google.auth.OAuth2();
        oauth2Client.setCredentials({ access_token: session.accessToken });

        const calendar = google.calendar({ version: "v3", auth: oauth2Client });

        const results = await Promise.all(
            (courses as Course[]).map(async (course) => {
                try {
                    // Calculate the first occurrence of the course
                    // Parse start date
                    const semesterStart = new Date(startDate);

                    // Create recurrence rule
                    const byDay = course.days.map(d => dayMap[d]).filter(Boolean).join(",");
                    // Format end date for RRULE (YYYYMMDD)
                    const until = endDate.replace(/-/g, "");

                    const rrule = `RRULE:FREQ=WEEKLY;BYDAY=${byDay};UNTIL=${until}T235959Z`;

                    // Let's find the first day of the course
                    let firstDate = new Date(semesterStart);
                    const targetDays = course.days.map(d => ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(d));

                    if (targetDays.length > 0) {
                        // Prevent infinite loop if no days selected
                        let attempts = 0;
                        while (!targetDays.includes(firstDate.getDay()) && attempts < 14) {
                            firstDate.setDate(firstDate.getDate() + 1);
                            attempts++;
                        }
                    }

                    // Set time
                    const [startHour, startMinute] = course.startTime.split(":").map(Number);
                    const [endHour, endMinute] = course.endTime.split(":").map(Number);

                    // Create ISO string without timezone (local time)
                    const formatDate = (date: Date, hours: number, minutes: number) => {
                        const year = date.getFullYear();
                        const month = String(date.getMonth() + 1).padStart(2, '0');
                        const day = String(date.getDate()).padStart(2, '0');
                        const h = String(hours).padStart(2, '0');
                        const m = String(minutes).padStart(2, '0');
                        return `${year}-${month}-${day}T${h}:${m}:00`;
                    };

                    const startDateTime = formatDate(firstDate, startHour, startMinute);
                    const endDateTime = formatDate(firstDate, endHour, endMinute);

                    const event = {
                        summary: `${course.code} - ${course.name}`,
                        location: course.location,
                        description: `Course: ${course.name}\nCode: ${course.code}`,
                        start: {
                            dateTime: startDateTime,
                            timeZone: userTimezone,
                        },
                        end: {
                            dateTime: endDateTime,
                            timeZone: userTimezone,
                        },
                        recurrence: [rrule],
                    };

                    const response = await calendar.events.insert({
                        calendarId: "primary",
                        requestBody: event,
                    });

                    return response.data;
                } catch (err) {
                    console.error(`Failed to add course ${course.name}:`, err);
                    throw err;
                }
            })
        );

        return NextResponse.json({ success: true, results });
    } catch (error) {
        console.error("Error adding to calendar:", error);
        return NextResponse.json({ error: "Failed to add events" }, { status: 500 });
    }
}
