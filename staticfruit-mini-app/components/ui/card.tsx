import React from 'react'; import clsx from 'clsx';

interface CardProps {
  className?: string;
  children: React.ReactNode;
}

interface CardHeaderProps {
  className?: string;
  children: React.ReactNode;
}

interface CardTitleProps {
  className?: string;
  children: React.ReactNode;
}

interface CardContentProps {
  className?: string;
  children: React.ReactNode;
}

export function Card({ className = '', children }: CardProps) {
  return <div className={clsx('rounded-2xl border border-white/10 bg-space text-mist shadow', className)}>{children}</div>;
}

export function CardHeader({ className = '', children }: CardHeaderProps) {
  return <div className={clsx('px-4 pt-4', className)}>{children}</div>;
}

export function CardTitle({ className = '', children }: CardTitleProps) {
  return <div className={clsx('text-sm font-semibold', className)}>{children}</div>;
}

export function CardContent({ className = '', children }: CardContentProps) {
  return <div className={clsx('px-4 pb-4 pt-2 space-y-3', className)}>{children}</div>;
}
