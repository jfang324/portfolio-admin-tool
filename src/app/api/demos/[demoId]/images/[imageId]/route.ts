import connectToDb from '@/lib/db'
import getS3Client from '@/lib/s3'
import { DemoService } from '@/services/DemoService'
import { NextRequest, NextResponse } from 'next/server'

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ demoId: string; imageId: string }> }
) {
    const { demoId, imageId } = await params

    if (!demoId) {
        return NextResponse.json({ error: 'No demo ID provided' }, { status: 400 })
    }

    if (!imageId) {
        return NextResponse.json({ error: 'No image ID provided' }, { status: 400 })
    }

    try {
        const connection = await connectToDb()
        const s3Client = getS3Client()
        const demoService = new DemoService(connection, s3Client)
        const updatedDemo = await demoService.deleteImage(demoId, imageId)

        return NextResponse.json(updatedDemo, { status: 200 })
    } catch (error) {
        console.error(`Error deleting an image: ${error}`)
        return NextResponse.json({ error: 'Failed to delete an image' }, { status: 500 })
    }
}
