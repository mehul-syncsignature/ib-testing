"use client";

import { forwardRef, useImperativeHandle, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export interface ConfirmationDialogHandle {
  open: () => void;
  close: () => void;
}

export interface ConfirmationDialogProps {
  title: string;
  description: string;
  label: string;
  onOk: () => void;
  onCancel?: () => void;
}

const ConfirmationDialog = forwardRef<
  ConfirmationDialogHandle,
  ConfirmationDialogProps
>(({ title, description, onOk, onCancel, label }, ref) => {
  const [isOpen, setIsOpen] = useState(false);

  useImperativeHandle(ref, () => ({
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
  }));

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-lg p-4 sm:rounded-2xl sm:p-6 ">
        <DialogHeader className="mb-2">
          <DialogTitle className="text-lg font-semibold">{title}</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground mt-2">
            {description}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="mt-4 flex justify-end gap-3">
          <Button variant="outline" onClick={onCancel} autoFocus>
            Cancel
          </Button>
          <Button onClick={onOk}>{label}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
});

ConfirmationDialog.displayName = "ConfirmationDialog";

export { ConfirmationDialog };
