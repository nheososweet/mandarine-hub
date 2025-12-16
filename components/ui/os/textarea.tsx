import * as React from "react";

import { cn } from "@/lib/utils";

type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  className?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  isExpanded?: boolean;
};

const MIN_HEIGHT = 40;
const MAX_HEIGHT = 96;

const TextArea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    { className, value, onChange, isExpanded = false, ...props },
    forwardedRef
  ) => {
    const [showScroll, setShowScroll] = React.useState(false);
    const textareaRef = React.useRef<HTMLTextAreaElement | null>(null);

    const adjustHeight = React.useCallback(() => {
      const textarea = textareaRef.current;
      if (!textarea) return;

      if (isExpanded) {
        // Khi expanded, set height cố định để đẩy message area lên
        const expandedHeight = 500; // 500px height khi expanded
        textarea.style.height = `${expandedHeight}px`;
        setShowScroll(textarea.scrollHeight > expandedHeight);
      } else {
        textarea.style.height = `${MIN_HEIGHT}px`;
        const { scrollHeight } = textarea;
        const newHeight = Math.min(
          Math.max(scrollHeight, MIN_HEIGHT),
          MAX_HEIGHT
        );
        textarea.style.height = `${newHeight}px`;
        setShowScroll(scrollHeight > MAX_HEIGHT);
      }
    }, [isExpanded]);

    const handleChange = React.useCallback(
      (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const cursorPosition = e.target.selectionStart;
        onChange?.(e);
        requestAnimationFrame(() => {
          adjustHeight();
          if (textareaRef.current) {
            textareaRef.current.setSelectionRange(
              cursorPosition,
              cursorPosition
            );
          }
        });
      },
      [onChange, adjustHeight]
    );

    const handleRef = React.useCallback(
      (node: HTMLTextAreaElement | null) => {
        const ref = forwardedRef as
          | React.MutableRefObject<HTMLTextAreaElement | null>
          | ((instance: HTMLTextAreaElement | null) => void)
          | null;

        if (typeof ref === "function") {
          ref(node);
        } else if (ref) {
          ref.current = node;
        }

        textareaRef.current = node;
      },
      [forwardedRef]
    );

    React.useEffect(() => {
      if (textareaRef.current) {
        adjustHeight();
      }
    }, [value, adjustHeight, isExpanded]);

    React.useEffect(() => {
      if (isExpanded) {
        const handleResize = () => adjustHeight();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
      }
    }, [isExpanded, adjustHeight]);

    return (
      <textarea
        className={cn(
          "w-full resize-none bg-transparent shadow-sm",
          // "rounded-xl border border-border",
          "border-none",
          "px-3 py-2",
          "text-sm leading-5",
          "placeholder:text-muted-foreground",
          "focus-visible:ring-0.5 focus-visible:ring-ring focus-visible:border-primary/50 focus-visible:outline-none",
          "disabled:cursor-not-allowed disabled:opacity-50",
          showScroll ? "overflow-y-auto" : "overflow-hidden",
          // Custom scrollbar
          "[&::-webkit-scrollbar]:w-[3px]",
          "[&::-webkit-scrollbar-track]:bg-transparent",
          "[&::-webkit-scrollbar-thumb]:bg-border",
          "[&::-webkit-scrollbar-thumb]:rounded-full",
          "[&::-webkit-scrollbar-thumb]:hover:bg-muted-foreground/50",
          className
        )}
        style={{
          minHeight: isExpanded ? "500px" : `${MIN_HEIGHT}px`,
          height: isExpanded ? "500px" : `${MIN_HEIGHT}px`,
          maxHeight: isExpanded ? "500px" : `${MAX_HEIGHT}px`,
        }}
        ref={handleRef}
        value={value}
        onChange={handleChange}
        {...props}
      />
    );
  }
);

TextArea.displayName = "TextArea";

export type { TextareaProps };
export { TextArea };
