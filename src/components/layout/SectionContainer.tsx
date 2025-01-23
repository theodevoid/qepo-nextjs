import React, { forwardRef } from "react";
import { cn } from "~/lib/utils";

type SectionContainerProps = {
  padded?: boolean;
  containerClassName?: string;
};

export const SectionContainer = forwardRef<
  HTMLElement,
  React.HTMLAttributes<HTMLElement> & SectionContainerProps
>(
  (
    { className, children, padded, containerClassName, ...props },
    ref,
  ) => {
    return (
      <div className={cn("relative h-full", containerClassName)}>
        <section
          ref={ref}
          className={cn(
            "container flex flex-col lg:max-w-screen-md",
            className,
            padded ? "px-4" : "",
          )}
          {...props}
        >
          {children}
        </section>
      </div>
    );
  },
);

SectionContainer.displayName = "SectionContainer";