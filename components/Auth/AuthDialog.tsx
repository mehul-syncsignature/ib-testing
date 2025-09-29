// components/Auth/AuthDialog.tsx

import React, { forwardRef, useImperativeHandle, useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import SignUp from "./components/SignUp/SignUp";
import SignIn from "./components/SignIn";

export interface AuthDialogHandle {
  open: () => void;
  close: () => void;
  setAuthView: (view: "signIn" | "signUp") => void;
}

interface AuthDialogProps {
  initialView?: "signIn" | "signUp";
}

const AuthDialog = forwardRef<AuthDialogHandle, AuthDialogProps>(
  ({ initialView = "signUp" }, ref) => {
    const [open, setOpen] = useState(false);
    const [view, setView] = useState<"signIn" | "signUp">(initialView);

    useImperativeHandle(ref, () => ({
      open: () => setOpen(true),
      close: () => setOpen(false),
      setAuthView: (newView) => setView(newView),
    }));

    const handleSetView = (view: "signIn" | "signUp") => {
      setView(view);
    };

    const handleCloseAuth = () => {
      setOpen(false);
    };


    return (
      <>
        {/* Render UpgradeDialog outside of the main dialog */}

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTitle />
          <DialogContent className="max-w-[25vw] h-fit p-0 overflow-hidden border-0 outline-none min-w-[400px]">
            {view === "signUp" ? (
              <SignUp
                handleSetView={handleSetView}
                onCloseAuth={handleCloseAuth}
              />
            ) : (
              <SignIn
                handleSetView={handleSetView}
                onCloseAuth={handleCloseAuth}
              />
            )}
          </DialogContent>
        </Dialog>
      </>
    );
  }
);

AuthDialog.displayName = "AuthDialog";

export default AuthDialog;
