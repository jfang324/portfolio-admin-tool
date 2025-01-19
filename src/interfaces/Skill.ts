import mongoose from 'mongoose'

export enum SkillCategory {
    ProgrammingLanguages = 'Programming Languages',
    DevelopmentTools = 'Development Tools',
    CloudInfrastructure = 'Cloud Infrastructure',
    Technologies = 'Technologies',
}

export interface Skill {
    id: string
    order: number
    category: SkillCategory
    name: string
}

export interface SkillDocument extends Skill, mongoose.Document {
    _id: mongoose.Types.ObjectId
    id: string
}
