"use client";

import { useEffect, useMemo, useState } from "react";

type Props = {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  disabled?: boolean;
};

type CKEditorComponent = React.ComponentType<{
  editor: unknown;
  data?: string;
  disabled?: boolean;
  config?: unknown;
  onChange?: (event: unknown, editor: { getData: () => string }) => void;
}>;

export default function RichTextEditor({
  value,
  onChange,
  placeholder,
  disabled,
}: Props) {
  const [CKEditor, setCKEditor] = useState<CKEditorComponent | null>(null);
  const [ClassicEditor, setClassicEditor] = useState<unknown>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const [{ CKEditor }, { default: ClassicEditor }] = await Promise.all([
        import("@ckeditor/ckeditor5-react"),
        import("@ckeditor/ckeditor5-build-classic"),
      ]);
      if (cancelled) return;
      setCKEditor(() => CKEditor as unknown as CKEditorComponent);
      setClassicEditor(() => ClassicEditor);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const config = useMemo(() => {
    return {
      placeholder,
      toolbar: {
        items: [
          "bold",
          "italic",
          "link",
          "bulletedList",
          "numberedList",
          "|",
          "undo",
          "redo",
        ],
      },
    };
  }, [placeholder]);

  if (!CKEditor || !ClassicEditor) {
    return (
      <div className="ck-matte">
        <div className="rounded-xl border border-black/5 bg-black/[0.03] px-4 py-3 text-sm text-[#4A4A4A] shadow-sm">
          Loading editor…
        </div>
      </div>
    );
  }

  return (
    <div className="ck-matte">
      <CKEditor
        editor={ClassicEditor}
        data={value}
        disabled={disabled}
        config={config}
        onChange={(_event, editor) => {
          onChange(editor.getData());
        }}
      />
    </div>
  );
}

