import connectToDb from '@/lib/db'
import { ProjectService } from '@/services/ProjectService'
import { NextRequest, NextResponse } from 'next/server'

export async function DELETE(
    request: NextRequest,
    { params }: { params: { projectId: string; bulletpointId: string } }
) {
    const { projectId, bulletpointId } = await params

    if (!projectId) {
        return NextResponse.json({ error: 'No project ID provided' }, { status: 400 })
    }

    if (!bulletpointId) {
        return NextResponse.json({ error: 'No bullet point ID provided' }, { status: 400 })
    }

    try {
        const connection = await connectToDb()
        const projectService = new ProjectService(connection)
        const deletedBulletPointDocument = await projectService.deleteOneBulletPoint(bulletpointId)

        return NextResponse.json(deletedBulletPointDocument, { status: 200 })
    } catch (error) {
        console.error('Error deleting a bullet point::', error)
        return NextResponse.json({ error: 'Failed to delete a bullet point' }, { status: 500 })
    }
}
