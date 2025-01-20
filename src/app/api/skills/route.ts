import connectToDb from '@/lib/db'
import { SkillService } from '@/services/SkillService'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
    try {
        const connection = await connectToDb()
        const skillService = new SkillService(connection)
        const allSkills = await skillService.getAllSkills()

        return NextResponse.json(allSkills, { status: 200 })
    } catch (error) {
        console.error(`Error getting all skills: ${error}`)
        return NextResponse.json({ error: 'Failed to get all skills' }, { status: 500 })
    }
}

export async function POST(request: NextRequest) {
    const skill = await request.json()

    if (!skill) {
        return NextResponse.json({ error: 'No skill provided' }, { status: 400 })
    }

    if (skill.order === undefined || !skill.category || !skill.name) {
        return NextResponse.json({ error: 'Skill is missing required fields' }, { status: 400 })
    }

    try {
        const connection = await connectToDb()
        const skillService = new SkillService(connection)
        const newSkill = await skillService.createOneSkill(skill)

        return NextResponse.json(newSkill, { status: 200 })
    } catch (error) {
        console.error(`Error creating a new skill: ${error}`)
        return NextResponse.json({ error: 'Failed to create a new skill' }, { status: 500 })
    }
}
