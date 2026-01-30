'use client'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import TipTapImage from '@tiptap/extension-image'
import { uploadImage } from '@/app/actions' // Importing the server action
import OfficePaste from "@intevation/tiptap-extension-office-paste";

interface EditorProps {
  content: any
  onChange: (content: any) => void
}

export default function TipTap({ content, onChange }: EditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      OfficePaste,
      // FORCE the schema to recognize 'src'
      TipTapImage.configure({
        inline: true,
        allowBase64: false,
        HTMLAttributes: {
          class: 'rounded-lg max-w-full my-4 border border-navy-800',
        },
      }).extend({
        addAttributes() {
          return {
            src: {
              default: null,
              parseHTML: element => element.getAttribute('src'),
              renderHTML: attributes => {
                return {
                  src: attributes.src
                }
              }
            },
            alt: {
              default: null,
            },
            title: {
              default: null,
            }
          }
        }
      }),
    ],
    content: content, // Initialize content
    editorProps: {
      attributes: {
        class: 'prose prose-invert prose-lg max-w-none focus:outline-none min-h-[400px] text-slate-300',
      },
    },
    // CRITICAL: Ensure we trigger the update on every change
    onUpdate: ({ editor }) => {
      const json = editor.getJSON()
      // Optional Debug: Log this in browser console to verify 'src' exists before sending
      //console.log("Current JSON:", json) 
      onChange(json)
    },
  })

  // Helper to handle drag-and-drop image uploads
  const addImage = async () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.onchange = async () => {
      if (input.files?.length) {
        const file = input.files[0]
        const formData = new FormData()
        formData.append('file', file)
        
        // Call Server Action
        const url = await uploadImage(formData) 
        
        if (url) {
          editor?.chain().focus().setImage({ src: url }).run()
        }
      }
    }
    input.click()
  }

  if (!editor) return null

  return (
    <div className="w-full border border-navy-800 rounded-lg bg-navy-900 overflow-hidden">
      {/* Toolbar */}
      <div className="flex gap-2 p-3 bg-navy-950 border-b border-navy-800">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`px-3 py-1 rounded text-sm font-bold ${editor.isActive('bold') ? 'bg-chem-yellow text-navy-950' : 'text-slate-400 hover:text-white'}`}
        >
          B
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`px-3 py-1 rounded text-sm font-orbitron ${editor.isActive('heading', { level: 2 }) ? 'bg-chem-yellow text-navy-950' : 'text-slate-400 hover:text-white'}`}
        >
          H2
        </button>
        <button
          type="button"
          onClick={addImage}
          className="px-3 py-1 rounded text-sm text-slate-400 hover:text-chem-yellow"
        >
          Add Image
        </button>
      </div>
      
      {/* Writing Area */}
      <div className="p-6">
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}