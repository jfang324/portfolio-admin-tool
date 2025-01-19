import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Education } from '@/interfaces/Education'
import { CheckCheck, Pencil, Trash2, X } from 'lucide-react'
import { useState } from 'react'

interface EducationEntryProps {
    education: Education
    handleDeleteEducation: (id: string) => void
    handleUpdateEducation: (updatedEducation: Education) => void
}

export function EducationEntry({ education, handleDeleteEducation, handleUpdateEducation }: EducationEntryProps) {
    const [editing, setEditing] = useState<boolean>(false)
    const [school, setSchool] = useState<string>(education.school)
    const [degree, setDegree] = useState<string>(education.degree)
    const [graduationYear, setGraduationYear] = useState<number>(education.graduationYear)
    const [gpa, setGpa] = useState<number>(education.gpa)

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
                                    handleUpdateEducation({
                                        ...education,
                                        school,
                                        degree,
                                        graduationYear,
                                        gpa,
                                    })
                                }}
                            />
                            <X
                                className="cursor-pointer border border-black rounded p-1 hover:bg-gray-100"
                                onClick={() => {
                                    setEditing(false)
                                    setSchool(education.school)
                                    setDegree(education.degree)
                                    setGraduationYear(education.graduationYear)
                                }}
                            />
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
                                onClick={() => handleDeleteEducation(education.id)}
                            />
                        </div>
                    </div>
                )}
                {editing ? (
                    <div className="flex flex-col gap-3">
                        <div className="flex flex-row gap-2 w-full">
                            <div className="flex flex-col w-1/2 gap-1.5">
                                <Label className="font-bold">School</Label>
                                <Input
                                    className="border-black text-xs"
                                    defaultValue={school}
                                    onChange={(e) => setSchool(e.target.value)}
                                />
                            </div>
                            <div className="flex flex-col w-1/2 gap-1.5">
                                <Label className="font-bold">Degree</Label>
                                <Input
                                    className="border-black"
                                    defaultValue={degree}
                                    onChange={(e) => setDegree(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="flex flex-row gap-2 w-full">
                            <div className="flex flex-col w-1/2 gap-1.5">
                                <Label className="font-bold">Graduation Year</Label>
                                <Input
                                    className="border-black"
                                    defaultValue={graduationYear}
                                    onChange={(e) => setGraduationYear(parseInt(e.target.value))}
                                />
                            </div>
                            <div className="flex flex-col w-1/2 gap-1.5">
                                <Label className="font-bold">GPA</Label>
                                <Input
                                    className="border-black"
                                    defaultValue={education.gpa}
                                    onChange={(e) => setGpa(parseFloat(e.target.value))}
                                />
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col gap-3">
                        <div className="flex flex-row gap-2 w-full">
                            <div className="flex flex-col w-1/2 gap-1.5">
                                <Label className="font-bold">School</Label>
                                <div> {school}</div>
                            </div>
                            <div className="flex flex-col w-1/2 gap-1.5">
                                <Label className="font-bold">Degree</Label>
                                <div> {degree}</div>
                            </div>
                        </div>
                        <div className="flex flex-row gap-2 w-full">
                            <div className="flex flex-col w-1/2 gap-1.5">
                                <Label className="font-bold">Graduation Year</Label>
                                <div> {graduationYear}</div>
                            </div>
                            <div className="flex flex-col w-1/2 gap-1.5">
                                <Label className="font-bold">GPA</Label>
                                <div> {education.gpa.toFixed(1)}</div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
