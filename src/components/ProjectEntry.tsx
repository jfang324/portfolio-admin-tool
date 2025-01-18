import { ToggledInput } from '@/components/ToggledInput'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { BulletPoint } from '@/interfaces/BulletPoint'
import { Project } from '@/interfaces/Project'
import { CheckCheck, Dot, Pencil, Plus, Trash2, X } from 'lucide-react'
import { useState } from 'react'

interface ProjectEntryProps {
    project: Project
    bulletPoints: BulletPoint[]
    handleDeleteProject: (id: string) => void
    handleUpdateProject: (project: Project) => void
    handleCreateBulletPoint: (projectId: string) => void
    handleDeleteBulletPoint: (projectId: string, bulletPointId: string) => void
    handleUpdateBulletPoint: (bulletPoint: BulletPoint) => void
}

export const ProjectEntry = ({
    project,
    bulletPoints,
    handleDeleteProject,
    handleUpdateProject,
    handleCreateBulletPoint,
    handleDeleteBulletPoint,
    handleUpdateBulletPoint,
}: ProjectEntryProps) => {
    const [editing, setEditing] = useState<boolean>(false)
    const [name, setName] = useState<string>(project.name)
    const [link, setLink] = useState<string>(project.link)

    return (
        <div className="border border-black rounded p-4 flex flex-col gap-3 w-full sm:w-2/5 text-xs">
            <div className="flex flex-col gap-2">
                {editing ? (
                    <div className="flex flex-col gap-1 items-end">
                        <div className="flex flex-row gap-1">
                            <CheckCheck
                                className="cursor-pointer border border-black rounded p-1 hover:bg-gray-100"
                                onClick={() => {
                                    setEditing(false)
                                    handleUpdateProject({
                                        ...project,
                                        name,
                                        link,
                                    })
                                }}
                            />
                            <X
                                className="cursor-pointer border border-black rounded p-1 hover:bg-gray-100"
                                onClick={() => {
                                    setEditing(false)
                                    setName(project.name)
                                    setLink(project.link)
                                }}
                            />
                        </div>
                        <div className="flex flex-row gap-2 justify-center w-full">
                            <div className="grid w-full max-w-sm items-center gap-1.5">
                                <Label className="font-bold">Name</Label>
                                <Input
                                    className="border-black text-xs"
                                    defaultValue={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>
                            <div className="grid w-full max-w-sm items-center gap-1.5">
                                <Label className="font-bold">Link</Label>
                                <Input
                                    className="border-black"
                                    defaultValue={link}
                                    onChange={(e) => setLink(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col gap-1 items-end">
                        <div className="flex flex-row gap-1">
                            <Pencil
                                className="cursor-pointer border border-black rounded p-1 hover:bg-gray-100"
                                onClick={() => setEditing(true)}
                            />
                            <Trash2
                                className="cursor-pointer border border-black rounded p-1 hover:bg-gray-100"
                                onClick={() => handleDeleteProject(project.id)}
                            />
                        </div>
                        <div className="flex flex-row gap-2 justify-center w-full px-3">
                            <div className="grid w-full max-w-sm items-center gap-1.5">
                                <Label className="font-bold">Name</Label>
                                <div> {name}</div>
                            </div>
                            <div className="grid w-full max-w-sm items-center gap-1.5">
                                <Label className="font-bold">Link</Label>
                                <div> {link}</div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className="flex flex-col gap-1">
                {bulletPoints.map((bulletPoint) =>
                    editing ? (
                        <ToggledInput
                            key={bulletPoint.id}
                            bulletPoint={bulletPoint}
                            handleDeleteBulletPoint={handleDeleteBulletPoint}
                            handleUpdateBulletPoint={handleUpdateBulletPoint}
                        />
                    ) : (
                        <div key={bulletPoint.id} className="flex flex-row gap-0 w-full">
                            <Dot className="w-6 h-6" />
                            <div className="w-11/12 my-auto">{bulletPoint.text}</div>
                        </div>
                    )
                )}
                {editing && (
                    <Plus
                        className="cursor-pointer border border-black rounded p-1 hover:bg-gray-100"
                        onClick={() => handleCreateBulletPoint(project.id)}
                    />
                )}
            </div>
        </div>
    )
}
