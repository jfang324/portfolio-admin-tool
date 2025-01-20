'use client'
import { SkillEntry } from '@/components/SkillEntry'
import { useToast } from '@/hooks/use-toast'
import { Skill, SkillCategory } from '@/interfaces/Skill'
import { ApiClient } from '@/services/ApiClient'
import { Plus } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'

export default function Page() {
    const { toast } = useToast()
    const apiClient = useMemo(() => new ApiClient(), [])
    const [skills, setSkills] = useState<Record<string, Skill[]>>({})

    useEffect(() => {
        const fetchSkills = async () => {
            try {
                const fetchedSkills = await apiClient.getSkills()
                const skillsMap: Record<string, Skill[]> = {}

                for (const category of Object.keys(SkillCategory)) {
                    skillsMap[category.toString()] = fetchedSkills.filter((skill) => skill.category === category)
                }

                setSkills(skillsMap)
            } catch (error) {
                console.error(`Error fetching skills: ${error}`)
                toast({ title: 'Error', description: 'Failed to fetch skills' })
            }
        }

        fetchSkills()
    }, [apiClient, toast])

    const handleCreateSkill = async (category: string) => {
        const skill = {
            order: skills[category].length,
            category: category as SkillCategory,
            name: 'Default Skill Name',
        }

        try {
            const newSkill = await apiClient.createSkill(skill)

            setSkills({
                ...skills,
                [category]: [...skills[category], newSkill],
            })
            toast({ title: 'Success', description: `Created Skill: ${newSkill.id} with default fields` })
        } catch (error) {
            toast({ title: 'Error', description: 'Failed to create a skill' })
            console.error(`Error creating a skill: ${error}`)
        }
    }

    const handleDeleteSkill = async (skillId: string) => {
        try {
            const deletedSkill = await apiClient.deleteSkill(skillId)
            const shiftedSkills = skills[deletedSkill.category]
                .filter((skill) => skill.id !== skillId)
                .map((skill, idx) => ({ ...skill, order: idx }))

            await Promise.all(shiftedSkills.map((skill) => apiClient.updateSkill(skill)))

            setSkills({ ...skills, [deletedSkill.category]: shiftedSkills })
            toast({ title: 'Success', description: `Deleted Skill: ${skillId}` })
        } catch (error) {
            toast({ title: 'Error', description: `Failed to delete skill: ${skillId}` })
            console.error(`Error deleting skill: ${error}`)
        }
    }

    const handleUpdateSkill = async (updatedSkill: Skill) => {
        try {
            await apiClient.updateSkill(updatedSkill)

            setSkills({
                ...skills,
                [updatedSkill.category]: skills[updatedSkill.category].map((skill) =>
                    skill.id === updatedSkill.id ? updatedSkill : skill
                ),
            })
            toast({ title: 'Success', description: `Updated Skill: ${updatedSkill.name}` })
        } catch (error) {
            toast({ title: 'Error', description: 'Failed to update a skill' })
            console.error(`Error updating a skill: ${error}`)
        }
    }

    const handleRearrangeSkills = async (category: string, rearrangedSkills: Skill[]) => {
        try {
            const shiftedSkills = rearrangedSkills.map((skill, idx) => ({ ...skill, order: idx }))

            Promise.all(shiftedSkills.map((skill) => apiClient.updateSkill(skill)))

            setSkills({
                ...skills,
                [category]: shiftedSkills,
            })
            toast({ title: 'Success', description: `Rearranged Skills` })
        } catch (error) {
            toast({ title: 'Error', description: 'Failed to rearrange skills, refresh the page' })
            console.error(`Error rearranging skills: ${error}`)
        }
    }

    return (
        <div className="flex flex-col gap-2 items-center w-full">
            {Object.keys(SkillCategory).map((category) => (
                <div
                    key={category}
                    className="border border-black rounded p-4 flex flex-col gap-2 w-full sm:w-2/5 text-xs"
                >
                    <div className="font-bold text-lg">{SkillCategory[category as keyof typeof SkillCategory]}</div>
                    <div className="flex flex-col gap-1">
                        <DragDropContext
                            onDragEnd={(result: any) => {
                                if (!result.destination || result.destination.index === result.source.index) return

                                const rearrangedSkills = Array.from(skills[category as keyof typeof SkillCategory])
                                const [removed] = rearrangedSkills.splice(result.source.index, 1)
                                rearrangedSkills.splice(result.destination.index, 0, removed)

                                handleRearrangeSkills(category as string, rearrangedSkills)
                            }}
                        >
                            <Droppable
                                droppableId={category}
                                direction="vertical"
                                isDropDisabled={false}
                                isCombineEnabled={false}
                                ignoreContainerClipping={true}
                            >
                                {(provided: any) => (
                                    <div
                                        ref={provided.innerRef}
                                        {...provided.droppableProps}
                                        className="flex flex-col gap-1"
                                    >
                                        {(skills[category as keyof typeof SkillCategory] || []).map((skill) => (
                                            <Draggable
                                                key={skill.id}
                                                draggableId={skill.id.toString()}
                                                index={skill.order}
                                                isDragDisabled={false}
                                            >
                                                {(provided: any) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                    >
                                                        <SkillEntry
                                                            skill={skill}
                                                            handleDeleteSkill={handleDeleteSkill}
                                                            handleUpdateSkill={handleUpdateSkill}
                                                        />
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        </DragDropContext>
                        <Plus
                            className="cursor-pointer border border-black rounded p-1 hover:bg-gray-100"
                            onClick={() => handleCreateSkill(category as string)}
                        />
                    </div>
                </div>
            ))}
        </div>
    )
}
