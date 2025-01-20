import connectToDb from '@/lib/db'
import { ProjectService } from '@/services/ProjectService'
import { NextRequest, NextResponse } from 'next/server'

export async function DELETE(request: NextRequest, { params }: { params: { projectId: string } }) {
    const { projectId } = await params

    if (!projectId) {
        return NextResponse.json({ error: 'No project ID provided' }, { status: 400 })
    }

    try {
        const connection = await connectToDb()
        const projectService = new ProjectService(connection)
        const deletedProject = await projectService.deleteOneProject(projectId)

        return NextResponse.json(deletedProject, { status: 200 })
    } catch (error) {
        console.error(`Error deleting a project: ${error}`)
        return NextResponse.json({ error: 'Failed to delete a project' }, { status: 500 })
    }
}

export async function PUT(request: NextRequest, { params }: { params: { projectId: string } }) {
    const { projectId } = await params

    if (!projectId) {
        return NextResponse.json({ error: 'No project ID provided' }, { status: 400 })
    }

    const project = await request.json()

    if (!project) {
        return NextResponse.json({ error: 'No project provided' }, { status: 400 })
    }

    if (project.order === undefined || !project.name || !project.link) {
        return NextResponse.json({ error: 'Project is missing required fields' }, { status: 400 })
    }

    try {
        const connection = await connectToDb()
        const projectService = new ProjectService(connection)
        const updatedProject = await projectService.updateOneProject(project)

        return NextResponse.json(updatedProject, { status: 200 })
    } catch (error) {
        console.error(`Error updating a project: ${error}`)
        return NextResponse.json({ error: 'Failed to update a project' }, { status: 500 })
    }
}
