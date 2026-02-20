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
          Nahyeon Cho
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
          {/*<div className="flex justify-center gap-4">
            <Link href="#" className="p-2 bg-navy-900 rounded-lg hover:bg-chem-yellow hover:text-navy-950 transition-colors border border-navy-800">
              <Github className="w-5 h-5" />
            </Link>
            <Link href="#" className="p-2 bg-navy-900 rounded-lg hover:bg-chem-yellow hover:text-navy-950 transition-colors border border-navy-800">
              <Linkedin className="w-5 h-5" />
            </Link>
            <Link href="mailto:student@example.com" className="p-2 bg-navy-900 rounded-lg hover:bg-chem-yellow hover:text-navy-950 transition-colors border border-navy-800">
              <Mail className="w-5 h-5" />
            </Link>
          </div>*/}
        </div>

        {/* Right: The Content */}
        <div className="md:col-span-2 space-y-6 text-slate-300 leading-relaxed">
          <div className="prose prose-invert max-w-none">
            <h3 className="text-xl font-orbitron text-white mb-4">About Me</h3>
            <p>
              My name is Hannah, and I created <em>Chemtree</em> to better understand chemistry beyond memorizing formulas.</p>
              
              <p>When I first started learning chemistry, I could follow individual lessons, but the bigger picture often felt unclear. I wanted to understand how concepts were connected and why reactions worked the way they did. Chemtree began as a way to organize what I was learning and turn questions into clear explanations.</p>

<p>Through researching topics like everyday chemical reactions and new scientific developments, I’ve learned to think more deeply about how chemistry shapes the world around us. Writing each post helps me strengthen my understanding while making complex ideas more accessible.</p>

<p>I built this website on my own and learned a lot through trial and error. Fixing mistakes and reworking pages forced me to be patient and think through problems instead of rushing past them.</p>

<p><em>Chemtree</em> is still growing as I grow. It shows how I learn, how I question things, and how I try to understand science in a deeper and more connected way.</p>

          </div>

          {/* Current Focus Section */}
          <div className="bg-navy-900/50 p-6 rounded-lg border border-navy-800 border-l-4 border-l-chem-green">
            <h4 className="text-chem-green font-bold font-orbitron mb-2 text-sm uppercase">
              What I Focus On
            </h4>
            <p>Through <em>Chemtree</em>, I explore several areas of chemistry:</p>
            <ul className="list-disc list-inside space-y-1 text-sm text-slate-300">
              <li>Breaking down core concepts from my coursework</li>
              <li>Explaining chemistry behind everyday phenomena</li>
              <li>Researching new scientific developments and innovations</li>
              <li>Documenting experiments and hands-on learning</li>
              <li>Connecting molecular processes to real-world applications</li>
            </ul>
          </div>
        </div>
      </div>

      {/* 3. The "Meta" Section (Built with...) */}
      {/*<div className="pt-8 border-t border-navy-800">
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
      </div>*/}

    </div>
  )
}