import { BulletPoint, BulletPointDocument } from '@/interfaces/BulletPointDocument'
import { Project, ProjectDocument } from '@/interfaces/ProjectDocument'

export class ApiClient {
    constructor() {}

    async getProjects(): Promise<ProjectDocument[]> {
        const response = await fetch('/api/projects')
        const projects = await response.json()
        return projects
    }

    async createProject(project: Project): Promise<ProjectDocument> {
        const response = await fetch('/api/projects', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(project),
        })

        if (!response.ok) {
            throw new Error('Failed to create a project')
        }

        return response.json()
    }

    async deleteProject(projectId: string): Promise<ProjectDocument> {
        const response = await fetch(`/api/projects/${projectId}`, {
            method: 'DELETE',
        })

        if (!response.ok) {
            throw new Error('Failed to delete a project')
        }

        return response.json()
    }

    async updateProject(project: ProjectDocument): Promise<ProjectDocument> {
        const response = await fetch(`/api/projects/${project._id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(project),
        })

        if (!response.ok) {
            throw new Error('Failed to update a project')
        }

        return response.json()
    }

    async getBulletPoints(projectId: string): Promise<BulletPointDocument[]> {
        const response = await fetch(`/api/projects/${projectId}/bulletpoints`)

        if (!response.ok) {
            throw new Error('Failed to get bullet points of a project')
        }

        return response.json()
    }

    async createBulletPoint(bulletPoint: BulletPoint): Promise<BulletPointDocument> {
        const response = await fetch(`/api/projects/${bulletPoint.projectId}/bulletpoints`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(bulletPoint),
        })

        if (!response.ok) {
            throw new Error('Failed to create a bullet point')
        }

        return response.json()
    }

    async deleteBulletPoint(projectId: string, bulletPointId: string): Promise<BulletPointDocument> {
        const response = await fetch(`/api/projects/${projectId}/bulletpoints/${bulletPointId}`, {
            method: 'DELETE',
        })

        if (!response.ok) {
            throw new Error('Failed to delete a bullet point')
        }

        return response.json()
    }
}
