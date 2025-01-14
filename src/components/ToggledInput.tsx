import { Input } from '@/components/ui/input'
import { CheckCheck, Pencil, Trash2, X } from 'lucide-react'
import { useState } from 'react'

interface ToggledInputProps {
    projectId: string
    text: string
}

export const ToggledInput = ({ projectId, text }: ToggledInputProps) => {
    const [editing, setEditing] = useState<boolean>(false)
    const [value, setValue] = useState<string>(text)

    return (
        <div className="flex flex-row gap-2 w-full">
            {editing ? (
                <div className="flex flex-row gap-2 w-full">
                    <div className="flex flex-row gap-1">
                        <CheckCheck
                            className="cursor-pointer border border-black rounded p-1 hover:bg-gray-100"
                            onClick={() => setEditing(false)}
                        />
                        <X
                            className="cursor-pointer border border-black rounded p-1 hover:bg-gray-100"
                            onClick={() => {
                                setEditing(false)
                                setValue(text)
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
                            onClick={() => console.log('delete')}
                        />
                    </div>
                    <div>{value}</div>
                </div>
            )}
        </div>
    )
}
