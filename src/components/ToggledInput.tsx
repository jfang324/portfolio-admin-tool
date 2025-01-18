import { Input } from '@/components/ui/input'
import { BulletPoint } from '@/interfaces/BulletPoint'
import { CheckCheck, Pencil, Trash2, X } from 'lucide-react'
import { useState } from 'react'

interface ToggledInputProps {
    bulletPoint: BulletPoint
    handleDeleteBulletPoint: (projectId: string, bulletPointId: string) => void
    handleUpdateBulletPoint: (bulletPoint: BulletPoint) => void
}

export const ToggledInput = ({ bulletPoint, handleDeleteBulletPoint, handleUpdateBulletPoint }: ToggledInputProps) => {
    const [editing, setEditing] = useState<boolean>(false)
    const [value, setValue] = useState<string>(bulletPoint.text)

    return (
        <div className="flex flex-row gap-2 w-full">
            {editing ? (
                <div className="flex flex-row gap-2 w-full">
                    <div className="flex flex-row gap-1">
                        <CheckCheck
                            className="cursor-pointer border border-black rounded p-1 hover:bg-gray-100"
                            onClick={() => {
                                setEditing(false)
                                handleUpdateBulletPoint({
                                    ...bulletPoint,
                                    text: value,
                                })
                            }}
                        />
                        <X
                            className="cursor-pointer border border-black rounded p-1 hover:bg-gray-100"
                            onClick={() => {
                                setEditing(false)
                                setValue(bulletPoint.text)
                            }}
                        />
                    </div>
                    <Input className="border-black" value={value} onChange={(e) => setValue(e.target.value)} />
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
                            onClick={() => handleDeleteBulletPoint(bulletPoint.projectId as string, bulletPoint.id)}
                        />
                    </div>
                    <div className="my-auto">{value}</div>
                </div>
            )}
        </div>
    )
}
