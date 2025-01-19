import { BulletPoint } from '@/interfaces/BulletPoint'
import { Education } from '@/interfaces/Education'
import { Project } from '@/interfaces/Project'
import { Skill } from '@/interfaces/Skill'

export class ApiClient {
    constructor() {}

    /**
     * Gets all projects
     * @returns An array of all projects
     */
    async getProjects(): Promise<Project[]> {
        const response = await fetch('/api/projects')

        if (!response.ok) {
            throw new Error('Failed to get projects')
        }

        return response.json()
    }

    /**
     * Create a project
     * @param project - The project to create
     * @returns The created project
     */
    async createProject(project: Partial<Project>): Promise<Project> {
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

    /**
     * Delete a project
     * @param id - The ID of the project to delete
     * @returns The deleted project
     */
    async deleteProject(id: string): Promise<Project> {
        const response = await fetch(`/api/projects/${id}`, {
            method: 'DELETE',
        })

        if (!response.ok) {
            throw new Error('Failed to delete a project')
        }

        return response.json()
    }

    /**
     * Update a project
     * @param project - The project to update
     * @returns The updated project
     */
    async updateProject(project: Partial<Project>): Promise<Project> {
        const response = await fetch(`/api/projects/${project.id}`, {
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

    /**
     * Get all bullet points of a project
     * @param projectId - The ID of the project to get the bullet points of
     * @returns An array of bullet points
     */
    async getBulletPoints(projectId: string): Promise<BulletPoint[]> {
        const response = await fetch(`/api/projects/${projectId}/bulletpoints`)

        if (!response.ok) {
            throw new Error('Failed to get bullet points of a project')
        }

        return response.json()
    }

    /**
     * Create a bullet point
     * @param bulletPoint - The bullet point to create
     * @returns The created bullet point
     */
    async createBulletPoint(bulletPoint: Partial<BulletPoint>): Promise<BulletPoint> {
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

    /**
     * Delete a bullet point
     * @param projectId - The ID of the project the bullet point belongs to
     * @param bulletPointId - The ID of the bullet point to delete
     * @returns The deleted bullet point
     */
    async deleteBulletPoint(projectId: string, bulletPointId: string): Promise<BulletPoint> {
        const response = await fetch(`/api/projects/${projectId}/bulletpoints/${bulletPointId}`, {
            method: 'DELETE',
        })

        if (!response.ok) {
            throw new Error('Failed to delete a bullet point')
        }

        return response.json()
    }

    /**
     * Update a bullet point
     * @param bulletPoint - The bullet point to update
     * @returns The updated bullet point
     */
    async updateBulletPoint(bulletPoint: Partial<BulletPoint>): Promise<BulletPoint> {
        const response = await fetch(`/api/projects/${bulletPoint.projectId}/bulletpoints/${bulletPoint.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(bulletPoint),
        })

        if (!response.ok) {
            throw new Error('Failed to update a bullet point')
        }

        return response.json()
    }

    /**
     * Get all educations
     * @returns An array of all educations
     */
    async getEducations(): Promise<Education[]> {
        const response = await fetch('/api/educations')

        if (!response.ok) {
            throw new Error('Failed to get educations')
        }

        return response.json()
    }

    /**
     * Create an education
     * @param education - The education to create
     * @returns The created education
     */
    async createEducation(education: Partial<Education>): Promise<Education> {
        const response = await fetch('/api/educations', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(education),
        })

        if (!response.ok) {
            throw new Error('Failed to create an education')
        }

        return response.json()
    }

    /**
     * Delete an education
     * @param id - The ID of the education to delete
     * @returns The deleted education
     */
    async deleteEducation(id: string): Promise<Education> {
        const response = await fetch(`/api/educations/${id}`, {
            method: 'DELETE',
        })

        if (!response.ok) {
            throw new Error('Failed to delete an education')
        }

        return response.json()
    }

    /**
     * Update an education
     * @param education - The education to update
     * @returns The updated education
     */
    async updateEducation(education: Partial<Education>): Promise<Education> {
        const response = await fetch(`/api/educations/${education.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(education),
        })

        if (!response.ok) {
            throw new Error('Failed to update an education')
        }

        return response.json()
    }

    /**
     * Get all skills
     * @returns An array of all skills
     */
    async getSkills(): Promise<Skill[]> {
        const response = await fetch('/api/skills')

        if (!response.ok) {
            throw new Error('Failed to get skills')
        }

        return response.json()
    }

    /**
     * Create a skill
     * @param skill - The skill to create
     * @returns The created skill
     */
    async createSkill(skill: Partial<Skill>): Promise<Skill> {
        const response = await fetch('/api/skills', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(skill),
        })

        if (!response.ok) {
            throw new Error('Failed to create a skill')
        }

        return response.json()
    }

    /**
     * Delete a skill
     * @param id - The ID of the skill to delete
     * @returns The deleted skill
     */
    async deleteSkill(id: string): Promise<Skill> {
        const response = await fetch(`/api/skills/${id}`, {
            method: 'DELETE',
        })

        if (!response.ok) {
            throw new Error('Failed to delete a skill')
        }

        return response.json()
    }

    /**
     * Update a skill
     * @param skill - The skill to update
     * @returns The updated skill
     */
    async updateSkill(skill: Partial<Skill>): Promise<Skill> {
        const response = await fetch(`/api/skills/${skill.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(skill),
        })

        if (!response.ok) {
            throw new Error('Failed to update a skill')
        }

        return response.json()
    }
}
