"use client";

import * as React from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";
import { cn } from "@/lib/utils";
import { initials } from "@/lib/utils";

// ─── Avatar sizes ─────────────────────────────────────────────────────────────

const avatarSizeClasses = {
  xs:  "h-6 w-6 text-[10px]",
  sm:  "h-8 w-8 text-xs",
  md:  "h-10 w-10 text-sm",
  lg:  "h-12 w-12 text-base",
  xl:  "h-16 w-16 text-lg",
  "2xl": "h-20 w-20 text-xl",
};

// ─── Root ─────────────────────────────────────────────────────────────────────

type AvatarSize = keyof typeof avatarSizeClasses;

interface AvatarRootProps
  extends React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root> {
  size?: AvatarSize;
}

const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  AvatarRootProps
>(({ className, size = "md", ...props }, ref) => (
  <AvatarPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex shrink-0 overflow-hidden rounded-full",
      avatarSizeClasses[size],
      className
    )}
    {...props}
  />
));
Avatar.displayName = AvatarPrimitive.Root.displayName;

// ─── Image ────────────────────────────────────────────────────────────────────

const AvatarImage = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Image>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Image
    ref={ref}
    className={cn("aspect-square h-full w-full object-cover", className)}
    {...props}
  />
));
AvatarImage.displayName = AvatarPrimitive.Image.displayName;

// ─── Fallback ─────────────────────────────────────────────────────────────────

const AvatarFallback = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    className={cn(
      "flex h-full w-full items-center justify-center rounded-full",
      "bg-brand-muted/60 text-brand-light font-semibold tracking-wide",
      className
    )}
    {...props}
  />
));
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName;

// ─── Convenience component ────────────────────────────────────────────────────

interface UserAvatarProps {
  name?: string | null;
  image?: string | null;
  size?: AvatarSize;
  className?: string;
}

function UserAvatar({ name, image, size = "md", className }: UserAvatarProps) {
  return (
    <Avatar size={size} className={className}>
      {image && <AvatarImage src={image} alt={name ?? "User"} />}
      <AvatarFallback>{initials(name)}</AvatarFallback>
    </Avatar>
  );
}

export { Avatar, AvatarImage, AvatarFallback, UserAvatar };
