/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import {
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface SimpleTextFieldProps {
  name: string;
  form: any;
  placeholder?: string;
}

export const SimpleTextField = ({
  name,
  form,
  placeholder = "",
}: SimpleTextFieldProps) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <Input
              {...field}
              placeholder={placeholder}
              className="border rounded-md bg-white"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
