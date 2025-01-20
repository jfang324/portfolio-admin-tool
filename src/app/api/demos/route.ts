import connectToDb from '@/lib/db'
import getS3Client from '@/lib/s3'
import { DemoService } from '@/services/DemoService'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
    try {
        const connection = await connectToDb()
        const s3Client = getS3Client()
        const demoService = new DemoService(connection, s3Client)
        const allDemos = await demoService.getAllDemos()

        return NextResponse.json(allDemos, { status: 200 })
    } catch (error) {
        console.error(`Error getting all projects: ${error}`)
        return NextResponse.json({ error: 'Failed to get all projects' }, { status: 500 })
    }
}

export async function POST(request: NextRequest) {
    const demo = await request.json()

    if (!demo) {
        return NextResponse.json({ error: 'No demo provided' }, { status: 400 })
    }

    if (
        demo.order === undefined ||
        !demo.title ||
        !demo.description ||
        !demo.technologies ||
        !demo.gallery ||
        !demo.links
    ) {
        return NextResponse.json({ error: 'Demo is missing required fields' }, { status: 400 })
    }

    try {
        const connection = await connectToDb()
        const s3Client = getS3Client()
        const demoService = new DemoService(connection, s3Client)
        const newDemo = await demoService.createOneDemo(demo)

        return NextResponse.json(newDemo, { status: 200 })
    } catch (error) {
        console.error(`Error creating a new demo: ${error}`)
        return NextResponse.json({ error: 'Failed to create a new demo' }, { status: 500 })
    }
}
