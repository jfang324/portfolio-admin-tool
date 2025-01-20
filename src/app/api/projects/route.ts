import connectToDb from '@/lib/db'
import { ProjectService } from '@/services/ProjectService'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
    try {
        const connection = await connectToDb()
        const projectService = new ProjectService(connection)
        const allProjects = await projectService.getAllProjects()

        return NextResponse.json(allProjects, { status: 200 })
    } catch (error) {
        console.error(`Error getting all projects: ${error}`)
        return NextResponse.json({ error: 'Failed to get all projects' }, { status: 500 })
    }
}

export async function POST(request: NextRequest) {
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
        const newProject = await projectService.createOneProject(project)

        return NextResponse.json(newProject, { status: 200 })
    } catch (error) {
        console.error(`Error creating a new project: ${error}`)
        return NextResponse.json({ error: 'Failed to create a new project' }, { status: 500 })
    }
}
