'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Eye, Edit } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export function MarkdownEditor({ value, onChange, placeholder, disabled }: MarkdownEditorProps) {
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');

  return (
    <div className="w-full">
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'edit' | 'preview')}>
        <div className="flex items-center justify-between mb-2">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="edit" className="flex items-center gap-2">
              <Edit className="h-4 w-4" />
              Editar
            </TabsTrigger>
            <TabsTrigger value="preview" className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Vista previa
            </TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="edit" className="mt-0">
          <Textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder || "Escribe el contenido en Markdown aquí..."}
            className="min-h-[300px] resize-none font-mono text-sm"
            disabled={disabled}
          />
          <div className="mt-2">
            <Badge variant="secondary" className="text-xs">
              Markdown compatible con GitHub Flavored Markdown
            </Badge>
          </div>
        </TabsContent>
        
        <TabsContent value="preview" className="mt-0">
          <div className="border rounded-md p-4 min-h-[300px] bg-background">
            <div className="prose prose-sm max-w-none dark:prose-invert">
              {value ? (
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {value}
                </ReactMarkdown>
              ) : (
                <div className="text-muted-foreground italic">
                  No hay contenido para previsualizar. Escribe algo en la pestaña de edición.
                </div>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}