import { TextClassContext } from '@/components/ui/text';
import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import { Platform, Pressable } from 'react-native';

const buttonVariants = cva(
  cn(
    'group shrink-0 flex-row items-center justify-center gap-2 rounded-xl transition-all active:scale-[0.98]',
    Platform.select({
      web: "focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive whitespace-nowrap outline-none transition-all focus-visible:ring-[3px] disabled:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
    })
  ),
  {
    variants: {
      variant: {
        default: cn(
          'bg-primary-500 active:bg-primary-600',
          Platform.select({ web: 'hover:bg-primary-600' })
        ),
        destructive: cn(
          'bg-danger-500 active:bg-danger-600',
          Platform.select({
            web: 'hover:bg-danger-600 focus-visible:ring-danger-500/20',
          })
        ),
        outline: cn(
          'border border-neutral-200 bg-white active:bg-neutral-50',
          Platform.select({
            web: 'hover:bg-neutral-50',
          })
        ),
        secondary: cn(
          'bg-neutral-100 active:bg-neutral-200',
          Platform.select({ web: 'hover:bg-neutral-200' })
        ),
        ghost: cn(
          'active:bg-neutral-100',
          Platform.select({ web: 'hover:bg-neutral-100' })
        ),
        link: '',
      },
      size: {
        default: cn('h-12 px-5 py-3', Platform.select({ web: 'has-[>svg]:px-4' })),
        sm: cn('h-9 gap-1.5 rounded-lg px-3', Platform.select({ web: 'has-[>svg]:px-2.5' })),
        lg: cn('h-14 rounded-2xl px-6', Platform.select({ web: 'has-[>svg]:px-5' })),
        icon: 'h-10 w-10 rounded-xl',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

const buttonTextVariants = cva(
  cn(
    'text-sm font-extrabold font-nunito tracking-wide',
    Platform.select({ web: 'pointer-events-none transition-colors' })
  ),
  {
    variants: {
      variant: {
        default: 'text-white',
        destructive: 'text-white',
        outline: 'text-mascot-navy',
        secondary: 'text-mascot-navy',
        ghost: 'text-neutral-600 group-active:text-mascot-navy',
        link: 'text-primary-500 group-active:underline',
      },
      size: {
        default: 'text-[15px]',
        sm: 'text-[13px]',
        lg: 'text-[16px]',
        icon: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

type ButtonProps = React.ComponentProps<typeof Pressable> & React.RefAttributes<typeof Pressable> & VariantProps<typeof buttonVariants>;

function Button({ className, variant, size, ...props }: ButtonProps) {
  return (
    <TextClassContext.Provider value={buttonTextVariants({ variant, size })}>
      <Pressable
        className={cn(props.disabled && 'opacity-50', buttonVariants({ variant, size }), className)}
        role="button"
        {...props}
      />
    </TextClassContext.Provider>
  );
}

export { Button, buttonTextVariants, buttonVariants };
export type { ButtonProps };
