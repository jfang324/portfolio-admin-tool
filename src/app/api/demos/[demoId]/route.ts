import connectToDb from '@/lib/db'
import getS3Client from '@/lib/s3'
import { DemoService } from '@/services/DemoService'
import { NextRequest, NextResponse } from 'next/server'

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ demoId: string }> }) {
    const { demoId } = await params

    if (!demoId) {
        return NextResponse.json({ error: 'No demo ID provided' }, { status: 400 })
    }

    try {
        const connection = await connectToDb()
        const s3Client = getS3Client()
        const demoService = new DemoService(connection, s3Client)
        const deletedDemo = await demoService.deleteOneDemo(demoId)

        return NextResponse.json(deletedDemo, { status: 200 })
    } catch (error) {
        console.error(`Error deleting a demo: ${error}`)
        return NextResponse.json({ error: 'Failed to delete a demo' }, { status: 500 })
    }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ demoId: string }> }) {
    const { demoId } = await params

    if (!demoId) {
        return NextResponse.json({ error: 'No demo ID provided' }, { status: 400 })
    }

    const demo = await request.json()

    if (!demo) {
        return NextResponse.json({ error: 'No demo provided' }, { status: 400 })
    }

    if (demo.order === undefined || !demo.title || !demo.description || !demo.technologies || !demo.gallery) {
        return NextResponse.json({ error: 'Demo is missing required fields' }, { status: 400 })
    }

    try {
        const connection = await connectToDb()
        const s3Client = getS3Client()
        const demoService = new DemoService(connection, s3Client)
        const updatedDemo = await demoService.updateOneDemo(demo)

        return NextResponse.json(updatedDemo, { status: 200 })
    } catch (error) {
        console.error(`Error updating a demo: ${error}`)
        return NextResponse.json({ error: 'Failed to update a demo' }, { status: 500 })
    }
}
