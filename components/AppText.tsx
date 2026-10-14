import { PropsWithChildren, ReactElement } from 'react'
import { Text, View } from 'react-native'
import { ChartBar, LucideIcon } from 'lucide-react-native'
import { twMerge } from 'tailwind-merge';

type AppTextProps = {
  className?: string;
  icon?: ReactElement<React.ComponentProps<LucideIcon>>;
} & PropsWithChildren

export function AppText({ children, className, icon: Icon }: AppTextProps) {
  return (
    <View className='flex-row items-center'>
      {Icon}
      <Text className={twMerge(
        "text-white",
        className
      )}>
        {children}
      </Text>
    </View>
  )
}
