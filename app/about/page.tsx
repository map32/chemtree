// src/app/about/page.tsx
import { FlaskConical, Github, Mail, Linkedin, Code2 } from 'lucide-react'
import Link from 'next/link'

export default function AboutPage() {
  return (
    <div className="space-y-12 animate-in fade-in duration-500">
      
      {/* 1. Header Section */}
      <div className="border-b border-navy-800 pb-6">
        <h1 className="text-4xl font-orbitron font-bold text-white mb-2">
          About the <span className="text-chem-yellow">Chemist</span>
        </h1>
        <p className="text-slate-400 font-mono text-sm">
          // Subject: [Your Name] // Status: Active
        </p>
      </div>

      {/* 2. Profile & Bio Grid */}
      <div className="grid md:grid-cols-3 gap-8 items-start">
        
        {/* Left: Profile Image Placeholder */}
        <div className="md:col-span-1 space-y-4">
          <div className="aspect-square bg-navy-900 rounded-xl border-2 border-navy-800 flex items-center justify-center relative overflow-hidden group">
            {/* Placeholder for real image */}
            <div className="absolute inset-0 bg-gradient-to-tr from-chem-green/20 to-transparent" />
            <FlaskConical className="w-24 h-24 text-slate-600 group-hover:text-chem-yellow transition-colors duration-300" />
            <span className="absolute bottom-4 text-xs font-mono text-slate-500">
              [Insert Profile.jpg]
            </span>
          </div>
          
          {/* Social Links */}
          <div className="flex justify-center gap-4">
            <Link href="#" className="p-2 bg-navy-900 rounded-lg hover:bg-chem-yellow hover:text-navy-950 transition-colors border border-navy-800">
              <Github className="w-5 h-5" />
            </Link>
            <Link href="#" className="p-2 bg-navy-900 rounded-lg hover:bg-chem-yellow hover:text-navy-950 transition-colors border border-navy-800">
              <Linkedin className="w-5 h-5" />
            </Link>
            <Link href="mailto:student@example.com" className="p-2 bg-navy-900 rounded-lg hover:bg-chem-yellow hover:text-navy-950 transition-colors border border-navy-800">
              <Mail className="w-5 h-5" />
            </Link>
          </div>
        </div>

        {/* Right: The Content */}
        <div className="md:col-span-2 space-y-6 text-slate-300 leading-relaxed">
          <div className="prose prose-invert max-w-none">
            <h3 className="text-xl font-orbitron text-white mb-4">Hypothesis & Objective</h3>
            <p>
              Welcome to <strong>Chemtree</strong>. I am a high school student with a deep fascination for the molecular world. 
              This blog serves as my digital laboratory notebook—a place where I document my experiments, 
              break down complex chemical concepts, and track my daily learning in AP Chemistry and beyond.
            </p>
            <p>
              My goal isn't just to memorize the periodic table, but to understand the <em>why</em> and <em>how</em> 
              behind the reactions that shape our universe.
            </p>
          </div>

          {/* Current Focus Section */}
          <div className="bg-navy-900/50 p-6 rounded-lg border border-navy-800 border-l-4 border-l-chem-green">
            <h4 className="text-chem-green font-bold font-orbitron mb-2 text-sm uppercase">
              Current Research Focus
            </h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-slate-300">
              <li>Stoichiometry and limiting reactants in home experiments</li>
              <li>Understanding Organic Chemistry mechanisms</li>
              <li>Analyzing the environmental impact of industrial polymers</li>
            </ul>
          </div>
        </div>
      </div>

      {/* 3. The "Meta" Section (Built with...) */}
      <div className="pt-8 border-t border-navy-800">
        <h3 className="text-lg font-orbitron text-white mb-6 flex items-center gap-2">
          <Code2 className="w-5 h-5 text-chem-yellow" />
          Lab Equipment (Tech Stack)
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { name: "Next.js", desc: "React Framework" },
            { name: "Supabase", desc: "Database & Auth" },
            { name: "Tailwind CSS", desc: "Styling Engine" },
            { name: "TipTap", desc: "Headless Editor" }
          ].map((tech) => (
            <div key={tech.name} className="bg-navy-900 p-4 rounded-lg border border-navy-800">
              <div className="font-bold text-slate-200">{tech.name}</div>
              <div className="text-xs text-slate-500 font-mono">{tech.desc}</div>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}