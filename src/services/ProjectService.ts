import { BulletPoint, BulletPointDocument } from '@/interfaces/BulletPoint'
import { Project, ProjectDocument } from '@/interfaces/Project'
import BulletPointModel from '@/models/BulletPoint'
import ProjectModel from '@/models/Project'
import mongoose from 'mongoose'

/**
 * Maps a Mongoose ProjectDocument to a Project
 * @param projectDocument - The Mongoose ProjectDocument to map
 * @returns The mapped Project
 */
function mapProjectDocumentToProject(projectDocument: ProjectDocument): Project {
    if (
        !projectDocument ||
        !projectDocument.id ||
        projectDocument.order == undefined ||
        !projectDocument.name ||
        !projectDocument.link
    ) {
        throw new Error('Invalid project document')
    }

    return {
        id: projectDocument.id,
        order: projectDocument.order,
        name: projectDocument.name,
        link: projectDocument.link,
    }
}

/**
 * Maps a Mongoose BulletPointDocument to a BulletPoint
 * @param bulletPointDocument - The Mongoose BulletPointDocument to map
 * @returns The mapped BulletPoint
 */
function mapBulletPointDocumentToBulletPoint(bulletPointDocument: BulletPointDocument): BulletPoint {
    if (
        !bulletPointDocument ||
        !bulletPointDocument.id ||
        bulletPointDocument.order == undefined ||
        !bulletPointDocument.text ||
        !bulletPointDocument.projectId
    ) {
        throw new Error('Invalid bullet point document')
    }

    return {
        id: bulletPointDocument.id,
        order: bulletPointDocument.order,
        text: bulletPointDocument.text,
        projectId: bulletPointDocument.projectId,
    }
}

export class ProjectService {
    private connection: mongoose.Connection

    constructor(connection: mongoose.Connection) {
        if (!connection) {
            throw new Error('No connection to the database')
        }

        this.connection = connection

        // Initialize models
        ProjectModel(this.connection)
        BulletPointModel(this.connection)
    }

    /**
     * Gets all projects from the database
     * @returns An array of Projects
     */
    async getAllProjects(): Promise<Project[]> {
        const projectModel = ProjectModel(this.connection)

        try {
            const allProjects = await projectModel.find().sort({ order: 1 })

            return allProjects.map((project) => mapProjectDocumentToProject(project))
        } catch (error) {
            console.error(`Error getting all projects:: ${error}`)
            throw new Error('Failed to get all projects')
        }
    }

    /**
     * Creates a new project in the database
     * @param project - The project to create
     * @returns The created project
     */
    async createOneProject(project: Partial<Project>): Promise<Project> {
        const projectModel = ProjectModel(this.connection)

        try {
            const newProject = await projectModel.create(project)

            return mapProjectDocumentToProject(newProject)
        } catch (error) {
            console.error(`Error creating a project:: ${error}`)
            throw new Error('Failed to create a project')
        }
    }

    /**
     * Deletes a project from the database
     * @param id - The ID of the project to delete
     * @returns The deleted project
     */
    async deleteOneProject(id: string): Promise<Project> {
        const projectModel = ProjectModel(this.connection)

        try {
            const deletedProject = await projectModel.findOneAndDelete({ id })

            return mapProjectDocumentToProject(deletedProject)
        } catch (error) {
            console.error(`Error deleting a project:: ${error}`)
            throw new Error('Failed to delete a project')
        }
    }

    /**
     * Updates a project in the database
     * @param project - The project to update
     * @returns The updated project
     */
    async updateOneProject(project: Project): Promise<Project> {
        const projectModel = ProjectModel(this.connection)

        try {
            const updatedProject = await projectModel.findOneAndUpdate({ id: project.id }, project)

            return mapProjectDocumentToProject(updatedProject)
        } catch (error) {
            console.error(`Error updating a project:: ${error}`)
            throw new Error('Failed to update a project')
        }
    }

    /**
     * Gets all bullet points of a project from the database
     * @param projectId - The ID of the project to get the bullet points of
     * @returns An array of BulletPoints
     */
    async getAllBulletPoints(projectId: string): Promise<BulletPoint[]> {
        const bulletPointModel = BulletPointModel(this.connection)

        try {
            const allBulletPoints = await bulletPointModel.find({ projectId }).sort({ order: 1 })

            return allBulletPoints.map((bulletPoint) => mapBulletPointDocumentToBulletPoint(bulletPoint))
        } catch (error) {
            console.error(`Error getting bullet points of a project:: ${error}`)
            throw new Error('Failed to get bullet points of a project')
        }
    }

    /**
     * Creates a new bullet point in the database
     * @param bulletPoint - The bullet point to create
     * @returns The created bullet point
     */
    async createOneBulletPoint(bulletPoint: Partial<BulletPoint>): Promise<BulletPoint> {
        const bulletPointModel = BulletPointModel(this.connection)

        try {
            const newBulletPoint = await bulletPointModel.create(bulletPoint)

            return mapBulletPointDocumentToBulletPoint(newBulletPoint)
        } catch (error) {
            console.error(`Error creating a bullet point:: ${error}`)
            throw new Error('Failed to create a bullet point')
        }
    }

    /**
     * Deletes a bullet point from the database
     * @param id - The ID of the bullet point to delete
     * @returns The deleted bullet point
     */
    async deleteOneBulletPoint(id: string): Promise<BulletPoint> {
        const bulletPointModel = BulletPointModel(this.connection)

        try {
            const deletedBulletPoint = await bulletPointModel.findOneAndDelete({ id })

            return mapBulletPointDocumentToBulletPoint(deletedBulletPoint)
        } catch (error) {
            console.error(`Error deleting a bullet point:: ${error}`)
            throw new Error('Failed to delete a bullet point')
        }
    }

    /**
     * Updates a bullet point in the database
     * @param bulletPoint - The bullet point to update
     * @returns The updated bullet point
     */
    async updateOneBulletPoint(bulletPoint: BulletPoint): Promise<BulletPoint> {
        const bulletPointModel = BulletPointModel(this.connection)

        try {
            const updatedBulletPoint = await bulletPointModel.findOneAndUpdate({ id: bulletPoint.id }, bulletPoint)

            return mapBulletPointDocumentToBulletPoint(updatedBulletPoint)
        } catch (error) {
            console.error(`Error updating a bullet point:: ${error}`)
            throw new Error('Failed to update a bullet point')
        }
    }
}
