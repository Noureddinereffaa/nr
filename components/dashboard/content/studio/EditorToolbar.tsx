import React from 'react';
import {
    Bold, Italic, Underline, Link2, Image, List,
    ListOrdered, Heading1, Heading2, Quote, Code2,
    AlignLeft, AlignCenter, AlignRight, Undo2, Redo2,
    Sparkles, Wand2
} from 'lucide-react';

interface EditorToolbarProps {
    insertAtCursor: (before: string, after?: string) => void;
    aiStatus: 'idle' | 'working';
    onAIAction: (action: 'improve' | 'expand' | 'summarize' | 'outline') => void;
}

const EditorToolbar: React.FC<EditorToolbarProps> = ({ insertAtCursor, aiStatus, onAIAction }) => {

    const tools = [
        { icon: Bold, action: () => insertAtCursor('**', '**'), label: 'Bold' },
        { icon: Italic, action: () => insertAtCursor('*', '*'), label: 'Italic' },
        { icon: Underline, action: () => insertAtCursor('<u>', '</u>'), label: 'Underline' },
        { divider: true },
        { icon: Heading1, action: () => insertAtCursor('# ', '\n'), label: 'H1' },
        { icon: Heading2, action: () => insertAtCursor('## ', '\n'), label: 'H2' },
        { divider: true },
        { icon: List, action: () => insertAtCursor('- ', '\n'), label: 'Bullet List' },
        { icon: ListOrdered, action: () => insertAtCursor('1. ', '\n'), label: 'Numbered List' },
        { divider: true },
        { icon: Quote, action: () => insertAtCursor('> ', '\n'), label: 'Quote' },
        { icon: Code2, action: () => insertAtCursor('```\n', '\n```'), label: 'Code Block' },
        { icon: Link2, action: () => insertAtCursor('[', '](url)'), label: 'Link' },
        { icon: Image, action: () => insertAtCursor('![Alt text](', ')'), label: 'Image' },
    ];

    return (
        <div className="h-14 bg-slate-900 border-b border-white/5 px-4 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-1">
                {tools.map((tool, idx) => (
                    tool.divider ? (
                        <div key={idx} className="w-px h-6 bg-white/10 mx-2" />
                    ) : (
                        <button
                            key={idx}
                            onClick={tool.action}
                            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
                            title={tool.label}
                        >
                            {tool.icon && <tool.icon size={18} />}
                        </button>
                    )
                ))}
            </div>

            <div className="flex items-center gap-2">
                <button
                    onClick={() => onAIAction('improve')}
                    disabled={aiStatus === 'working'}
                    className="flex items-center gap-2 px-3 py-1.5 bg-indigo-500/10 text-indigo-400 rounded-lg hover:bg-indigo-500/20 text-xs font-bold transition-colors disabled:opacity-50"
                >
                    <Wand2 size={14} />
                    تحسين الصياغة
                </button>
                <button
                    onClick={() => onAIAction('expand')}
                    disabled={aiStatus === 'working'}
                    className="flex items-center gap-2 px-3 py-1.5 bg-purple-500/10 text-purple-400 rounded-lg hover:bg-purple-500/20 text-xs font-bold transition-colors disabled:opacity-50"
                >
                    <Sparkles size={14} />
                    توسيع المحتوى
                </button>
            </div>
        </div>
    );
};

export default EditorToolbar;
