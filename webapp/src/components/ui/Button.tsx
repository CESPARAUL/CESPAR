"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const MotionLink = motion.create(Link);

type Variant = "primary" | "secondary" | "ghost" | "outline";
type Size = "md" | "lg";

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-cespar-red text-white shadow-lg shadow-red-500/25 hover:shadow-red-500/40 focus-visible:outline-red-400",
  secondary:
    "bg-white/5 text-white border border-white/15 hover:border-white/30 backdrop-blur-sm focus-visible:outline-white/40",
  ghost:
    "text-white/80 hover:text-white hover:bg-white/5 focus-visible:outline-white/40",
  outline:
    "bg-transparent text-white border border-white/20 hover:border-transparent hover:bg-cespar-red hover:shadow-lg hover:shadow-red-500/30 focus-visible:outline-red-400",
};

const sizeClasses: Record<Size, string> = {
  md: "px-5 py-2.5 text-sm",
  lg: "px-7 py-3.5 text-base",
};

type CommonProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: React.ReactNode;
};

type ButtonAsLink = CommonProps & {
  href: string;
  onClick?: never;
  type?: never;
};

type ButtonAsButton = CommonProps &
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: never;
  };

export function Button(props: ButtonAsLink | ButtonAsButton) {
  const { variant = "primary", size = "md", className, children } = props;
  const classes = cn(
    "group inline-flex items-center justify-center gap-2 rounded-full font-semibold tracking-tight transition-shadow duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50 disabled:pointer-events-none",
    variantClasses[variant],
    sizeClasses[size],
    className
  );

  const motionProps = {
    whileHover: { scale: 1.035 },
    whileTap: { scale: 0.97 },
    transition: { type: "spring" as const, stiffness: 400, damping: 22 },
  };

  if ("href" in props && props.href) {
    return (
      <MotionLink href={props.href} className={classes} {...motionProps}>
        {children}
      </MotionLink>
    );
  }

  const buttonProps = props as ButtonAsButton;

  return (
    <motion.button
      type={buttonProps.type ?? "button"}
      onClick={buttonProps.onClick}
      disabled={buttonProps.disabled}
      className={classes}
      {...motionProps}
    >
      {children}
    </motion.button>
  );
}
