import connectToDb from '@/lib/db'
import { SkillService } from '@/services/SkillService'
import { NextRequest, NextResponse } from 'next/server'

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ skillId: string }> }) {
    const { skillId } = await params

    if (!skillId) {
        return NextResponse.json({ error: 'No skill ID provided' }, { status: 400 })
    }

    try {
        const connection = await connectToDb()
        const skillService = new SkillService(connection)
        const deletedSkill = await skillService.deleteOneSkill(skillId)

        return NextResponse.json(deletedSkill, { status: 200 })
    } catch (error) {
        console.error(`Error deleting a skill: ${error}`)
        return NextResponse.json({ error: 'Failed to delete a skill' }, { status: 500 })
    }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ skillId: string }> }) {
    const { skillId } = await params

    if (!skillId) {
        return NextResponse.json({ error: 'No skill ID provided' }, { status: 400 })
    }

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
        const updatedSkill = await skillService.updateOneSkill(skill)

        return NextResponse.json(updatedSkill, { status: 200 })
    } catch (error) {
        console.error(`Error updating a skill: ${error}`)
        return NextResponse.json({ error: 'Failed to update a skill' }, { status: 500 })
    }
}
