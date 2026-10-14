import React from "react"
import ReactDOM from "react-dom/client"
import VariableFontHoverByLetter from "../components/originkit/ui/weight-hover"

function HeroHeadline() {
    return (
        <div
            className="flex flex-col justify-center w-full select-none"
            style={{
                width: "100%",
                maxWidth: "100%",
                overflow: "visible",
            }}
        >
            {/* Line 1: DEZINE LABS */}
            <h1
                className="mw-hero__line"
                style={{
                    margin: 0,
                    padding: 0,
                    display: "flex",
                    alignItems: "baseline",
                    justifyContent: "flex-start",
                    width: "100%",
                    overflow: "visible",
                }}
            >
                <VariableFontHoverByLetter
                    label="DEZINE LABS"
                    fromWeight={700}
                    toWeight={900}
                    fromWidth={72}
                    toWidth={95}
                    hoverScale={1.1}
                    color="var(--color-text, #edeae4)"
                    fontSize="clamp(44px, 12.2vw, 185px)"
                    fontFamily="var(--font-sans, 'Archivo', sans-serif)"
                    lineHeight={0.88}
                    letterSpacing="-0.02em"
                    enableHoverMagnify={true}
                    style={{
                        width: "100%",
                        overflow: "visible",
                    }}
                />
            </h1>

            {/* Line 2: CREATIVE STUDIO (Right-aligned, beautifully proportioned so it's never cut off) */}
            <div
                className="mw-hero__line mw-hero__line--second"
                style={{
                    margin: 0,
                    padding: 0,
                    display: "flex",
                    alignItems: "baseline",
                    justifyContent: "flex-end",
                    width: "100%",
                    overflow: "visible",
                }}
            >
                <VariableFontHoverByLetter
                    segments={[
                        {
                            text: "CREATIVE",
                            color: "var(--color-text, #edeae4)",
                            fromWeight: 700,
                            toWeight: 900,
                            fromWidth: 72,
                            toWidth: 95,
                            italic: false,
                        },
                        {
                            text: " ",
                            color: "transparent",
                            fromWeight: 400,
                            toWeight: 400,
                            fromWidth: 72,
                            toWidth: 72,
                        },
                        {
                            text: "STUDIO",
                            color: "var(--color-accent, #7fa8ff)",
                            fromWeight: 250,
                            toWeight: 700,
                            fromWidth: 120,
                            toWidth: 125,
                            italic: true,
                        },
                    ]}
                    fromWeight={700}
                    toWeight={900}
                    fromWidth={72}
                    toWidth={95}
                    hoverScale={1.1}
                    fontSize="clamp(34px, 9.4vw, 142px)"
                    fontFamily="var(--font-sans, 'Archivo', sans-serif)"
                    lineHeight={0.88}
                    letterSpacing="-0.02em"
                    enableHoverMagnify={true}
                    style={{
                        display: "inline-flex",
                        justifyContent: "flex-end",
                        overflow: "visible",
                    }}
                />
            </div>
        </div>
    )
}

const rootEl = document.getElementById("hero-headline-root")
if (rootEl) {
    ReactDOM.createRoot(rootEl).render(<HeroHeadline />)
}
