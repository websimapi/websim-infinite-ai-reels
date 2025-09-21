import { jsxDEV } from "react/jsx-dev-runtime";
import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  Series,
  Audio
} from "remotion";
const Title = ({ text, textColor, fontFamily }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });
  const scale = interpolate(frame, [0, 10], [1.2, 1], { extrapolateRight: "clamp" });
  return /* @__PURE__ */ jsxDEV("h1", { style: {
    fontFamily,
    color: textColor,
    fontSize: "120px",
    textAlign: "center",
    margin: "0 40px",
    opacity,
    transform: `scale(${scale})`
  }, children: text }, void 0, false, {
    fileName: "<stdin>",
    lineNumber: 17,
    columnNumber: 9
  });
};
const ScriptLine = ({ text, textColor, fontFamily }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const opacity = interpolate(
    frame,
    [0, 15, durationInFrames - 15, durationInFrames],
    [0, 1, 1, 0]
  );
  const translateY = interpolate(frame, [0, 15], [50, 0]);
  return /* @__PURE__ */ jsxDEV("p", { style: {
    fontFamily,
    color: textColor,
    fontSize: "80px",
    textAlign: "center",
    margin: "0 60px",
    opacity,
    transform: `translateY(${translateY}px)`
  }, children: text }, void 0, false, {
    fileName: "<stdin>",
    lineNumber: 43,
    columnNumber: 9
  });
};
const ReelComposition = ({ title, script, visualStyle, music }) => {
  const { backgroundColor, textColor, fontFamily } = visualStyle;
  const musicUrl = "uplifting_music.mp3";
  return /* @__PURE__ */ jsxDEV(AbsoluteFill, { style: { backgroundColor, justifyContent: "center", alignItems: "center" }, children: [
    /* @__PURE__ */ jsxDEV(Audio, { src: musicUrl, loop: true, volume: 0.5 }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 66,
      columnNumber: 13
    }),
    /* @__PURE__ */ jsxDEV(Series, { children: [
      /* @__PURE__ */ jsxDEV(Series.Sequence, { durationInFrames: 90, children: /* @__PURE__ */ jsxDEV(AbsoluteFill, { style: { justifyContent: "center", alignItems: "center" }, children: /* @__PURE__ */ jsxDEV(Title, { text: title, textColor, fontFamily }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 70,
        columnNumber: 25
      }) }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 69,
        columnNumber: 21
      }) }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 68,
        columnNumber: 17
      }),
      script.map((line, index) => /* @__PURE__ */ jsxDEV(Series.Sequence, { durationInFrames: 60, children: /* @__PURE__ */ jsxDEV(AbsoluteFill, { style: { justifyContent: "center", alignItems: "center" }, children: /* @__PURE__ */ jsxDEV(ScriptLine, { text: line, textColor, fontFamily }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 76,
        columnNumber: 29
      }) }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 75,
        columnNumber: 26
      }) }, index, false, {
        fileName: "<stdin>",
        lineNumber: 74,
        columnNumber: 21
      })),
      /* @__PURE__ */ jsxDEV(Series.Sequence, { durationInFrames: 30 }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 80,
        columnNumber: 18
      })
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 67,
      columnNumber: 13
    })
  ] }, void 0, true, {
    fileName: "<stdin>",
    lineNumber: 65,
    columnNumber: 9
  });
};
export {
  ReelComposition
};
