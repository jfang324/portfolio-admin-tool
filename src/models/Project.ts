import { ProjectDocument } from '@/interfaces/ProjectDocument'
import mongoose, { Schema } from 'mongoose'

const projectSchema: Schema<ProjectDocument> = new Schema(
    {
        order: {
            type: Number,
            required: true,
            unique: true,
        },
        name: {
            type: String,
            required: true,
        },
        link: {
            type: String,
            required: true,
        },
    },
    { collection: 'Projects' }
)

projectSchema.post('findOneAndDelete', async function (doc: ProjectDocument) {
    if (doc) {
        try {
            const BulletPointModel = mongoose.model('BulletPoint')

            if (BulletPointModel) {
                await BulletPointModel.deleteMany({ projectId: doc._id })
            }
        } catch (error) {
            console.error('Error deleting bullet points of a project::', error)
        }
    }
})

export default (connection: mongoose.Connection) =>
    mongoose.models.Project || connection.model<ProjectDocument>('Project', projectSchema)
