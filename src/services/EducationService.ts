import { Education, EducationDocument } from '@/interfaces/Education'
import EducationModel from '@/models/Education'
import mongoose from 'mongoose'

/**
 * Maps a Mongoose EducationDocument to an Education
 * @param educationDocument - The Mongoose EducationDocument to map
 * @returns The mapped Education
 */
function mapEducationDocumentToEducation(educationDocument: EducationDocument): Education {
    if (
        !educationDocument ||
        !educationDocument.id ||
        educationDocument.order == undefined ||
        !educationDocument.school ||
        !educationDocument.degree ||
        educationDocument.graduationYear == undefined ||
        educationDocument.gpa == undefined
    ) {
        throw new Error('Invalid education document')
    }

    return {
        id: educationDocument.id,
        order: educationDocument.order,
        school: educationDocument.school,
        degree: educationDocument.degree,
        graduationYear: educationDocument.graduationYear,
        gpa: educationDocument.gpa,
    }
}

export class EducationService {
    private connection: mongoose.Connection

    constructor(connection: mongoose.Connection) {
        if (!connection) {
            throw new Error('No connection to the database')
        }

        this.connection = connection

        // Initialize models
        EducationModel(this.connection)
    }

    /**
     * Gets all educations from the database
     * @returns An array of Educations
     */
    async getAllEducations(): Promise<Education[]> {
        const educationModel = EducationModel(this.connection)

        try {
            const allEducations = await educationModel.find().sort({ order: 1 })

            return allEducations.map((education) => mapEducationDocumentToEducation(education))
        } catch (error) {
            console.error(`Error getting all educations:: ${error}`)
            throw new Error('Failed to get all educations')
        }
    }

    /**
     * Creates a new education in the database
     * @param education - The education to create
     * @returns The created education
     */
    async createOneEducation(education: Partial<Education>): Promise<Education> {
        const educationModel = EducationModel(this.connection)

        try {
            const newEducation = await educationModel.create(education)

            return mapEducationDocumentToEducation(newEducation)
        } catch (error) {
            console.error(`Error creating an education:: ${error}`)
            throw new Error('Failed to create an education')
        }
    }

    /**
     * Deletes an education from the database
     * @param id - The ID of the education to delete
     * @returns The deleted education
     */
    async deleteOneEducation(id: string): Promise<Education> {
        const educationModel = EducationModel(this.connection)

        try {
            const deletedEducation = await educationModel.findOneAndDelete({ id })

            return mapEducationDocumentToEducation(deletedEducation)
        } catch (error) {
            console.error(`Error deleting an education:: ${error}`)
            throw new Error('Failed to delete an education')
        }
    }

    /**
     * Updates an education in the database
     * @param education - The education to update
     * @returns The updated education
     */
    async updateOneEducation(education: Education): Promise<Education> {
        const educationModel = EducationModel(this.connection)

        try {
            const updatedEducation = await educationModel.findOneAndUpdate({ id: education.id }, education)

            return mapEducationDocumentToEducation(updatedEducation)
        } catch (error) {
            console.error(`Error updating an education:: ${error}`)
            throw new Error('Failed to update an education')
        }
    }
}
