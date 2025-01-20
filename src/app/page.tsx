'use client'
import { useRouter } from 'next/navigation'

export default function Home() {
    const router = useRouter()

    return (
        <div className="flex flex-col gap-2 items-center w-full">
            <div className="flex flex-col gap-2 w-full sm:w-2/5">
                <div
                    className="border border-black rounded p-4 flex flex-col gap-2 w-full text-xs hover:bg-gray-100 hover:cursor-pointer"
                    onClick={() => router.push('/education')}
                >
                    <div className="text-2xl font-bold">Education</div>
                    <div>Manage the education section of your resume page</div>
                </div>
                <div
                    className="border border-black rounded p-4 flex flex-col gap-2 w-full text-xs hover:bg-gray-100 hover:cursor-pointer"
                    onClick={() => router.push('/projects')}
                >
                    <div className="text-2xl font-bold">Projects</div>
                    <div>Manage the projects section of your resume page</div>
                </div>
                <div
                    className="border border-black rounded p-4 flex flex-col gap-2 w-full text-xs hover:bg-gray-100 hover:cursor-pointer"
                    onClick={() => router.push('/demos')}
                >
                    <div className="text-2xl font-bold">Demos</div>
                    <div>Manage the project demos in your portfolio</div>
                </div>
                <div
                    className="border border-black rounded p-4 flex flex-col gap-2 w-full text-xs hover:bg-gray-100 hover:cursor-pointer"
                    onClick={() => router.push('/skills')}
                >
                    <div className="text-2xl font-bold">Skills</div>
                    <div>Manage the skills section of your resume</div>
                </div>
            </div>
        </div>
    )
}
