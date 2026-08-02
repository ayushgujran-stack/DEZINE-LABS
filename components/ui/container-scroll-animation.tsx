"use client";
import React, { useRef } from "react";
import { useScroll, useTransform, motion, MotionValue } from "framer-motion";

export const ContainerScroll = ({
  titleComponent,
  children,
}: {
  titleComponent: string | React.ReactNode;
  children: React.ReactNode;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
  });
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  const scaleDimensions = () => {
    return isMobile ? [0.7, 0.9] : [1.05, 1];
  };

  const rotate = useTransform(scrollYProgress, [0, 1], [20, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], scaleDimensions());
  const translate = useTransform(scrollYProgress, [0, 1], [0, -100]);

  return (
    <div
      className="h-[42rem] md:h-[58rem] flex items-center justify-center relative p-2 md:p-6"
      ref={containerRef}
    >
      <div
        className="py-6 md:py-12 w-full relative"
        style={{
          perspective: "1000px",
        }}
      >
        <Header translate={translate} titleComponent={titleComponent} />
        <Card rotate={rotate} translate={translate} scale={scale}>
          {children}
        </Card>
      </div>
    </div>
  );
};

export const Header = ({ translate, titleComponent }: any) => {
  return (
    <motion.div
      style={{
        translateY: translate,
      }}
      className="div max-w-4xl mx-auto text-center"
    >
      {titleComponent}
    </motion.div>
  );
};

export const Card = ({
  rotate,
  scale,
  children,
}: {
  rotate: MotionValue<number>;
  scale: MotionValue<number>;
  translate: MotionValue<number>;
  children: React.ReactNode;
}) => {
  return (
    <motion.div
      style={{
        rotateX: rotate,
        scale,
        boxShadow:
          "0 0 50px rgba(0,0,0,0.8), 0 20px 40px rgba(0,245,212,0.08), 0 0 80px rgba(138,43,226,0.12)",
      }}
      className="max-w-4xl -mt-10 mx-auto h-[28rem] md:h-[34rem] w-full border border-white/15 p-2 md:p-4 bg-[#0e1118]/90 backdrop-blur-2xl rounded-[24px] shadow-2xl relative"
    >
      {/* Decorative camera dot for modern screen effect */}
      <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-14 h-2.5 bg-white/10 rounded-full hidden md:block z-20 pointer-events-none" />

      <div className="h-full w-full overflow-y-auto rounded-xl bg-[#090b10] border border-white/10 p-3 md:p-6 custom-scrollbar">
        {children}
      </div>
    </motion.div>
  );
};
