import { ProjectForm } from "@/components/admin/project-form"

export default function NewProjectPage() {
  return (
    <div>
      <h1 className="font-serif text-2xl text-[#f0ebe0]">New Project</h1>
      <p className="mt-1 text-xs text-[#686058]">Add a new project to your portfolio</p>
      <div className="mt-8 max-w-3xl">
        <ProjectForm />
      </div>
    </div>
  )
}
