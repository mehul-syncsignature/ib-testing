/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import dynamic from "next/dynamic";
import {
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

const RichTextEditor = dynamic(() => import("../RichTextEditor"), {
  ssr: false,
});

interface RichTextFieldProps {
  name: string;
  form: any;
  placeholder?: string;
  height?: string;
  isToolbarVisible?: boolean;
  onContentChange: (content: string, fieldName: string) => void;
}

export const RichTextField = ({
  name,
  form,
  height = "100px",
  isToolbarVisible = true,
  onContentChange,
}: RichTextFieldProps) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormControl className="focus:outline-none">
            <RichTextEditor
              isToolbarVisible={isToolbarVisible}
              initialContent={field.value || ""}
              onContentChange={(content) => onContentChange(content, name)}
              fieldName={name}
              label=""
              height={height}
            />
          </FormControl>
          <FormMessage className="px-1 pt-1" />
        </FormItem>
      )}
    />
  );
};
