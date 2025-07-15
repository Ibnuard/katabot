// context/ModalContext.tsx
"use client";

import { createContext, useContext, useState, ReactNode, useRef } from "react";

type ModalType = "loading" | "popup" | null;

interface ModalContextProps {
  showModal: () => void;
  hideModal: () => void;
  setModalType: (type: ModalType) => void;
  modalMessage: string;
  setModalMessage: (message: string) => void;
  modalType: ModalType;
  isVisible: boolean;
  onClosePress?: () => void;
  setOnClosePress: (fn?: () => void) => void;
}

const ModalContext = createContext<ModalContextProps | undefined>(undefined);

export const ModalProvider = ({ children }: { children: ReactNode }) => {
  const [modalType, setModalType] = useState<ModalType>(null);
  const [isVisible, setVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState<string>("");
  //const [onClosePress, setOnClosePress] = useState<(() => void) | undefined>();
  const onClosePressRef = useRef<(() => void) | undefined>(undefined);

  const showModal = () => setVisible(true);
  const hideModal = () => {
    if (onClosePressRef.current) {
      onClosePressRef.current();
    }
    setVisible(false);
    setModalType(null);
    onClosePressRef.current = undefined;
  };

  const setOnClosePress = (fn?: () => void) => {
    onClosePressRef.current = fn;
  };

  return (
    <ModalContext.Provider
      value={{
        showModal,
        hideModal,
        setModalType,
        modalType,
        isVisible,
        modalMessage,
        setModalMessage,
        onClosePress: onClosePressRef.current,
        setOnClosePress,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const ctx = useContext(ModalContext);
  if (!ctx) throw new Error("useModal must be used within ModalProvider");
  return ctx;
};
