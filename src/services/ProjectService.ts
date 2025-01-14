import { BulletPointDocument } from '@/interfaces/BulletPointDocument'
import { ProjectDocument } from '@/interfaces/ProjectDocument'
import BulletPoint from '@/models/BulletPoint'
import Project from '@/models/Project'
import mongoose from 'mongoose'

export class ProjectService {
    private connection: mongoose.Connection

    constructor(connection: mongoose.Connection) {
        if (!connection) {
            throw new Error('No connection to the database')
        }

        this.connection = connection

        // Initialize models
        Project(this.connection)
        BulletPoint(this.connection)
    }

    async getAllProjects(): Promise<ProjectDocument[]> {
        const projectModel = Project(this.connection)

        try {
            const allProjects = await projectModel.find().sort({ order: 1 })

            return allProjects
        } catch (error) {
            console.error('Error getting all projects::', error)
            throw new Error('Failed to get all projects')
        }
    }

    async createOneProject(project: ProjectDocument): Promise<ProjectDocument> {
        const projectModel = Project(this.connection)

        try {
            const newProject = await projectModel.create(project)

            return newProject
        } catch (error) {
            console.error('Error creating a project::', error)
            throw new Error('Failed to create a project')
        }
    }

    async deleteOneProject(projectId: string): Promise<ProjectDocument> {
        const projectModel = Project(this.connection)

        try {
            const deletedProject = await projectModel.findOneAndDelete({ _id: projectId })

            return deletedProject
        } catch (error) {
            console.error('Error deleting a project::', error)
            throw new Error('Failed to delete a project')
        }
    }

    async updateOneProject(projectId: string, project: ProjectDocument): Promise<ProjectDocument> {
        const projectModel = Project(this.connection)

        try {
            const updatedProject = await projectModel.findOneAndUpdate({ _id: projectId }, project)

            return updatedProject
        } catch (error) {
            console.error('Error updating a project::', error)
            throw new Error('Failed to update a project')
        }
    }

    async getAllBulletPoints(projectId: string): Promise<BulletPointDocument[]> {
        const bulletPointModel = BulletPoint(this.connection)

        try {
            const bulletPoints = await bulletPointModel.find({ projectId: projectId }).sort({ order: 1 })

            return bulletPoints
        } catch (error) {
            console.error('Error getting bullet points of a project::', error)
            throw new Error('Failed to get bullet points of a project')
        }
    }

    async createOneBulletPoint(bulletPoint: BulletPointDocument): Promise<BulletPointDocument> {
        const bulletPointModel = BulletPoint(this.connection)

        try {
            const newBulletPoint = await bulletPointModel.create(bulletPoint)

            return newBulletPoint
        } catch (error) {
            console.error('Error creating a bullet point::', error)
            throw new Error('Failed to create a bullet point')
        }
    }

    async deleteOneBulletPoint(bulletPointId: string): Promise<BulletPointDocument> {
        const bulletPointModel = BulletPoint(this.connection)

        try {
            const deletedBulletPoint = await bulletPointModel.findOneAndDelete({ _id: bulletPointId })

            return deletedBulletPoint
        } catch (error) {
            console.error('Error deleting a bullet point::', error)
            throw new Error('Failed to delete a bullet point')
        }
    }
}
