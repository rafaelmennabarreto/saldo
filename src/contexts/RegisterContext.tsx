import { createContext, PropsWithChildren, useContext, useState } from "react";

export type RegisterData = {
  name: string;
  email: string;
  phone?: string;
  password?: string;
  confirmPassword?: string;
};

type RegisterContextType = {
  registerData: RegisterData;
  updateRegisterData: (data: Partial<RegisterData>) => void;
  resetRegisterData: () => void;
};

const RegisterContext = createContext<RegisterContextType>({} as RegisterContextType);

const initialData: RegisterData = {
  name: "",
  email: "",
  phone: "",
  password: "",
  confirmPassword: "",
};

export function RegisterProvider({ children }: PropsWithChildren) {
  const [registerData, setRegisterData] = useState<RegisterData>(initialData);

  const updateRegisterData = (data: Partial<RegisterData>) => {
    setRegisterData((prev) => ({ ...prev, ...data }));
  };

  const resetRegisterData = () => {
    setRegisterData(initialData);
  };

  return (
    <RegisterContext.Provider
      value={{
        registerData,
        updateRegisterData,
        resetRegisterData,
      }}
    >
      {children}
    </RegisterContext.Provider>
  );
}

export const useRegister = () => useContext(RegisterContext);
