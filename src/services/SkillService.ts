import { Skill, SkillDocument } from '@/interfaces/Skill'
import SkillModel from '@/models/Skill'
import mongoose from 'mongoose'

/**
 * Maps a Mongoose SkillDocument to a Skill
 * @param skillDocument - The Mongoose SkillDocument to map
 * @returns The mapped Skill
 */
function mapSkillDocumentToSkill(skillDocument: SkillDocument): Skill {
    if (
        !skillDocument ||
        !skillDocument.id ||
        skillDocument.order == undefined ||
        !skillDocument.category ||
        !skillDocument.name
    ) {
        throw new Error('Invalid skill document')
    }

    return {
        id: skillDocument.id,
        order: skillDocument.order,
        category: skillDocument.category,
        name: skillDocument.name,
    }
}

export class SkillService {
    private connection: mongoose.Connection

    constructor(connection: mongoose.Connection) {
        if (!connection) {
            throw new Error('No connection to the database')
        }

        this.connection = connection

        // Initialize models
        SkillModel(this.connection)
    }

    /**
     * Gets all skills from the database
     * @returns An array of Skills
     */
    async getAllSkills(): Promise<Skill[]> {
        const skillModel = SkillModel(this.connection)

        try {
            const allSkills = await skillModel.find().sort({ order: 1 })

            return allSkills.map((skill) => mapSkillDocumentToSkill(skill))
        } catch (error) {
            console.error(`Error getting all skills: ${error}`)
            throw new Error('Failed to get all skills')
        }
    }

    /**
     * Creates a new skill in the database
     * @param skill - The skill to create
     * @returns The created skill
     */
    async createOneSkill(skill: Partial<Skill>): Promise<Skill> {
        const skillModel = SkillModel(this.connection)

        try {
            const newSkill = await skillModel.create(skill)

            return mapSkillDocumentToSkill(newSkill)
        } catch (error) {
            console.error(`Error creating a skill: ${error}`)
            throw new Error('Failed to create a skill')
        }
    }

    /**
     * Deletes a skill from the database
     * @param id - The ID of the skill to delete
     * @returns The deleted skill
     */
    async deleteOneSkill(id: string): Promise<Skill> {
        const skillModel = SkillModel(this.connection)

        try {
            const deletedSkill = await skillModel.findOneAndDelete({ id })

            return mapSkillDocumentToSkill(deletedSkill)
        } catch (error) {
            console.error(`Error deleting a skill: ${error}`)
            throw new Error('Failed to delete a skill')
        }
    }

    /**
     * Updates a skill in the database
     * @param skill - The skill to update
     * @returns The updated skill
     */
    async updateOneSkill(skill: Skill): Promise<Skill> {
        const skillModel = SkillModel(this.connection)

        try {
            const updatedSkill = await skillModel.findOneAndUpdate({ id: skill.id }, skill)

            return mapSkillDocumentToSkill(updatedSkill)
        } catch (error) {
            console.error(`Error updating a skill: ${error}`)
            throw new Error('Failed to update a skill')
        }
    }
}
