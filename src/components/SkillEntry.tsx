import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Skill } from '@/interfaces/Skill'
import { CheckCheck, Pencil, Trash2, X } from 'lucide-react'
import { useState } from 'react'

interface SkillEntryProps {
    skill: Skill
    handleDeleteSkill: (id: string) => void
    handleUpdateSkill: (skill: Skill) => void
}

export function SkillEntry({ skill, handleDeleteSkill, handleUpdateSkill }: SkillEntryProps) {
    const [editing, setEditing] = useState<boolean>(false)
    const [name, setName] = useState<string>(skill.name)

    return (
        <div className="flex flex-row gap-2 w-full">
            {editing ? (
                <div className="flex flex-row gap-2 w-full">
                    <div className="flex flex-row gap-1">
                        <CheckCheck
                            className="cursor-pointer border border-black rounded p-1 hover:bg-gray-100"
                            onClick={() => {
                                setEditing(false)
                                handleUpdateSkill({
                                    ...skill,
                                    name,
                                })
                            }}
                        />
                        <X
                            className="cursor-pointer border border-black rounded p-1 hover:bg-gray-100"
                            onClick={() => {
                                setEditing(false)
                                setName(skill.name)
                            }}
                        />
                    </div>
                    <Input className="border-black" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
            ) : (
                <div className="flex flex-row gap-2">
                    <div className="flex flex-row gap-1">
                        <Pencil
                            className="cursor-pointer border border-black rounded p-1 hover:bg-gray-100"
                            onClick={() => setEditing(true)}
                        />
                        <Trash2
                            className="cursor-pointer border border-black rounded p-1 hover:bg-gray-100"
                            onClick={() => handleDeleteSkill(skill.id)}
                        />
                    </div>
                    <div className="my-auto">{name}</div>
                </div>
            )}
        </div>
    )
}
