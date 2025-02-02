import connectToDb from '@/lib/db'
import getS3Client from '@/lib/s3'
import { DemoService } from '@/services/DemoService'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest, { params }: { params: Promise<{ demoId: string }> }) {
    const { demoId } = await params

    if (!demoId) {
        return NextResponse.json({ error: 'No demo ID provided' }, { status: 400 })
    }

    const formData = await request.formData()
    const image = formData.get('file')

    if (!image) {
        return NextResponse.json({ error: 'No image provided' }, { status: 400 })
    }

    if (!(image instanceof File)) {
        return NextResponse.json({ error: 'Invalid image provided' }, { status: 400 })
    }

    try {
        const connection = await connectToDb()
        const s3Client = getS3Client()
        const demoService = new DemoService(connection, s3Client)
        const updatedDemo = await demoService.uploadImage(demoId, image)

        return NextResponse.json(updatedDemo, { status: 200 })
    } catch (error) {
        console.error(`Error uploading an image: ${error}`)
        return NextResponse.json({ error: 'Failed to upload an image' }, { status: 500 })
    }
}
