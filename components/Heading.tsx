import React from "react";

interface HeadingProps {
  title: string;
  desc?: string;
  element?: React.ReactNode;
}

const Heading = ({ title, desc, element }: HeadingProps) => {
  return (
    <div className="w-full">
      <h2 className="text-3xl sm:text-4xl md:text-[50px] font-medium text-dark tracking-[-1.4px] max-w-160">
        {title}
      </h2>
      <div className="w-full flex items-center justify-between gap-6">
        {desc && (
          <p className="mt-3 text-dark text-sm sm:text-base leading-[25.2px] tracking-tight max-w-160">
            {desc}
          </p>
        )}
        {element}
      </div>
    </div>
  );
};

export default Heading;
