// modules/Brand/components/DashboardControl/components/CreateBrandDialog.tsx

import React, { forwardRef, useImperativeHandle, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const createBrandSchema = z.object({
  name: z
    .string()
    .min(2, "Brand name must be at least 2 characters")
    .max(50, "Brand name must be less than 50 characters"),
});

type CreateBrandFormData = z.infer<typeof createBrandSchema>;

export interface CreateBrandDialogHandle {
  open: () => void;
  close: () => void;
}

interface CreateBrandDialogProps {
  onSubmit: (brandName: string) => void;
}

const CreateBrandDialog = forwardRef<
  CreateBrandDialogHandle,
  CreateBrandDialogProps
>(({ onSubmit }, ref) => {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<CreateBrandFormData>({
    resolver: zodResolver(createBrandSchema),
    defaultValues: {
      name: "",
    },
  });

  useImperativeHandle(ref, () => ({
    open: () => {
      setOpen(true);
      form.reset(); // Reset form when opening
    },
    close: () => {
      setOpen(false);
      form.reset(); // Reset form when closing
    },
  }));

  const handleSubmit = async (formData: CreateBrandFormData) => {
    setIsSubmitting(true);
    try {
      await onSubmit(formData.name);
      setOpen(false);
      form.reset();
    } catch (error) {
      // Error handling will be done by the parent component
      console.error("Error creating brand:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setOpen(false);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-md p-4">
        <DialogHeader className="pt-4">
          <DialogTitle>Create New Brand</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Brand Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter brand name"
                      {...field}
                      autoFocus
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create Brand"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
});

CreateBrandDialog.displayName = "CreateBrandDialog";

export default CreateBrandDialog;
