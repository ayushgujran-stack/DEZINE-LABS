import * as React from "react"
import { useMemo, useState, useRef, useCallback } from "react"
import {
    motion,
    stagger,
    useAnimate,
    type AnimationOptions,
} from "framer-motion"

export type WeightHoverSegment = {
    text: string
    color?: string
    fromWeight?: number
    toWeight?: number
    fromWidth?: number
    toWidth?: number
    italic?: boolean
    className?: string
    style?: React.CSSProperties
}

type StaggerFrom = "first" | "last" | "center" | "random"

export type Props = {
    label?: string
    segments?: WeightHoverSegment[]
    fromWeight?: number
    toWeight?: number
    fromWidth?: number
    toWidth?: number
    staggerDuration?: number
    staggerFrom?: StaggerFrom
    fontSize?: number | string
    fontFamily?: string
    color?: string
    lineHeight?: number | string
    letterSpacing?: string
    transition?: AnimationOptions
    onClick?: () => void
    style?: React.CSSProperties
    className?: string
    hoverScale?: number
    enableHoverMagnify?: boolean
}

export default function VariableFontHoverByLetter(props: Props) {
    const fullProps = { ...COMPONENT_DEFAULTS, ...props }
    const {
        label,
        segments,
        fromWeight,
        toWeight,
        fromWidth,
        toWidth,
        staggerDuration,
        staggerFrom,
        fontSize,
        fontFamily,
        color,
        lineHeight,
        letterSpacing,
        onClick,
        style,
        className,
        hoverScale,
        enableHoverMagnify,
    } = fullProps

    // Build flat array of letters with per-letter metadata
    const lettersData = useMemo(() => {
        if (segments && segments.length > 0) {
            const list: Array<{
                char: string
                color: string
                fromWeight: number
                toWeight: number
                fromWidth: number
                toWidth: number
                italic: boolean
                className?: string
                style?: React.CSSProperties
            }> = []

            segments.forEach((seg) => {
                const segFromW = seg.fromWeight ?? fromWeight
                const segToW = seg.toWeight ?? toWeight
                const segFromWd = seg.fromWidth ?? fromWidth
                const segToWd = seg.toWidth ?? toWidth
                const segColor = seg.color ?? color

                for (let i = 0; i < seg.text.length; i++) {
                    list.push({
                        char: seg.text[i],
                        color: segColor,
                        fromWeight: segFromW,
                        toWeight: segToW,
                        fromWidth: segFromWd,
                        toWidth: segToWd,
                        italic: !!seg.italic,
                        className: seg.className,
                        style: seg.style,
                    })
                }
            })
            return list
        }

        const text = label || ""
        return text.split("").map((char) => ({
            char,
            color,
            fromWeight,
            toWeight,
            fromWidth,
            toWidth,
            italic: false,
        }))
    }, [label, segments, fromWeight, toWeight, fromWidth, toWidth, color])

    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
    const containerRef = useRef<HTMLDivElement>(null)

    // Fluid pointer tracking for smooth sweeping across letters
    const handlePointerMove = useCallback(
        (e: React.PointerEvent<HTMLDivElement>) => {
            if (!enableHoverMagnify) return
            const target = e.target as HTMLElement
            const indexStr = target.getAttribute("data-letter-index")
            if (indexStr !== null) {
                const idx = parseInt(indexStr, 10)
                if (!isNaN(idx) && idx !== hoveredIndex) {
                    setHoveredIndex(idx)
                }
            }
        },
        [enableHoverMagnify, hoveredIndex]
    )

    const handlePointerLeave = useCallback(() => {
        setHoveredIndex(null)
    }, [])

    const springTransition = useMemo(
        () => ({
            type: "spring",
            stiffness: 420,
            damping: 24,
            mass: 0.5,
        }),
        []
    )

    const innerSpanStyle: React.CSSProperties = {
        fontFamily: fontFamily || 'var(--font-sans, "Archivo", sans-serif)',
        fontSize: typeof fontSize === "number" ? `${fontSize}px` : fontSize,
        lineHeight: lineHeight ?? 0.88,
        letterSpacing: letterSpacing ?? "-0.02em",
        display: "inline-flex",
        alignItems: "baseline",
        flexWrap: "nowrap",
        userSelect: "none",
    }

    const srOnlyStyle: React.CSSProperties = {
        position: "absolute",
        width: 1,
        height: 1,
        padding: 0,
        margin: -1,
        overflow: "hidden",
        clip: "rect(0,0,0,0)",
        whiteSpace: "nowrap",
        borderWidth: 0,
    }

    const accessibleText = useMemo(() => {
        if (segments && segments.length > 0) {
            return segments.map((s) => s.text).join("")
        }
        return label || ""
    }, [segments, label])

    return (
        <div
            ref={containerRef}
            className={className}
            style={{
                display: "inline-flex",
                alignItems: "baseline",
                cursor: onClick ? "pointer" : "default",
                ...style,
            }}
            onPointerMove={handlePointerMove}
            onPointerLeave={handlePointerLeave}
            onClick={onClick}
        >
            <style>{INTER_VARIABLE_FONT_FACE}</style>
            <span style={srOnlyStyle}>{accessibleText}</span>

            <span style={innerSpanStyle} aria-hidden>
                {lettersData.map((item, i) => {
                    const isSpace = item.char === " "

                    // Distance falloff calculation from hovered letter
                    let t = 0
                    if (hoveredIndex !== null) {
                        const dist = Math.abs(i - hoveredIndex)
                        if (dist === 0) {
                            t = 1.0 // Directly hovered letter
                        } else if (dist === 1) {
                            t = 0.58 // Immediate neighbour
                        } else if (dist === 2) {
                            t = 0.22 // Second neighbour
                        } else if (dist === 3) {
                            t = 0.08
                        }
                    }

                    const currentWeight = Math.round(
                        item.fromWeight + (item.toWeight - item.fromWeight) * t
                    )
                    const currentWidth = Math.round(
                        item.fromWidth + (item.toWidth - item.fromWidth) * t
                    )
                    const currentScale = 1 + (hoverScale - 1) * t
                    const currentY = -4 * t

                    const fvs = `'wdth' ${currentWidth}, 'wght' ${currentWeight}`

                    if (isSpace) {
                        return (
                            <span
                                key={i}
                                data-letter-index={i}
                                style={{
                                    display: "inline-block",
                                    width: "0.28em",
                                    whiteSpace: "pre",
                                }}
                            >
                                {" "}
                            </span>
                        )
                    }

                    return (
                        <motion.span
                            key={i}
                            data-letter-index={i}
                            className={`letter ${item.className || ""}`}
                            style={{
                                display: "inline-block",
                                whiteSpace: "pre",
                                color: item.color,
                                fontStyle: item.italic ? "italic" : "normal",
                                transformOrigin: "bottom center",
                                willChange: "transform, font-variation-settings",
                                ...item.style,
                            }}
                            animate={{
                                fontVariationSettings: fvs,
                                scale: currentScale,
                                y: currentY,
                            }}
                            transition={springTransition}
                            onPointerEnter={() => {
                                if (enableHoverMagnify) setHoveredIndex(i)
                            }}
                        >
                            {item.char}
                        </motion.span>
                    )
                })}
            </span>
        </div>
    )
}

const INTER_VARIABLE_FONT_FACE = `
@font-face {
    font-family: "InterVariableFramer";
    src: url("https://rsms.me/inter/font-files/InterVariable.woff2?v=4.0") format("woff2-variations");
    font-weight: 100 900;
    font-style: normal;
    font-display: swap;
}
`

const COMPONENT_DEFAULTS = {
    label: "DEZINE LABS",
    fromWeight: 600,
    toWeight: 900,
    fromWidth: 72,
    toWidth: 96,
    fontSize: 120,
    color: "#FFFFFF",
    staggerDuration: 30,
    staggerFrom: "first" as StaggerFrom,
    hoverScale: 1.1,
    enableHoverMagnify: true,
}