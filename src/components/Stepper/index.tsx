import { AppText } from "@components/AppText";
import { View, ViewProps } from "react-native";

export interface Step {
  id: string;
  name: string;
  url: string;
}

export type StepperProps = ViewProps & {
  steps: Step[];
  currentStep?: number;
};

export function Stepper({ steps, currentStep = 1, className, ...rest }: StepperProps) {
  const totalSteps = steps.length;
  const safeStep = totalSteps > 0 ? Math.max(1, Math.min(currentStep, totalSteps)) : 0;
  const stepIndex = safeStep > 0 ? safeStep - 1 : 0;
  const currentStepName = steps[stepIndex]?.name ?? "";
  const progressPercentage = totalSteps > 0 ? (safeStep / totalSteps) * 100 : 0;

  return (
    <View className={`flex-col gap-2 ${className ?? ""}`} {...rest}>
      <View className="flex-row justify-between items-center">
        <AppText className="text-orange-200!">
          Passo {safeStep} de {totalSteps}
        </AppText>
        <AppText className="text-neutral-200!">
          {currentStepName}
        </AppText>
      </View>
      <View className="w-full h-2 bg-neutral-700 rounded-full overflow-hidden">
        <View
          className="h-full bg-orange-500 rounded-full"
          style={{ width: `${progressPercentage}%` }}
        />
      </View>
    </View>
  );
}

