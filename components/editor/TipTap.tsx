'use client'

import { useEditor, EditorContent, Extension } from '@tiptap/react'
import { StarterKit } from '@tiptap/starter-kit'
import { TextStyleKit } from '@tiptap/extension-text-style'
import TipTapImage from '@tiptap/extension-image'
import Highlight from '@tiptap/extension-highlight'
import OfficePaste from "@intevation/tiptap-extension-office-paste"
import { uploadImage } from '@/app/actions'
import { useImperativeHandle } from 'react'
import { Undo, Redo, Baseline, Highlighter } from 'lucide-react'

// --- MAIN COMPONENT ---

interface EditorProps {
  content: any
  onChange: (content: any) => void
  ref?: React.Ref<any>
}

export default function TipTap({ content, onChange, ref }: EditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        undoRedo: {
          depth: 100,
        },
        heading: { levels: [1, 2, 3] },
      }),
      TextStyleKit,
      Highlight.configure({ multicolor: true }), 
      OfficePaste,
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
              renderHTML: attributes => ({ src: attributes.src })
            },
            alt: { default: null },
            title: { default: null }
          }
        }
      }),
    ],
    content: content,
    editorProps: {
      attributes: {
        class: 'prose prose-fix prose-invert prose-lg max-w-none focus:outline-none min-h-[400px]',
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getJSON())
    },
  })

  useImperativeHandle(ref, () => ({
    setContent: (json: any) => editor?.commands.setContent(json)
  }), [editor])

  const addImage = async () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.onchange = async () => {
      if (input.files?.length) {
        const file = input.files[0]
        const formData = new FormData()
        formData.append('file', file)
        
        const url = await uploadImage(formData) 
        if (url) {
          editor?.chain().focus().setImage({ src: url }).run()
        }
      }
    }
    input.click()
  }

  const setLink = () => {
    const previousUrl = editor?.getAttributes('link').href
    const url = window.prompt('URL', previousUrl)
    if (url === null) return 
    if (url === '') {
      editor?.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }
    editor?.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
  }

  if (!editor) return null

  // Added disabled classes here (opacity-40 and cursor-not-allowed)
  const btnClass = (isActive: boolean) => 
    `px-2 py-1 rounded text-sm font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center ${isActive ? 'bg-chem-yellow text-navy-950' : 'text-slate-400 hover:text-white hover:bg-navy-800'}`

  const currentTextColor = editor.getAttributes('textStyle').color || '#ffffff'
  const currentHighlightColor = editor.getAttributes('highlight').color || '#000000'

  return (
    <div className="w-full border border-navy-800 rounded-lg bg-navy-900 overflow-hidden">
      
      {/* Toolbar */}
      <div className="flex flex-wrap gap-2 p-3 bg-navy-950 border-b border-navy-800 items-center">
        
        {/* 1. Headings Group */}
        <div className="flex gap-1 border-r border-navy-800 pr-2">
          <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className={btnClass(editor.isActive('heading', { level: 1 }))}>H1</button>
          <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={btnClass(editor.isActive('heading', { level: 2 }))}>H2</button>
          <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} className={btnClass(editor.isActive('heading', { level: 3 }))}>H3</button>
        </div>

        {/* 2. Text Styles Group */}
        <div className="flex gap-1 border-r border-navy-800 pr-2">
          <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={btnClass(editor.isActive('bold'))}>B</button>
          <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={btnClass(editor.isActive('italic'))}>I</button>
          <button type="button" onClick={() => editor.chain().focus().toggleUnderline().run()} className={btnClass(editor.isActive('underline'))}>U</button>
          <button type="button" onClick={() => editor.chain().focus().toggleStrike().run()} className={btnClass(editor.isActive('strike'))}>S</button>
          <button type="button" onClick={() => editor.chain().focus().toggleCode().run()} className={btnClass(editor.isActive('code'))}>{'</>'}</button>
          <button type="button" onClick={setLink} className={btnClass(editor.isActive('link'))}>🔗</button>
        </div>

        {/* 3. Lists Group */}
        <div className="flex gap-1 border-r border-navy-800 pr-2">
          <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className={btnClass(editor.isActive('bulletList'))}>• List</button>
          <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()} className={btnClass(editor.isActive('orderedList'))}>1. List</button>
        </div>

        {/* 4. Blocks Group */}
        <div className="flex gap-1 border-r border-navy-800 pr-2">
          <button type="button" onClick={() => editor.chain().focus().toggleCodeBlock().run()} className={btnClass(editor.isActive('codeBlock'))}>Code Block</button>
          <button type="button" onClick={() => editor.chain().focus().toggleBlockquote().run()} className={btnClass(editor.isActive('blockquote'))}>❞</button>
          <button type="button" onClick={() => editor.chain().focus().setHorizontalRule().run()} className={btnClass(false)}>—</button>
        </div>

        {/* 5. Colors Group */}
        <div className="flex gap-1 border-r border-navy-800 pr-2 items-center">
          {/* Text Color Wrapper */}
          <label className="relative flex items-center justify-center p-1.5 rounded cursor-pointer hover:bg-navy-800 transition-colors" title="Text Color">
            <Baseline size={18} color={currentTextColor} />
            <input 
              type="color" 
              onInput={event => editor.chain().focus().setColor((event.target as HTMLInputElement).value).run()} 
              value={currentTextColor}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
            />
          </label>
          
          {/* Highlight Color Wrapper */}
          <label className="relative flex items-center justify-center p-1.5 rounded cursor-pointer hover:bg-navy-800 transition-colors" title="Background Color">
            <Highlighter size={18} color={currentHighlightColor === '#000000' ? '#94a3b8' : currentHighlightColor} />
            <input 
              type="color" 
              onInput={event => editor.chain().focus().toggleHighlight({ color: (event.target as HTMLInputElement).value }).run()} 
              value={currentHighlightColor}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
            />
          </label>
        </div>

        {/* 6. Select Menus Group */}
        <div className="flex gap-2 border-r border-navy-800 pr-2 items-center text-sm text-slate-400">
          <select 
            onChange={(e) => editor.chain().focus().setFontFamily(e.target.value).run()}
            className="bg-navy-900 border border-navy-800 rounded px-1 py-1 focus:outline-none focus:border-chem-yellow"
          >
            <option value="">Font Family</option>
            <option value="Inter">Inter</option>
            <option value="Comic Sans MS, Comic Sans">Comic Sans</option>
            <option value="serif">Serif</option>
            <option value="monospace">Monospace</option>
          </select>

          <select 
             onChange={(e) => editor.chain().focus().setFontSize(e.target.value).run()}
             className="bg-navy-900 border border-navy-800 rounded px-1 py-1 focus:outline-none focus:border-chem-yellow"
          >
            <option value="">Size</option>
            <option value="12px">12px</option>
            <option value="16px">16px</option>
            <option value="20px">20px</option>
            <option value="24px">24px</option>
          </select>

          <select 
             onChange={(e) => editor.chain().focus().setLineHeight(e.target.value).run()}
             className="bg-navy-900 border border-navy-800 rounded px-1 py-1 focus:outline-none focus:border-chem-yellow"
          >
            <option value="">Line Ht.</option>
            <option value="1">1</option>
            <option value="1.5">1.5</option>
            <option value="2">2</option>
          </select>
        </div>

        {/* 7. Undo/Redo Group */}
        <div className="flex gap-1 pr-2">
          <button type="button" onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} className={btnClass(false)}>
            <Undo size={16} />
          </button>
          <button type="button" onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} className={btnClass(false)}>
            <Redo size={16} />
          </button>
        </div>

        {/* Media Group */}
        <div className="ml-auto">
          <button type="button" onClick={addImage} className="px-3 py-1 rounded text-sm bg-navy-800 text-slate-300 hover:text-chem-yellow hover:bg-navy-700 transition-colors">
            + Image
          </button>
        </div>

      </div>
      
      {/* Writing Area */}
      <div className="p-6">
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}