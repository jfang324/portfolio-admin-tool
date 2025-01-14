import connectToDb from '@/lib/db'
import { ProjectService } from '@/services/ProjectService'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest, { params }: { params: { projectId: string } }) {
    const { projectId } = await params

    if (!projectId) {
        return NextResponse.json({ error: 'No project ID provided' }, { status: 400 })
    }

    try {
        const connection = await connectToDb()
        const projectService = new ProjectService(connection)
        const bulletPoints = await projectService.getAllBulletPoints(projectId)

        return NextResponse.json(bulletPoints)
    } catch (error) {
        console.error('Error getting bullet points of a project::', error)
        return NextResponse.json({ error: 'Failed to get bullet points of a project' }, { status: 500 })
    }
}

export async function POST(request: NextRequest, { params }: { params: { projectId: string } }) {
    const { projectId } = await params

    if (!projectId) {
        return NextResponse.json({ error: 'No project ID provided' }, { status: 400 })
    }

    const bulletPoint = await request.json()

    if (!bulletPoint) {
        return NextResponse.json({ error: 'No bullet point provided' }, { status: 400 })
    }

    if (bulletPoint.order === undefined || !bulletPoint.text || !bulletPoint.projectId) {
        return NextResponse.json({ error: 'Bullet point is missing required fields' }, { status: 400 })
    }

    try {
        const connection = await connectToDb()
        const projectService = new ProjectService(connection)
        const newBulletPointDocument = await projectService.createOneBulletPoint(bulletPoint)

        return NextResponse.json(newBulletPointDocument, { status: 200 })
    } catch (error) {
        console.error('Error creating a bullet point::', error)
        return NextResponse.json({ error: 'Failed to create a bullet point' }, { status: 500 })
    }
}
