{/*import { db } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";

export async function POST(req) {
    const {content, recordId} = await req.json();
    const user = await currentUser();

    const email = user?.primaryEmailAddress?.emailAddress;

    try{
        const result = await db.history.upsert({
            where: { recordId },
            update: { content },
            create: {
                recordId,
                content,
                userEmail: email,
            },
        });
        return NextResponse.json(result);
    }catch(e){
        console.error("Error creating history:", e);
        return NextResponse.json(e)
    }
}

export async function PUT(req) {
    const {content, recordId} = await req.json();
    try{
        const result = await db.history.update({
            where: {
                recordId: recordId, 
            },
            data: {
                content: content,
            }
        });

        return NextResponse.json(result);
    }catch(e){
        console.error("Error creating history:", e);
        return NextResponse.json(e)
    }
}

export async function GET (req) {
    const { searchParams } = new URL(req.url);
    const recordId = searchParams.get('recordId');

    try{
        if(recordId){
            const result = await db.histoty.findFirst({
                where: {
                    recordId: recordId,
                },
            });
            return NextResponse.json(result[0])
        }
        return NextResponse.json({})
        
    }catch(e){
        return NextResponse.json(e);
    }
}*/}

import { db } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";

export async function POST(req) {
  const { content, recordId } = await req.json();
  const user = await currentUser();

  const email = user?.primaryEmailAddress?.emailAddress;

  try {
    const result = await db.history.upsert({
      where: { recordId },
      update: { content },
      create: {
        recordId,
        content,
        userEmail: email,
      },
    });
    return NextResponse.json(result);
  } catch (e) {
    console.error("Error creating history:", e);
    return NextResponse.json(e);
  }
}

// ✅ PUT - prevent overwriting on page refresh or duplicate message
export async function PUT(req) {
  const { content, recordId } = await req.json();

  // ✅ Defensive checks
  if (!recordId || !Array.isArray(content) || content.length === 0) {
    return NextResponse.json(
      { error: "Invalid or empty content." },
      { status: 400 }
    );
  }

  try {
    const existing = await db.history.findUnique({
      where: { recordId },
    });

    if (!existing) {
      return NextResponse.json({ error: "Record not found." }, { status: 404 });
    }

    const lastSaved = existing.content?.[existing.content.length - 1];
    const newLast = content[content.length - 1];

    // ✅ Skip update if no change
    if (JSON.stringify(lastSaved) === JSON.stringify(newLast)) {
      return NextResponse.json({ message: "No new content." });
    }

    const updated = await db.history.update({
      where: { recordId },
      data: { content },
    });

    return NextResponse.json(updated);
  } catch (e) {
    console.error("Error updating history:", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

// ✅ GET - fixed typo and safe return
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const recordId = searchParams.get("recordId");

  try {
    if (recordId) {
      // ✅ Fixed typo: db.histoty → db.history
      const result = await db.history.findFirst({
        where: {
          recordId: recordId,
        },
      });

      // ✅ No need for result[0]; findFirst returns a single object
      return NextResponse.json(result || {});
    }
    return NextResponse.json({});
  } catch (e) {
    console.error("Error fetching history:", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
