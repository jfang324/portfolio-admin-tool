import connectToDb from '@/lib/db'
import { ProjectService } from '@/services/ProjectService'
import { NextRequest, NextResponse } from 'next/server'

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ projectId: string; bulletPointId: string }> }
) {
    const { projectId, bulletPointId } = await params

    if (!projectId) {
        return NextResponse.json({ error: 'No project ID provided' }, { status: 400 })
    }

    if (!bulletPointId) {
        return NextResponse.json({ error: 'No bullet point ID provided' }, { status: 400 })
    }

    try {
        const connection = await connectToDb()
        const projectService = new ProjectService(connection)
        const deletedBulletPoint = await projectService.deleteOneBulletPoint(bulletPointId)

        return NextResponse.json(deletedBulletPoint, { status: 200 })
    } catch (error) {
        console.error(`Error deleting a bullet point: ${error}`)
        return NextResponse.json({ error: 'Failed to delete a bullet point' }, { status: 500 })
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ projectId: string; bulletPointId: string }> }
) {
    const { projectId, bulletPointId } = await params

    if (!projectId) {
        return NextResponse.json({ error: 'No project ID provided' }, { status: 400 })
    }

    if (!bulletPointId) {
        return NextResponse.json({ error: 'No bullet point ID provided' }, { status: 400 })
    }

    const bulletPoint = await request.json()

    if (!bulletPoint) {
        return NextResponse.json({ error: 'No bullet point provided' }, { status: 400 })
    }

    if (bulletPoint.text === undefined || bulletPoint.order === undefined || bulletPoint.projectId === undefined) {
        return NextResponse.json({ error: 'Bullet point is missing required field' }, { status: 400 })
    }

    try {
        const connection = await connectToDb()
        const projectService = new ProjectService(connection)
        const updatedBulletPoint = await projectService.updateOneBulletPoint(bulletPoint)

        return NextResponse.json(updatedBulletPoint, { status: 200 })
    } catch (error) {
        console.error(`Error updating a bullet point: ${error}`)
        return NextResponse.json({ error: 'Failed to update a bullet point' }, { status: 500 })
    }
}
