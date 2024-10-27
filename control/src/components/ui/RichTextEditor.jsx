import React, { memo, useRef, useState } from 'react';
import { useFormikContext } from 'formik';
import { Bold, Italic, ChevronDown, AlignLeft, AlignCenter, AlignRight, AlignJustify, List, ListOrdered, Indent, Outdent, Undo, Redo, Table } from "lucide-react";
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

const RichTextEditor = memo(({ label, labelClass, className, initialValue, onEditorChange, showErrorMsg, ...props }) => {
    const editorRef = useRef(null);
    const [isFullScreen, setIsFullScreen] = useState(false);

    const applyFormat = (command, value = null) => {
        document.execCommand(command, false, value);
        editorRef.current.focus();
    };

    console.log(initialValue)

    const handleContentChange = () => {
        const content = editorRef.current.innerHTML;
        if (onEditorChange) {
            onEditorChange(content);
        }
    };

    const toggleFullScreen = () => {
        setIsFullScreen(!isFullScreen);
    };

    return (
        <Card className="w-full" bodyClass='py-3'>
            <label htmlFor={props.id || props.name} className={`block mb-3 text-sm font-medium text-gray-700 dark:text-slate-300 ${labelClass}`}>
                {label}
            </label>
            <div
                className={`flex flex-wrap gap-1 p-2 bg-muted rounded-t-lg text-slate-50 bg-indigo-900 shadow-b-lg format-buttons ${isFullScreen ? 'open' : ''}`}
            >
                {/* Botones de formato */}
                <Button
                    onClick={() => applyFormat('undo')}
                    variant="ghost"
                    size="sm"
                    className={`text-primary ${isFullScreen ? 'h-12' : 'h-4'}`}
                >
                    <Undo className={`h-4 w-4 ${isFullScreen ? 'h-6' : 'h-4'}`} />
                </Button>
                <Button
                    onClick={() => applyFormat('redo')}
                    variant="ghost"
                    size="sm"
                    className={`text-primary ${isFullScreen ? 'h-12' : 'h-4'}`}
                >
                    <Redo className={`h-4 w-4 ${isFullScreen ? 'h-6' : 'h-4'}`} />
                </Button>
                <Button
                    onClick={() => applyFormat('bold')}
                    variant="ghost"
                    size="sm"
                    className={`text-primary ${isFullScreen ? 'h-12' : 'h-4'}`}
                >
                    <Bold className={`h-4 w-4 ${isFullScreen ? 'h-6' : 'h-4'}`} />
                </Button>
                <Button
                    onClick={() => applyFormat('italic')}
                    variant="ghost"
                    size="sm"
                    className={`text-primary ${isFullScreen ? 'h-12' : 'h-4'}`}
                >
                    <Italic className={`h-4 w-4 ${isFullScreen ? 'h-6' : 'h-4'}`} />
                </Button>
                <Button
                    onClick={() => applyFormat('justifyLeft')}
                    variant="ghost"
                    size="sm"
                    className={`text-primary ${isFullScreen ? 'h-12' : 'h-4'}`}
                >
                    <AlignLeft className={`h-4 w-4 ${isFullScreen ? 'h-6' : 'h-4'}`} />
                </Button>
                <Button
                    onClick={toggleFullScreen}
                    variant="ghost"
                    size="sm"
                    className={`text-primary md:hidden ${isFullScreen ? 'h-12 hidden' : 'h-4'}`}
                >
                    <ChevronDown className={`h-4 w-4 ${isFullScreen ? 'h-6' : 'h-4'}`} />
                </Button>
                <Button
                    onClick={() => applyFormat('justifyCenter')}
                    variant="ghost"
                    size="sm"
                    className={`text-primary ${isFullScreen ? 'h-12' : 'h-4'}`}
                >
                    <AlignCenter className={`h-4 w-4 ${isFullScreen ? 'h-6' : 'h-4'}`} />
                </Button>
                <Button
                    onClick={() => applyFormat('justifyRight')}
                    variant="ghost"
                    size="sm"
                    className={`text-primary ${isFullScreen ? 'h-12' : 'h-4'}`}
                >
                    <AlignRight className={`h-4 w-4 ${isFullScreen ? 'h-6' : 'h-4'}`} />
                </Button>
                <Button
                    onClick={() => applyFormat('justifyFull')}
                    variant="ghost"
                    size="sm"
                    className={`text-primary ${isFullScreen ? 'h-12' : 'h-4'}`}
                >
                    <AlignJustify className={`h-4 w-4 ${isFullScreen ? 'h-6' : 'h-4'}`} />
                </Button>
                {/* Botón para abrir en pantalla completa */}
                <Button
                    onClick={toggleFullScreen}
                    variant="ghost"
                    size="sm"
                    className={`text-primary ${isFullScreen ? 'h-12' : 'h-4'} md:hidden`}
                >
                    {isFullScreen ? 'Cerrar Toolbar' : ''}
                </Button>
            </div>
            <div
                ref={editorRef}
                contentEditable
                onInput={handleContentChange}
                className={`min-h-[200px] p-4 shadow-md rounded-b-lg focus:outline-blue-500 bg-black-50 text-slate-950 ${isFullScreen ? 'h-[40vh]' : ''}`}
                aria-label="Área de edición de texto enriquecido"
            >
                {initialValue}
            </div>
        </Card>
    );
});

export default RichTextEditor;

