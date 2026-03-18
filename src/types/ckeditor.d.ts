declare module "@ckeditor/ckeditor5-react" {
  import type { ComponentType } from "react";

  export const CKEditor: ComponentType<{
    editor: unknown;
    data?: string;
    disabled?: boolean;
    config?: unknown;
    onChange?: (event: unknown, editor: { getData: () => string }) => void;
  }>;
}

declare module "@ckeditor/ckeditor5-build-classic" {
  const ClassicEditor: unknown;
  export default ClassicEditor;
}

